import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { renderInCaptureIframe, cleanupCaptureIframe } from './invoiceCapture';

export const exportToPDF = async (elementId, filename = 'invoice.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice preview not found. Please wait for the page to load.');
  }

  let iframe;
  try {
    const { iframe: capIframe, target } = await renderInCaptureIframe(element);
    iframe = capIframe;

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: target.scrollWidth,
      height: target.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5;
    const contentWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } finally {
    cleanupCaptureIframe(iframe);
  }
};

export const exportToPNG = async (elementId, filename = 'invoice.png') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice preview not found');

  let iframe;
  try {
    const { iframe: capIframe, target } = await renderInCaptureIframe(element);
    iframe = capIframe;

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    cleanupCaptureIframe(iframe);
  }
};

export const printElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the invoice.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html><head><title>Print Invoice</title>
    <style>
      @page { size: A4; margin: 8mm; }
      body { margin: 0; font-family: Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      table { border-collapse: collapse; }
    </style>
    </head><body>${element.outerHTML}</body></html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};

export const shareWhatsApp = (invoiceNumber, amount, phone) => {
  const text = encodeURIComponent(
    `Invoice ${invoiceNumber} for ₹${amount} is ready. Please find the details attached.`
  );
  const url = phone
    ? `https://wa.me/91${phone.replace(/\D/g, '')}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, '_blank');
};

export const emailInvoice = (email, invoiceNumber) => {
  const subject = encodeURIComponent(`Invoice ${invoiceNumber}`);
  const body = encodeURIComponent(`Dear Customer,\n\nPlease find attached invoice ${invoiceNumber}.\n\nThank you for your business.`);
  window.open(`mailto:${email || ''}?subject=${subject}&body=${body}`);
};
