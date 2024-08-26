import './SelfCheckIn.css';
import jsPDF from 'jspdf';

const SelfCheckIn = () => {
  const printData = {
    qr: {
      url: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dev-api.buildnship.in/makemypass-media/ticket/2cc99e72-64da-403c-963b-4083b990caac.png',
      x: 10,
      y: 10,
    },
    data: [
      {
        value: 'Adnan Kattekadan',
        x: 35,
        y: 60,
        fontSize: 20,
      },
      {
        value: 'Hoomans Project',
        x: 33,
        y: 70,
        fontSize: 20,
      },
      {
        value: 'Self CheckIn V.0.0',
        x: 35,
        y: 80,
        fontSize: 20,
      },
    ],
    printerData: {
      orientation: 'portrait',
      unit: 'mm',
      format: 'dl',
    },
  };

  const printTicket = async () => {
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
      img.src = printData.qr.url;
    });

    // Add QR code to PDF
    pdf.addImage(img, 'PNG', printData.qr.x, printData.qr.y, 40, 40);

    // Add text data to PDF
    printData.data.forEach((item) => {
      pdf.setFontSize(item.fontSize || 16);
      pdf.text(item.value, item.x, item.y, { align: 'center' });
    });

    // Print the PDF directly
    pdf.autoPrint();
    pdf.output('dataurlnewwindow');
  };

  return (
    <>
      <div className='printableContent'></div>
      <img src={printData.qr.url} alt='QR Code' />
      {printData.data.map((item, index) => (
        <p key={index} style={{ fontSize: item.fontSize }}>
          {item.value}
        </p>
      ))}
      <button className='printButton' onClick={printTicket}>
        Print
      </button>
    </>
  );
};

export default SelfCheckIn;
