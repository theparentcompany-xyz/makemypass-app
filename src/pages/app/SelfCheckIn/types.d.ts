interface QRData {
  url: string;
  x: number;
  y: number;
}

export interface DataItem {
  value: string;
  x: number;
  y: number;
  fontSize: number;
}

interface PrinterData {
  orientation?: 'p' | 'portrait' | 'l' | 'landscape',
  unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc',
  format?: string | number[],
  compressPdf?: boolean
}

export interface SelfCheckInData {
  qr: QRData;
  data: DataItem[];
  printerData: PrinterData;
}
