import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineCreditCard, HiOutlineArrowLeft } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import { StatusBadge } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import dayjs from 'dayjs';

const TABS = ['Overview', 'Purchases', 'Payments', 'Outstanding', 'Ledger', 'Products'];

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-2 text-sm">
    <span className="app-text-muted shrink-0">{label}</span>
    <span className="text-right">{value || '—'}</span>
  </div>
);

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers, purchases, supplierPayments, getSupplierSummary, getSupplierLedger, getSupplierProductHistory, getPurchasePending, computePurchaseStatus } = useApp();
  const [tab, setTab] = useState('Overview');

  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) return <div className="p-8 text-center app-text-muted">Supplier not found. <Link to="/suppliers" className="text-primary-600">Go back</Link></div>;

  const summary = getSupplierSummary(id);
  const ledger = getSupplierLedger(id);
  const productHistory = getSupplierProductHistory(id);

  const supPurchases = purchases.filter((p) => p.supplierId === id && p.status !== 'cancelled');
  const supPayments = supplierPayments.filter((p) => p.supplierId === id && p.status !== 'cancelled');
  const pendingPurchases = supPurchases.filter((p) => getPurchasePending(p) > 0);

  const firstPurchase = supPurchases.length ? supPurchases.reduce((a, b) => a.purchaseDate < b.purchaseDate ? a : b) : null;
  const thisMonth = dayjs().format('YYYY-MM');
  const monthPurchases = supPurchases.filter((p) => p.purchaseDate?.startsWith(thisMonth)).length;

  const purchaseColumns = [
    { key: 'purchaseNumber', label: 'Purchase #', render: (r) => <span className="font-medium text-primary-600">{r.purchaseNumber}</span> },
    { key: 'purchaseDate', label: 'Date', render: (r) => formatDate(r.purchaseDate) },
    { key: 'product', label: 'Product(s)', render: (r) => r.items?.length > 1 ? `${r.items.length} products` : r.product },
    { key: 'qty', label: 'Qty', render: (r) => r.qty ? `${r.qty} ${r.unit}` : '—' },
    { key: 'finalAmount', label: 'Amount', render: (r) => formatCurrency(r.finalAmount) },
    { key: 'paid', label: 'Paid', render: (r) => <span className="text-green-600">{formatCurrency(r.finalAmount - getPurchasePending(r))}</span> },
    { key: 'pending', label: 'Pending', render: (r) => { const p = getPurchasePending(r); return <span className={p > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>{formatCurrency(p)}</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computePurchaseStatus(r)} /> },
  ];

  const paymentColumns = [
    { key: 'paymentNumber', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r.paymentNumber}</span> },
    { key: 'paymentDate', label: 'Date', render: (r) => formatDate(r.paymentDate) },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
    { key: 'paymentMode', label: 'Mode', render: (r) => <span className="capitalize">{r.paymentMode}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => r.referenceNumber || '—' },
    { key: 'allocations', label: 'Against', render: (r) => r.allocations?.map((a) => a.purchaseNumber).join(', ') || 'Unallocated' },
  ];

  const ledgerColumns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'reference', label: 'Reference', render: (r) => <span className="font-medium text-primary-600">{r.reference}</span> },
    { key: 'description', label: 'Transaction' },
    { key: 'credit', label: 'Purchase Amt', render: (r) => r.credit > 0 ? <span className="text-red-600">{formatCurrency(r.credit)}</span> : '—' },
    { key: 'debit', label: 'Payment Made', render: (r) => r.debit > 0 ? <span className="text-green-600">{formatCurrency(r.debit)}</span> : '—' },
    { key: 'balance', label: 'Balance', render: (r) => <span className={`font-semibold ${r.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(r.balance)}</span> },
  ];

  const productColumns = [
    { key: 'product', label: 'Product' },
    { key: 'variety', label: 'Variety', render: (r) => r.variety || '—' },
    { key: 'qty', label: 'Total Qty', render: (r) => `${r.qty} ${r.unit}` },
    { key: 'amount', label: 'Total Amount', render: (r) => formatCurrency(r.amount) },
  ];

  const outstandingColumns = [
    { key: 'purchaseNumber', label: 'Purchase #', render: (r) => <span className="font-medium text-primary-600">{r.purchaseNumber}</span> },
    { key: 'purchaseDate', label: 'Date', render: (r) => formatDate(r.purchaseDate) },
    { key: 'finalAmount', label: 'Amount', render: (r) => formatCurrency(r.finalAmount) },
    { key: 'pending', label: 'Pending', render: (r) => <span className="font-semibold text-amber-600">{formatCurrency(getPurchasePending(r))}</span> },
    { key: 'days', label: 'Days', render: (r) => { const d = dayjs().diff(dayjs(r.purchaseDate), 'day'); return <span className={d > 15 ? 'text-red-600 font-medium' : 'app-text-muted'}>{d}d</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computePurchaseStatus(r)} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => navigate('/suppliers')} className="p-2 rounded-lg hover-surface app-text-muted"><HiOutlineArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0">
          <h1 className="page-title">{supplier.name}</h1>
          <p className="page-subtitle">{supplier.phone}{supplier.email ? ` · ${supplier.email}` : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/purchases/create"><Button icon={HiOutlinePlus} size="sm">Create Purchase</Button></Link>
          <Link to="/purchase-payments"><Button icon={HiOutlineCreditCard} size="sm" variant="secondary">Make Payment</Button></Link>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-3"><Card><p className="label-caps">Total Purchases</p><p className="kpi-value mt-1">{formatCurrency(summary.totalPurchase)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">Total Paid</p><p className="kpi-value mt-1 text-green-600">{formatCurrency(summary.totalPaid)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">Outstanding</p><p className={`kpi-value mt-1 ${summary.totalPending > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(summary.totalPending)}</p></Card></div>
        <div className="col-6 col-md-3"><Card><p className="label-caps">No. of Purchases</p><p className="kpi-value mt-1">{summary.purchaseCount}</p></Card></div>
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
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">Supplier Info</h4>
                <div className="space-y-2">
                  <Row label="Phone" value={supplier.phone} />
                  <Row label="Email" value={supplier.email} />
                  <Row label="State" value={supplier.state} />
                  <Row label="Address" value={supplier.address} />
                  <Row label="Payment Terms" value={supplier.paymentTerms} />
                </div>
                {supplier.bankName && (
                  <div className="mt-4 p-3 rounded-xl border app-border text-sm" style={{ backgroundColor: 'var(--app-surface-hover)' }}>
                    <p className="font-medium app-text-muted mb-1">Bank Details</p>
                    <p className="app-text">{supplier.bankName} · {supplier.bankAccount}</p>
                    <p className="app-text-muted">{supplier.bankIFSC}</p>
                  </div>
                )}
              </div>
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">Purchase Activity</h4>
                <div className="space-y-2">
                  <Row label="First Purchase" value={firstPurchase ? formatDate(firstPurchase.purchaseDate) : null} />
                  <Row label="Last Purchase" value={summary.lastPurchase ? formatDate(summary.lastPurchase.purchaseDate) : null} />
                  <Row label="Total Purchases" value={summary.purchaseCount} />
                  <Row label="This Month" value={monthPurchases} />
                  <Row label="Last Payment" value={summary.lastPayment ? formatDate(summary.lastPayment.paymentDate) : null} />
                </div>
              </div>
            </div>
          )}
          {tab === 'Purchases' && <DataTable columns={purchaseColumns} data={supPurchases} emptyMessage="No purchases yet" />}
          {tab === 'Payments' && <DataTable columns={paymentColumns} data={supPayments} emptyMessage="No payments yet" />}
          {tab === 'Outstanding' && <DataTable columns={outstandingColumns} data={pendingPurchases} emptyMessage="No outstanding purchases" />}
          {tab === 'Ledger' && (
            <div>
              <div className="flex flex-wrap gap-3 mb-4 text-sm">
                <span>Total Purchase: <strong>{formatCurrency(summary.totalPurchase)}</strong></span>
                <span>Paid: <strong className="text-green-600">{formatCurrency(summary.totalPaid)}</strong></span>
                <span>Outstanding: <strong className="text-amber-600">{formatCurrency(summary.totalPending)}</strong></span>
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
