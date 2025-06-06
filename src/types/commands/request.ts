export interface IOLLAMARequest {
  model: string;
  prompt?: string;
  messages?: { role: "system" | "user" | "assistant"; content: string }[];
  stream?: boolean;
}
