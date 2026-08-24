import dayjs from 'dayjs';
import { formatCurrency } from '../../../utils/formatters';
import { amountInWords } from '../../../utils/amountInWords';
import { calcLineAmount, getStateCode } from './invoiceUtils';

const cell = { border: '1px solid #000000', padding: '6px 8px', verticalAlign: 'top' };
const label = { fontSize: '11px', fontWeight: 600 };
const xs = { fontSize: '10px', margin: 0 };
const tbl = { width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', tableLayout: 'fixed' };

export default function TallyGridTemplate({ invoice, settings }) {
  const totals = invoice.totals || {};
  const items = invoice.items || [];
  const emptyRows = Math.max(0, 8 - items.length);
  const stateCode = getStateCode(settings.state);
  const custStateCode = getStateCode(invoice.customerState);
  const dated = invoice.invoiceDate ? dayjs(invoice.invoiceDate).format('DD-MMMM-YYYY') : '—';

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', color: '#000000', backgroundColor: '#ffffff' }}>
      <table style={tbl}>
        <colgroup>
          <col style={{ width: '50%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={cell} rowSpan={3}>
              <p style={{ ...label, margin: '0 0 4px 0' }}>{settings.companyName}</p>
              <p style={{ ...xs, lineHeight: 1.5 }}>{settings.address}</p>
              <p style={{ ...xs, marginTop: '4px' }}>GSTIN/UIN: {settings.gst || 'NA'}</p>
              <p style={xs}>State Name: {settings.state}, Code: {stateCode}</p>
              <p style={xs}>E-Mail: {settings.email}</p>
              <p style={xs}>Contact: {settings.phone}</p>
            </td>
            <td style={cell}><span style={label}>Invoice No.</span> {invoice.invoiceNumber}</td>
            <td style={cell}><span style={label}>Dated</span> {dated}</td>
          </tr>
          <tr>
            <td style={cell}><span style={label}>Vehicle No.</span> {invoice.vehicleNumber || '—'}</td>
            <td style={cell}><span style={label}>Place of Supply</span> {invoice.customerState || '—'}</td>
          </tr>
          <tr>
            <td style={cell}><span style={label}>Transport</span> {invoice.transportName || '—'}</td>
            <td style={cell}><span style={label}>Due Date</span> {invoice.dueDate ? dayjs(invoice.dueDate).format('DD-MMM-YYYY') : '—'}</td>
          </tr>
          <tr>
            <td style={cell} colSpan={2}>
              <p style={{ ...label, margin: '0 0 4px 0' }}>Consignee (Ship to)</p>
              <p style={{ margin: 0 }}>{invoice.customerName}</p>
              <p style={{ ...xs, marginTop: '2px' }}>{invoice.shippingAddress || invoice.billingAddress}</p>
            </td>
            <td style={cell} rowSpan={2}>
              <p style={{ ...label, margin: '0 0 4px 0' }}>Buyer (Bill to)</p>
              <p style={{ margin: 0 }}>{invoice.customerName}</p>
              <p style={{ ...xs, marginTop: '2px' }}>{invoice.billingAddress}</p>
              <p style={xs}>GSTIN: {invoice.customerGst || 'NA'}</p>
              <p style={xs}>State: {invoice.customerState}, Code: {custStateCode}</p>
            </td>
          </tr>
          <tr>
            <td style={cell} colSpan={2}>
              <p style={{ ...label, margin: 0 }}>Mode/Terms of Payment</p>
              <p style={xs}>{settings.terms || 'As per agreement'}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ ...tbl, borderTop: 'none' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            {['Sr No.', 'Hsn/Sac', 'Product Name', 'UOM', 'Quantity', 'Unit Cost', 'GST%', 'Amount'].map((h, i) => (
              <th key={h} style={{ ...cell, textAlign: i >= 4 ? 'right' : i === 3 ? 'center' : 'left', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const { total } = calcLineAmount(item);
            return (
              <tr key={i}>
                <td style={cell}>{i + 1}</td>
                <td style={cell}>{item.hsn || '—'}</td>
                <td style={cell}>{item.product}</td>
                <td style={{ ...cell, textAlign: 'center' }}>{item.unit}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{item.qty}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                <td style={{ ...cell, textAlign: 'right' }}>{item.gst || 0}%</td>
                <td style={{ ...cell, textAlign: 'right', fontWeight: 600 }}>{formatCurrency(total)}</td>
              </tr>
            );
          })}
          {Array.from({ length: emptyRows }).map((_, i) => (
            <tr key={`e-${i}`}>{Array.from({ length: 8 }).map((__, j) => <td key={j} style={cell}>&nbsp;</td>)}</tr>
          ))}
          <tr>
            <td style={{ ...cell, textAlign: 'right' }} colSpan={7}><strong>Total</strong></td>
            <td style={{ ...cell, textAlign: 'right' }}><strong>{formatCurrency(totals.grandTotal)}</strong></td>
          </tr>
        </tbody>
      </table>

      <table style={{ ...tbl, borderTop: 'none' }}>
        <tbody>
          <tr>
            <td style={cell} colSpan={4}>
              <span style={label}>Amount Chargeable (in words)</span>
              <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>INR {amountInWords(totals.grandTotal || 0)}</p>
            </td>
            <td style={cell} colSpan={4}>
              <table style={{ width: '100%', fontSize: '10px' }}>
                <tbody>
                  <tr><td>Taxable Value</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.totalTaxable)}</td></tr>
                  {invoice.isInterState ? (
                    <tr><td>IGST</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.igst)}</td></tr>
                  ) : (
                    <>
                      <tr><td>CGST</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.cgst)}</td></tr>
                      <tr><td>SGST</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.sgst)}</td></tr>
                    </>
                  )}
                  {totals.transport > 0 && <tr><td>Transport</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.transport)}</td></tr>}
                  <tr style={{ fontWeight: 700 }}><td>Grand Total</td><td style={{ textAlign: 'right' }}>{formatCurrency(totals.grandTotal)}</td></tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={cell} colSpan={4}>
              <p style={{ ...label, margin: '0 0 4px 0' }}>Declaration</p>
              <p style={{ ...xs, lineHeight: 1.5 }}>
                {settings.declaration || 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'}
              </p>
            </td>
            <td style={cell} colSpan={4}>
              <p style={{ ...label, margin: '0 0 4px 0' }}>Company&apos;s Bank Details</p>
              <p style={xs}>Bank: {settings.bankName}</p>
              <p style={xs}>A/c No: {settings.bankAccount}</p>
              <p style={xs}>Branch & IFSC: {settings.bankBranch} {settings.bankIFSC}</p>
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                {settings.signature && <img src={settings.signature} alt="Sign" style={{ height: '80px', objectFit: 'contain', marginLeft: 'auto', display: 'block' }} crossOrigin="anonymous" />}
                
                <p style={{ ...label, margin: '4px 0 0' }}>Authorised Signatory</p>
                <p style={xs}>for {settings.companyName}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: 'center', fontSize: '10px', color: '#4b5563', marginTop: '8px' }}>This is a Computer Generated Invoice</p>
    </div>
  );
}
