import { formatCurrency, formatDate } from '../../utils/formatters';
import { amountInWords } from '../../utils/amountInWords';
import { useApp } from '../../context/AppContext';

export default function InvoicePreview({ invoice, id = 'invoice-preview' }) {
  const { settings } = useApp();
  const totals = invoice.totals || {};
  const isInterState = invoice.isInterState;

  return (
    <div id={id} className="bg-white text-slate-800 p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-primary-600 pb-4 mb-4">
        <div className="flex items-start gap-4">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
              {settings.companyName?.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="text-xl font-bold text-primary-600">{settings.companyName}</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">{settings.address}</p>
            <p className="text-xs text-slate-500">GSTIN: {settings.gst}</p>
            <p className="text-xs text-slate-500">Ph: {settings.phone} | {settings.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-2xl font-bold text-slate-800">TAX INVOICE</h4>
          <table className="text-xs mt-2 ml-auto">
            <tbody>
              <tr><td className="text-slate-500 pr-3 py-0.5">Invoice No:</td><td className="font-semibold">{invoice.invoiceNumber}</td></tr>
              <tr><td className="text-slate-500 pr-3 py-0.5">Date:</td><td className="font-semibold">{formatDate(invoice.invoiceDate)}</td></tr>
              <tr><td className="text-slate-500 pr-3 py-0.5">Due Date:</td><td className="font-semibold">{formatDate(invoice.dueDate)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyer & Consignee */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-slate-200 rounded-lg p-3">
          <h6 className="text-xs font-bold text-primary-600 uppercase mb-2">Bill To</h6>
          <p className="font-semibold text-sm">{invoice.customerName}</p>
          <p className="text-xs text-slate-500 mt-1">{invoice.billingAddress}</p>
          <p className="text-xs text-slate-500">GSTIN: {invoice.customerGst || 'N/A'}</p>
          <p className="text-xs text-slate-500">Ph: {invoice.customerPhone}</p>
        </div>
        <div className="border border-slate-200 rounded-lg p-3">
          <h6 className="text-xs font-bold text-primary-600 uppercase mb-2">Ship To</h6>
          <p className="font-semibold text-sm">{invoice.customerName}</p>
          <p className="text-xs text-slate-500 mt-1">{invoice.shippingAddress || invoice.billingAddress}</p>
          {invoice.vehicleNumber && <p className="text-xs text-slate-500">Vehicle: {invoice.vehicleNumber}</p>}
          {invoice.transportName && <p className="text-xs text-slate-500">Transport: {invoice.transportName}</p>}
        </div>
      </div>

      {/* Products Table */}
      <table className="w-full text-xs border border-slate-200 mb-4">
        <thead>
          <tr className="bg-primary-600 text-white">
            <th className="px-2 py-2 text-left">#</th>
            <th className="px-2 py-2 text-left">Description</th>
            <th className="px-2 py-2 text-left">HSN</th>
            <th className="px-2 py-2 text-right">Qty</th>
            <th className="px-2 py-2 text-left">Unit</th>
            <th className="px-2 py-2 text-right">Rate</th>
            <th className="px-2 py-2 text-right">Disc%</th>
            <th className="px-2 py-2 text-right">GST%</th>
            <th className="px-2 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((item, i) => {
            const taxable = (item.qty * item.price) * (1 - (item.discount || 0) / 100);
            const gstAmt = taxable * (item.gst || 0) / 100;
            return (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-2 py-2">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{item.product}</td>
                <td className="px-2 py-2">{item.hsn}</td>
                <td className="px-2 py-2 text-right">{item.qty}</td>
                <td className="px-2 py-2">{item.unit}</td>
                <td className="px-2 py-2 text-right">{formatCurrency(item.price)}</td>
                <td className="px-2 py-2 text-right">{item.discount || 0}</td>
                <td className="px-2 py-2 text-right">{item.gst}%</td>
                <td className="px-2 py-2 text-right font-medium">{formatCurrency(taxable + gstAmt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-xs text-slate-500 mb-1">Amount in Words:</p>
          <p className="text-sm font-semibold italic">{amountInWords(totals.grandTotal || 0)}</p>
        </div>
        <div className="w-64 text-xs">
          <div className="flex justify-between py-1"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          {totals.totalDiscount > 0 && <div className="flex justify-between py-1"><span>Discount</span><span>-{formatCurrency(totals.totalDiscount)}</span></div>}
          {isInterState ? (
            <div className="flex justify-between py-1"><span>IGST</span><span>{formatCurrency(totals.igst)}</span></div>
          ) : (
            <>
              <div className="flex justify-between py-1"><span>CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
              <div className="flex justify-between py-1"><span>SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
            </>
          )}
          {(totals.transport > 0) && <div className="flex justify-between py-1"><span>Transport</span><span>{formatCurrency(totals.transport)}</span></div>}
          <div className="flex justify-between py-2 border-t-2 border-primary-600 font-bold text-sm mt-1">
            <span>Grand Total</span><span className="text-primary-600">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Bank & Declaration */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
        <div>
          <h4 className="text-xs font-bold text-slate-600 mb-1">Bank Details</h4>
          <p className="text-xs text-slate-500">Bank: {settings.bankName}</p>
          <p className="text-xs text-slate-500">A/C: {settings.bankAccount}</p>
          <p className="text-xs text-slate-500">IFSC: {settings.bankIFSC}</p>
          <p className="text-xs text-slate-500 mt-2">{settings.declaration}</p>
        </div>
        <div className="text-right">
          <div className="inline-block">
            {settings.signature ? (
              <img src={settings.signature} alt="Signature" className="h-12 object-contain mb-1" />
            ) : (
              <div className="h-12" />
            )}
            <p className="text-xs font-semibold border-t border-slate-300 pt-1">Authorized Signatory</p>
            <p className="text-xs text-slate-500">{settings.companyName}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 pt-2 border-t border-slate-100">
        <p className="text-[10px] text-slate-400">This is a computer generated invoice</p>
      </div>
    </div>
  );
}
