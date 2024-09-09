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
  orientation: string;
  unit: string;
  format: string;
}

export interface SelfCheckInData {
  qr: QRData;
  data: DataItem[];
  printerData: PrinterData;
}
