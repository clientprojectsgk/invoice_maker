import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineDownload, HiOutlinePrinter, HiOutlineMail, HiOutlineDuplicate, HiOutlineArrowLeft } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import InvoiceTemplateRenderer from '../components/invoice/InvoiceTemplateRenderer';
import { INVOICE_FORMATS } from '../utils/constants';
import Button from '../components/common/Button';
import { StatusBadge } from '../components/common/FormField';
import { PageHeader } from '../components/common/PageHeader';
import { exportToPDF, exportToPNG, printElement, shareWhatsApp, emailInvoice } from '../utils/pdfExport';

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { invoices, settings, duplicateInvoice } = useApp();
  const invoice = invoices.find((i) => i.id === id);
  const [format, setFormat] = useState(location.state?.format || 'tally');
  const [exporting, setExporting] = useState(false);

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Invoice not found</p>
        <Button className="mt-4" onClick={() => navigate('/invoices')}>Back to Invoices</Button>
      </div>
    );
  }

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF('invoice-preview', `${invoice.invoiceNumber}.pdf`);
      Swal.fire({ icon: 'success', title: 'Downloaded!', text: 'PDF saved successfully', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'PDF Failed', text: err.message || 'Could not generate PDF' });
    } finally {
      setExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      await exportToPNG('invoice-preview', `${invoice.invoiceNumber}.png`);
      Swal.fire({ icon: 'success', title: 'Downloaded!', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Export Failed', text: err.message });
    } finally {
      setExporting(false);
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateInvoice(invoice.id);
    if (dup) {
      Swal.fire('Duplicated!', `New draft: ${dup.invoiceNumber}`, 'success');
      navigate(`/invoices/${dup.id}`, { state: { format } });
    }
  };

  return (
    <div className="space-y-5">
      <div className="no-print">
        <PageHeader
          title={invoice.invoiceNumber}
          subtitle={<StatusBadge status={invoice.status} />}
          action={
            <Button variant="ghost" icon={HiOutlineArrowLeft} onClick={() => navigate('/invoices')}>Back</Button>
          }
        />

        {/* Format selector */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Choose Invoice Format</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INVOICE_FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  format === f.id
                    ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 m-0">{f.label}</p>
                <p className="text-xs text-gray-500 m-0 mt-1">{f.description}</p>
                {format === f.id && (
                  <span className="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded">Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button icon={HiOutlineDownload} loading={exporting} onClick={handleExportPDF}>Download PDF</Button>
          <Button variant="secondary" size="sm" loading={exporting} onClick={handleExportPNG}>PNG</Button>
          <Button variant="secondary" size="sm" icon={HiOutlinePrinter} onClick={() => printElement('invoice-preview')}>Print</Button>
          <Button variant="secondary" size="sm" icon={HiOutlineMail} onClick={() => emailInvoice(invoice.customerEmail, invoice.invoiceNumber)}>Email</Button>
          <Button variant="secondary" size="sm" icon={FaWhatsapp} onClick={() => shareWhatsApp(invoice.invoiceNumber, invoice.totals?.grandTotal, invoice.customerPhone)}>WhatsApp</Button>
          <Button variant="secondary" size="sm" icon={HiOutlineDuplicate} onClick={handleDuplicate}>Duplicate</Button>
        </div>
      </div>

      {/* Invoice preview */}
      <div className="rounded-lg border border-gray-200 overflow-x-auto app-surface shadow-sm">
        <InvoiceTemplateRenderer invoice={invoice} settings={settings} format={format} />
      </div>
    </div>
  );
}
