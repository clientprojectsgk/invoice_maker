import { formatCurrency, formatDate } from '../../../utils/formatters';
import { amountInWords } from '../../../utils/amountInWords';
import { calcLineAmount } from './invoiceUtils';

export default function ModernTemplate({ invoice, settings }) {
  const totals = invoice.totals || {};

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#111827', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <div>
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" style={{ height: 40, objectFit: 'contain', marginBottom: 8 }} crossOrigin="anonymous" />
          ) : (
            <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{settings.companyName}</p>
          )}
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>{settings.address}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: 300, color: '#d1d5db', margin: 0, letterSpacing: '2px' }}>INVOICE</p>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>{invoice.invoiceNumber}</p>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{formatDate(invoice.invoiceDate)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 8px' }}>Billed To</p>
          <p style={{ fontWeight: 600, margin: 0 }}>{invoice.customerName}</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>{invoice.billingAddress}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 8px' }}>Details</p>
          <p style={{ fontSize: '13px', margin: 0 }}>Due: {formatDate(invoice.dueDate)}</p>
          {invoice.vehicleNumber && <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>Vehicle: {invoice.vehicleNumber}</p>}
        </div>
      </div>

      <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #111827' }}>
            {['Item', 'Qty', 'Rate', 'Amount'].map((h) => (
              <th key={h} style={{ padding: '8px 4px', textAlign: h === 'Item' ? 'left' : 'right', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((item, i) => {
            const { total } = calcLineAmount(item);
            return (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 4px' }}>
                  <p style={{ fontWeight: 500, margin: 0 }}>{item.product}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0' }}>HSN: {item.hsn}</p>
                </td>
                <td style={{ padding: '12px 4px', textAlign: 'right', fontSize: '13px' }}>{item.qty} {item.unit}</td>
                <td style={{ padding: '12px 4px', textAlign: 'right', fontSize: '13px' }}>{formatCurrency(item.price)}</td>
                <td style={{ padding: '12px 4px', textAlign: 'right', fontSize: '13px', fontWeight: 500 }}>{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: '280px' }}>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px' }}>Amount in words</p>
          <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>{amountInWords(totals.grandTotal || 0)}</p>
        </div>
        <div style={{ width: '180px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span style={{ color: '#6b7280' }}>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span style={{ color: '#6b7280' }}>Tax</span><span>{formatCurrency(totals.totalGst)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #111827', fontWeight: 700, fontSize: '16px', marginTop: '4px' }}>
            <span>Total</span><span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0, maxWidth: '300px' }}>{settings.declaration}</p>
        <div style={{ textAlign: 'right' }}>
          {settings.signature && <img src={settings.signature} alt="Sign" style={{ height: 40, objectFit: 'contain', display: 'block', marginLeft: 'auto' }} crossOrigin="anonymous" />}
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '8px 0 0' }}>Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
