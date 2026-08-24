import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineCash, HiOutlineArrowLeft } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import { StatusBadge } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import dayjs from 'dayjs';

const TABS = ['Overview', 'Sales', 'Payments', 'Outstanding', 'Ledger', 'Products'];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, invoices, customerPayments, getCustomerSummary, getCustomerLedger, getCustomerProductHistory, getInvoicePending, computeInvoiceStatus, getCustomerAgingSummary } = useApp();
  const [tab, setTab] = useState('Overview');

  const customer = customers.find((c) => c.id === id);
  if (!customer) return <div className="p-8 text-center text-slate-500">Customer not found. <Link to="/customers" className="text-primary-600">Go back</Link></div>;

  const summary = getCustomerSummary(id);
  const ledger = getCustomerLedger(id);
  const productHistory = getCustomerProductHistory(id);
  const aging = getCustomerAgingSummary(id);

  const custInvoices = invoices.filter((i) => i.customerId === id && i.status !== 'draft');
  const custPayments = customerPayments.filter((p) => p.customerId === id && p.status !== 'cancelled');
  const pendingInvoices = custInvoices.filter((i) => getInvoicePending(i) > 0 && i.status !== 'cancelled');

  const firstSale = custInvoices.length ? custInvoices.reduce((a, b) => a.invoiceDate < b.invoiceDate ? a : b) : null;
  const lastSale = summary.lastSale;
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

  const productColumns = [
    { key: 'product', label: 'Product' },
    { key: 'qty', label: 'Total Qty', render: (r) => `${r.qty} ${r.unit}` },
    { key: 'sales', label: 'Total Value', render: (r) => formatCurrency(r.sales) },
  ];

  const outstandingColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (r) => <Link to={`/invoices/${r.id}`} className="font-medium text-primary-600 hover:underline">{r.invoiceNumber}</Link> },
    { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
    { key: 'totals', label: 'Invoice Amount', render: (r) => formatCurrency(r.totals?.grandTotal) },
    { key: 'pending', label: 'Pending', render: (r) => <span className="font-semibold text-amber-600">{formatCurrency(getInvoicePending(r))}</span> },
    { key: 'days', label: 'Days Pending', render: (r) => { const d = dayjs().diff(dayjs(r.invoiceDate), 'day'); return <span className={d > 30 ? 'text-red-600 font-medium' : 'text-slate-600'}>{d}d</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computeInvoiceStatus(r)} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customers')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><HiOutlineArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="page-title">{customer.name}</h1>
          <p className="page-subtitle">{customer.phone} {customer.email ? `· ${customer.email}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/invoices/create?customerId=${id}`}><Button icon={HiOutlinePlus} size="sm">Create Invoice</Button></Link>
          <Link to={`/customer-payments?customerId=${id}`}><Button icon={HiOutlineCash} size="sm" variant="secondary">Receive Payment</Button></Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Sales</p><p className="kpi-value mt-1">{formatCurrency(summary.totalSales)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Received</p><p className="kpi-value mt-1 text-green-600">{formatCurrency(summary.totalReceived)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Outstanding</p><p className={`kpi-value mt-1 ${summary.totalOutstanding > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(summary.totalOutstanding)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Invoices</p><p className="kpi-value mt-1">{summary.invoiceCount}</p></Card>
        </div>
      </div>

      {/* Tabs */}
      <Card padding={false}>
        <div className="flex gap-1 p-3 border-b app-border overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap font-medium transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'Overview' && (
            <div className="space-y-5">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <h4 className="font-semibold text-sm mb-3">Customer Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Phone</span><span>{customer.phone}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Email</span><span>{customer.email || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">GST</span><span>{customer.gst || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">State</span><span>{customer.state || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="text-right max-w-[200px]">{customer.address || '—'}</span></div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <h4 className="font-semibold text-sm mb-3">Purchase Frequency</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">First Sale</span><span>{firstSale ? formatDate(firstSale.invoiceDate) : '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Last Sale</span><span>{lastSale ? formatDate(lastSale.invoiceDate) : '—'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Total Sales</span><span>{summary.invoiceCount}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">This Month</span><span>{monthSales}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Last Payment</span><span>{summary.lastPayment ? formatDate(summary.lastPayment.paymentDate) : '—'}</span></div>
                  </div>
                </div>
              </div>

              {summary.totalOutstanding > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3">Outstanding Aging</h4>
                  <div className="row g-2">
                    {Object.entries(aging).map(([bucket, amount]) => amount > 0 && (
                      <div key={bucket} className="col-6 col-md-4 col-lg-2">
                        <div className="p-3 rounded-xl border app-border text-center">
                          <p className="text-xs text-slate-500">{bucket}</p>
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
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="space-x-4">
                  <span>Total Sales: <strong>{formatCurrency(summary.totalSales)}</strong></span>
                  <span>Total Received: <strong className="text-green-600">{formatCurrency(summary.totalReceived)}</strong></span>
                  <span>Outstanding: <strong className="text-amber-600">{formatCurrency(summary.totalOutstanding)}</strong></span>
                </div>
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
