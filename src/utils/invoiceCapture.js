/** Self-contained hex/rgb styles for PDF capture — no oklch, no external Tailwind */
export const INVOICE_PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; background: #ffffff; color: #000000; font-family: Arial, Helvetica, sans-serif; }
  .invoice-print-area { width: 210mm; min-height: 297mm; background: #ffffff; color: #000000; margin: 0 auto; }
  table { border-collapse: collapse; width: 100%; }
  .inv-cell { border: 1px solid #000000; padding: 6px 8px; vertical-align: top; }
  .inv-label { font-size: 11px; font-weight: 600; }
  .inv-text-xs { font-size: 10px; }
  .inv-text-sm { font-size: 12px; }
  .inv-bold { font-weight: 700; }
  .inv-italic { font-style: italic; }
  .inv-center { text-align: center; }
  .inv-right { text-align: right; }
  .inv-left { text-align: left; }
  .inv-bg-gray { background-color: #f3f4f6; }
  .inv-border-black { border: 1px solid #000000; }
  .inv-border-b { border-bottom: 1px solid #000000; }
  .inv-border-b-blue { border-bottom: 2px solid #1a5fb8; }
  .inv-p-4 { padding: 16px; }
  .inv-p-8 { padding: 32px; }
  .inv-mb-1 { margin-bottom: 4px; }
  .inv-mb-2 { margin-bottom: 8px; }
  .inv-mb-4 { margin-bottom: 16px; }
  .inv-mt-1 { margin-top: 4px; }
  .inv-mt-2 { margin-top: 8px; }
  .inv-mt-4 { margin-top: 16px; }
  .inv-mt-6 { margin-top: 24px; }
  .inv-ml-1 { margin-left: 4px; }
  .inv-flex { display: flex; }
  .inv-flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
  .inv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .inv-text-blue { color: #1a5fb8; }
  .inv-text-gray { color: #4b5563; }
  .inv-text-muted { color: #9ca3af; }
  .inv-bg-blue { background-color: #1a5fb8; color: #ffffff; }
  .inv-header-blue { background-color: #1a5fb8; color: #ffffff; }
  .inv-header-blue th { border: 1px solid #1a5fb8; padding: 8px; text-align: left; font-size: 11px; }
  .inv-header-blue th.inv-right { text-align: right; }
  .inv-row td { border: 1px solid #d1d5db; padding: 8px; font-size: 11px; }
  .inv-logo { width: 64px; height: 64px; object-fit: contain; }
  .inv-sign { height: 48px; object-fit: contain; }
  .inv-footer { text-align: center; font-size: 10px; color: #6b7280; margin-top: 16px; padding-top: 8px; border-top: 1px solid #e5e7eb; }
  .inv-totals { width: 224px; font-size: 11px; }
  .inv-totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
  .inv-grand-total { display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #1a5fb8; font-weight: 700; font-size: 13px; margin-top: 4px; }
`;

export const renderInCaptureIframe = async (element) => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;border:0;visibility:hidden;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${INVOICE_PRINT_CSS}</style></head><body></body></html>`);
  doc.close();

  const clone = element.cloneNode(true);
  // Remove Tailwind class attributes — they pull oklch from parent stylesheets
  clone.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'));
  clone.id = element.id;
  clone.className = 'invoice-print-area';
  clone.style.width = '210mm';
  clone.style.background = '#ffffff';
  clone.style.color = '#000000';

  doc.body.appendChild(clone);

  await new Promise((r) => setTimeout(r, 200));

  const images = clone.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) return resolve();
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000);
        })
    )
  );

  return { iframe, target: clone };
};

export const cleanupCaptureIframe = (iframe) => {
  if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
};
