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
  orientation: 'portrait' | 'landscape';
  unit: 'mm' | 'inch';
  format: 'dl' | 'a4' | 'letter';
}

export interface SelfCheckInData {
  qr: QRData;
  data: DataItem[];
  printerData: PrinterData;
}
