import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export interface PdfFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  uploadDate: string;
  path: string;
}

export interface PdfMetadata {
  pdfs: PdfFile[];
}

@Injectable()
export class FilesService {
  private readonly dataDir = path.join(process.cwd(), 'data');
  private readonly pdfDir = path.join(this.dataDir, 'pdf');
  private readonly metadataFile = path.join(this.dataDir, 'files-metadata.json');

  constructor() {
    this.ensureDirectoriesExist();
  }

  /**
   * Gerekli klasörlerin var olduğundan emin ol
   */
  private ensureDirectoriesExist(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.pdfDir)) {
      fs.mkdirSync(this.pdfDir, { recursive: true });
    }
    if (!fs.existsSync(this.metadataFile)) {
      this.saveMetadata({ pdfs: [] });
    }
  }

  /**
   * Metadata dosyasını oku
   */
  private readMetadata(): PdfMetadata {
    try {
      const data = fs.readFileSync(this.metadataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading metadata:', error);
      return { pdfs: [] };
    }
  }

  /**
   * Metadata dosyasını kaydet
   */
  private saveMetadata(metadata: PdfMetadata): void {
    try {
      fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw new Error('Failed to save metadata');
    }
  }

  /**
   * Dosya adını normalize et (Türkçe karakterler dahil)
   */
  private normalizeFilename(filename: string): string {
    // Unicode normalization ve combining karakterleri temizle
    let cleaned = filename
      .normalize('NFD') // Decompose karakterleri
      .replace(/[\u0300-\u036f]/g, '') // Combining marks'ları kaldır
      .normalize('NFC'); // Tekrar compose et
    
    // Türkçe karakterleri Latin'e çevir
    const turkishMap: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G', 
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U'
    };
    
    for (const [turkish, latin] of Object.entries(turkishMap)) {
      cleaned = cleaned.replace(new RegExp(turkish, 'g'), latin);
    }
    
    const result = cleaned
      // Özel karakterleri underscore ile değiştir
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      // Birden fazla underscore'u tek underscore yap
      .replace(/_+/g, '_')
      // Başında ve sonunda underscore varsa temizle
      .replace(/^_+|_+$/g, '')
      // Küçük harfe çevir
      .toLowerCase()
      // Maksimum 50 karakter
      .substring(0, 50);
    
    return result;
  }

  /**
   * PDF dosyası upload et
   */
  async uploadPdf(file: Express.Multer.File): Promise<PdfFile> {
    const id = uuidv4();
    const timestamp = Date.now();
    
    // Dosya adını doğru encoding ile decode et
    let originalName = file.originalname;
    try {
      // Eğer dosya adı bozuk encoding'de geliyorsa, düzelt
      originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (error) {
      console.log('Filename decoding failed, using original:', originalName);
    }
    
    const normalizedOriginalName = this.normalizeFilename(
      path.parse(originalName).name
    );
    const filename = `${normalizedOriginalName}_${timestamp}.pdf`;
    const filePath = path.join(this.pdfDir, filename);

    // Dosyayı kaydet
    fs.writeFileSync(filePath, file.buffer);

    // Metadata oluştur
    const pdfFile: PdfFile = {
      id,
      originalName: originalName, // Düzeltilmiş adı kullan
      filename,
      size: file.size,
      uploadDate: new Date().toISOString(),
      path: filePath,
    };

    // Metadata'yı güncelle
    const metadata = this.readMetadata();
    metadata.pdfs.push(pdfFile);
    this.saveMetadata(metadata);

    return pdfFile;
  }

  /**
   * Tüm PDF dosyalarını listele
   */
  async getAllPdfs(): Promise<PdfFile[]> {
    const metadata = this.readMetadata();
    return metadata.pdfs;
  }

  /**
   * PDF dosyasını ID ile sil
   */
  async deletePdf(id: string): Promise<boolean> {
    const metadata = this.readMetadata();
    const fileIndex = metadata.pdfs.findIndex(pdf => pdf.id === id);

    if (fileIndex === -1) {
      return false;
    }

    const file = metadata.pdfs[fileIndex];

    // Fiziksel dosyayı sil
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    // Metadata'dan kaldır
    metadata.pdfs.splice(fileIndex, 1);
    this.saveMetadata(metadata);

    return true;
  }
} 