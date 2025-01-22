export interface PDFData {
  text: string;
  numpages: number;
  metadata: Record<string, any>;
  version: string;
}