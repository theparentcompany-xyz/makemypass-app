import { SelfCheckInData } from './types';
import jsPDF from 'jspdf';

export const printTicket = async ({ printData }: { printData: SelfCheckInData }) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'dl',
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
