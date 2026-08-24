import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineCash, HiOutlineArrowLeft } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import { StatusBadge } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import dayjs from 'dayjs';

const TABS = ['Overview', 'Sales', 'Payments', 'Outstanding', 'Ledger', 'Products'];

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-2 text-sm">
    <span className="app-text-muted shrink-0">{label}</span>
    <span className="text-right">{value || '—'}</span>
  </div>
);

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, invoices, customerPayments, getCustomerSummary, getCustomerLedger, getCustomerProductHistory, getInvoicePending, computeInvoiceStatus, getCustomerAgingSummary } = useApp();
  const [tab, setTab] = useState('Overview');

  const customer = customers.find((c) => c.id === id);
  if (!customer) return <div className="p-8 text-center app-text-muted">Customer not found. <Link to="/customers" className="text-primary-600">Go back</Link></div>;

  const summary = getCustomerSummary(id);
  const ledger = getCustomerLedger(id);
  const productHistory = getCustomerProductHistory(id);
  const aging = getCustomerAgingSummary(id);

  const custInvoices = invoices.filter((i) => i.customerId === id && i.status !== 'draft');
  const custPayments = customerPayments.filter((p) => p.customerId === id && p.status !== 'cancelled');
  const pendingInvoices = custInvoices.filter((i) => getInvoicePending(i) > 0 && i.status !== 'cancelled');

  const firstSale = custInvoices.length ? custInvoices.reduce((a, b) => a.invoiceDate < b.invoiceDate ? a : b) : null;
  const thisMonth = dayjs().format('YYYY-MM');
  const monthSales = custInvoices.filter((i) => i.invoiceDate?.startsWith(thisMonth)).length;

  const invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (r) => <Link to={`/invoices/${r.id}`} className="font-medium text-primary-600 hover:underline">{r.invoiceNumber}</Link> },
    { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totals', label: 'Amount', render: (r) => formatCurrency(r.totals?.grandTotal) },
    { key: 'paid', label: 'Received', render: (r) => formatCurrency((r.totals?.grandTotal || 0) - getInvoicePending(r)) },
    { key: 'pending', label: 'Pending', render: (r) => { const p = getInvoicePending(r); return <span className={p > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>{formatCurrency(p)}</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computeInvoiceStatus(r)} /> },
  ];

  const paymentColumns = [
    { key: 'paymentNumber', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r.paymentNumber}</span> },
    { key: 'paymentDate', label: 'Date', render: (r) => formatDate(r.paymentDate) },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
    { key: 'paymentMode', label: 'Mode', render: (r) => <span className="capitalize">{r.paymentMode}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => r.referenceNumber || '—' },
    { key: 'allocations', label: 'Against', render: (r) => r.allocations?.map((a) => a.invoiceNumber).join(', ') || 'Advance' },
  ];

  const ledgerColumns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'reference', label: 'Reference', render: (r) => <span className="font-medium text-primary-600">{r.reference}</span> },
    { key: 'description', label: 'Transaction' },
    { key: 'debit', label: 'Amount Due', render: (r) => r.debit > 0 ? <span className="text-red-600">{formatCurrency(r.debit)}</span> : '—' },
    { key: 'credit', label: 'Amount Received', render: (r) => r.credit > 0 ? <span className="text-green-600">{formatCurrency(r.credit)}</span> : '—' },
    { key: 'balance', label: 'Balance', render: (r) => <span className={`font-semibold ${r.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(r.balance)}</span> },
  ];

  const outstandingColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (r) => <Link to={`/invoices/${r.id}`} className="font-medium text-primary-600 hover:underline">{r.invoiceNumber}</Link> },
    { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totals', label: 'Amount', render: (r) => formatCurrency(r.totals?.grandTotal) },
    { key: 'pending', label: 'Pending', render: (r) => <span className="font-semibold text-amber-600">{formatCurrency(getInvoicePending(r))}</span> },
    { key: 'days', label: 'Days', render: (r) => { const d = dayjs().diff(dayjs(r.invoiceDate), 'day'); return <span className={d > 30 ? 'text-red-600 font-medium' : 'app-text-muted'}>{d}d</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computeInvoiceStatus(r)} /> },
  ];

  const productColumns = [
    { key: 'product', label: 'Product' },
    { key: 'qty', label: 'Total Qty', render: (r) => `${r.qty} ${r.unit}` },
    { key: 'sales', label: 'Total Value', render: (r) => formatCurrency(r.sales) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => navigate('/customers')} className="p-2 rounded-lg hover-surface app-text-muted"><HiOutlineArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0">
          <h1 className="page-title">{customer.name}</h1>
          <p className="page-subtitle">{customer.phone}{customer.email ? ` · ${customer.email}` : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to={`/invoices/create`}><Button icon={HiOutlinePlus} size="sm">Create Invoice</Button></Link>
          <Link to={`/customer-payments`}><Button icon={HiOutlineCash} size="sm" variant="secondary">Receive Payment</Button></Link>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-3"><Card><p className="label-caps">Total Sales</p><p className="kpi-value mt-1">{formatCurrency(summary.totalSales)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">Total Received</p><p className="kpi-value mt-1 text-green-600">{formatCurrency(summary.totalReceived)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">Outstanding</p><p className={`kpi-value mt-1 ${summary.totalOutstanding > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(summary.totalOutstanding)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">Invoices</p><p className="kpi-value mt-1">{summary.invoiceCount}</p></Card></div>
      </div>

      <Card padding={false}>
        <div className="flex gap-1 p-3 border-b app-border overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap font-medium transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'app-text-muted hover-surface'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-5">
          {tab === 'Overview' && (
            <div className="space-y-5">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <h4 className="font-semibold text-sm mb-3">Customer Info</h4>
                  <div className="space-y-2">
                    <Row label="Phone" value={customer.phone} />
                    <Row label="Email" value={customer.email} />
                    <Row label="GST" value={customer.gst} />
                    <Row label="State" value={customer.state} />
                    <Row label="Address" value={customer.address} />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <h4 className="font-semibold text-sm mb-3">Purchase Frequency</h4>
                  <div className="space-y-2">
                    <Row label="First Sale" value={firstSale ? formatDate(firstSale.invoiceDate) : null} />
                    <Row label="Last Sale" value={summary.lastSale ? formatDate(summary.lastSale.invoiceDate) : null} />
                    <Row label="Total Sales" value={summary.invoiceCount} />
                    <Row label="This Month" value={monthSales} />
                    <Row label="Last Payment" value={summary.lastPayment ? formatDate(summary.lastPayment.paymentDate) : null} />
                  </div>
                </div>
              </div>
              {summary.totalOutstanding > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3">Outstanding Aging</h4>
                  <div className="row g-2">
                    {Object.entries(aging).map(([bucket, amount]) => amount > 0 && (
                      <div key={bucket} className="col-6 col-sm-4 col-lg-2">
                        <div className="p-3 rounded-xl border app-border text-center">
                          <p className="text-xs app-text-muted">{bucket}</p>
                          <p className="font-semibold text-sm mt-1 text-amber-600">{formatCurrency(amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'Sales' && <DataTable columns={invoiceColumns} data={custInvoices} emptyMessage="No sales yet" />}
          {tab === 'Payments' && <DataTable columns={paymentColumns} data={custPayments} emptyMessage="No payments yet" />}
          {tab === 'Outstanding' && <DataTable columns={outstandingColumns} data={pendingInvoices} emptyMessage="No outstanding invoices" />}
          {tab === 'Ledger' && (
            <div>
              <div className="flex flex-wrap gap-3 mb-4 text-sm">
                <span>Total Sales: <strong>{formatCurrency(summary.totalSales)}</strong></span>
                <span>Received: <strong className="text-green-600">{formatCurrency(summary.totalReceived)}</strong></span>
                <span>Outstanding: <strong className="text-amber-600">{formatCurrency(summary.totalOutstanding)}</strong></span>
              </div>
              <DataTable columns={ledgerColumns} data={ledger} emptyMessage="No transactions yet" />
            </div>
          )}
          {tab === 'Products' && <DataTable columns={productColumns} data={productHistory} emptyMessage="No product history" />}
        </div>
      </Card>
    </div>
  );
}
