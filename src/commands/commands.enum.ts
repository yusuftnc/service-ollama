// PartitionsStatus defines partitions.
export enum PartitionsStatus {
  'AE' = 'Away modda giriş süresi',
  'UN' = 'bilinmeyen partition',
  'AA' = 'Away modda kurulu(FULL)',
  'NE' = 'NIGHT modda giriş süresi',
  'NA' = 'NIGHT modda kurulu',
  'SE' = 'Stay modda giriş süresi',
  'SA' = 'STAY modda panel kurulu',
  'ED' = 'Çıkış Süresli (Kontol panelinin nasıl kurulacağı bilinmiyor)',
  'DR' = 'Kurulu değil, kuruluma hazır',
  'DN' = 'Kurulu değil, kurulmaya hazır değil',
}

// AlarmZones defines zones
export enum Alarmzones {
  'N' = 'Panelde aktif alarm yok',
  'B' = 'Hırsızlık alarmı mevcut',
  'F' = 'Yangın alarmı mevcut',
}

export enum PanelStatus {
  'OK' = 'Komut başarılı bir şekilde iletildi ve cevap alındı',
  'ERR_AUTH' = 'Kullanıcı şifresi hatası',
  'ERR_HARDWARE' = 'Panel ile OLLAMA arasında iletişim yok',
  'ERR_CONFIG' = 'Panel kontrolü desteklemiyor',
  'ERR_FORMAT' = 'Parola belirtilmemiş veya komutun ayrıştırılmasıyla ilgili diğer sorunlar',
}

export const OollamaType = {
  'LX' : 'LX',
  'CP' : 'CP',
  'PX' : 'PX',
}

export const OutputType = {
  1: 'sab',
  2: 'aux',
  3: 'aux2',
}