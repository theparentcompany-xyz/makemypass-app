import { jsPDF } from 'jspdf';

import type { SelfCheckInData } from './types';

export const printTicket = async ({ printData }: { printData: SelfCheckInData }) => {
  const pdf = new jsPDF({
    orientation:
      (printData?.printerData.orientation as 'p' | 'portrait' | 'l' | 'landscape') || 'p',
    unit:
      (printData?.printerData.unit as 'mm' | 'pt' | 'px' | 'in' | 'cm' | 'ex' | 'em' | 'pc') ||
      'mm',
    format: (printData?.printerData.format as string | number[]) || 'a4',
  });

  // Load QR code image
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = printData?.qr?.url;
  });

  // Add QR code to PDF
  pdf.addImage(img, 'PNG', printData.qr.x, printData.qr.y, 40, 40);

  // Add text data to PDF
  printData.data.forEach(
    (item: { fontSize: number; value: string | string[]; x: number; y: number }) => {
      pdf.setFontSize(item.fontSize || 16);
      pdf.text(item.value, item.x, item.y, { align: 'center' });
    },
  );

  // Print the PDF directly
  pdf.autoPrint();
  pdf.output('dataurlnewwindow');
};
