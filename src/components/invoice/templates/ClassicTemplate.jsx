import { formatCurrency, formatDate } from '../../../utils/formatters';
import { amountInWords } from '../../../utils/amountInWords';
import { calcLineAmount } from './invoiceUtils';

const BLUE = '#1a5fb8';

export default function ClassicTemplate({ invoice, settings }) {
  const totals = invoice.totals || {};
  const isInterState = invoice.isInterState;
  const cell = { border: '1px solid #d1d5db', padding: '8px', fontSize: '11px' };

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#1f2937', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${BLUE}`, paddingBottom: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 64, height: 64, backgroundColor: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px', borderRadius: '4px' }}>
              {settings.companyName?.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: BLUE, margin: 0 }}>{settings.companyName}</h1>
            <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0' }}>{settings.address}</p>
            <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>GSTIN: {settings.gst || 'NA'}</p>
            <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Ph: {settings.phone} | {settings.email}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>TAX INVOICE</h2>
          <p style={{ fontSize: '11px', margin: '8px 0 0' }}><span style={{ color: '#6b7280' }}>Invoice No:</span> <strong>{invoice.invoiceNumber}</strong></p>
          <p style={{ fontSize: '11px', margin: '2px 0' }}><span style={{ color: '#6b7280' }}>Date:</span> <strong>{formatDate(invoice.invoiceDate)}</strong></p>
          <p style={{ fontSize: '11px', margin: '2px 0' }}><span style={{ color: '#6b7280' }}>Due:</span> <strong>{formatDate(invoice.dueDate)}</strong></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ border: '1px solid #d1d5db', padding: '12px', borderRadius: '4px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: BLUE, margin: '0 0 8px', textTransform: 'uppercase' }}>Bill To</p>
          <p style={{ fontWeight: 600, margin: 0 }}>{invoice.customerName}</p>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0' }}>{invoice.billingAddress}</p>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>GSTIN: {invoice.customerGst || 'N/A'}</p>
        </div>
        <div style={{ border: '1px solid #d1d5db', padding: '12px', borderRadius: '4px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: BLUE, margin: '0 0 8px', textTransform: 'uppercase' }}>Ship To</p>
          <p style={{ fontWeight: 600, margin: 0 }}>{invoice.customerName}</p>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0' }}>{invoice.shippingAddress || invoice.billingAddress}</p>
          {invoice.vehicleNumber && <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Vehicle: {invoice.vehicleNumber}</p>}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <thead>
          <tr style={{ backgroundColor: BLUE, color: '#ffffff' }}>
            {['#', 'Description', 'HSN', 'Qty', 'Unit', 'Rate', 'GST%', 'Amount'].map((h) => (
              <th key={h} style={{ ...cell, border: `1px solid ${BLUE}`, color: '#fff', textAlign: h === 'Qty' || h === 'Rate' || h === 'GST%' || h === 'Amount' ? 'right' : 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((item, i) => {
            const { total } = calcLineAmount(item);
            return (
              <tr key={i}>
                <td style={cell}>{i + 1}</td>
                <td style={cell}>{item.product}</td>
                <td style={cell}>{item.hsn}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{item.qty}</td>
                <td style={cell}>{item.unit}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{item.gst}%</td>
                <td style={{ ...cell, textAlign: 'right', fontWeight: 600 }}>{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>Amount in Words:</p>
          <p style={{ fontSize: '13px', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>{amountInWords(totals.grandTotal || 0)}</p>
        </div>
        <div style={{ width: '220px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          {isInterState ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>IGST</span><span>{formatCurrency(totals.igst)}</span></div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `2px solid ${BLUE}`, fontWeight: 700, fontSize: '13px', marginTop: '4px' }}>
            <span>Grand Total</span><span style={{ color: BLUE }}>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #d1d5db', paddingTop: '16px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, margin: '0 0 4px' }}>Bank Details</p>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>{settings.bankName} | A/C: {settings.bankAccount}</p>
          <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0' }}>{settings.declaration}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {settings.signature && <img src={settings.signature} alt="Sign" style={{ height: 48, objectFit: 'contain', marginLeft: 'auto', display: 'block' }} crossOrigin="anonymous" />}
          <p style={{ fontSize: '11px', fontWeight: 600, borderTop: '1px solid #9ca3af', paddingTop: '4px', display: 'inline-block', margin: '4px 0 0' }}>Authorized Signatory</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '10px', color: '#9ca3af', marginTop: '16px' }}>This is a Computer Generated Invoice</p>
    </div>
  );
}
