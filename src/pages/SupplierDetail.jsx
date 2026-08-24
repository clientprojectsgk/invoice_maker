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

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers, purchases, supplierPayments, getSupplierSummary, getSupplierLedger, getSupplierProductHistory, getPurchasePending, computePurchaseStatus } = useApp();
  const [tab, setTab] = useState('Overview');

  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) return <div className="p-8 text-center text-slate-500">Supplier not found. <Link to="/suppliers" className="text-primary-600">Go back</Link></div>;

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
    { key: 'credit', label: 'Purchase Amount', render: (r) => r.credit > 0 ? <span className="text-red-600">{formatCurrency(r.credit)}</span> : '—' },
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
    { key: 'days', label: 'Days Pending', render: (r) => { const d = dayjs().diff(dayjs(r.purchaseDate), 'day'); return <span className={d > 15 ? 'text-red-600 font-medium' : 'text-slate-600'}>{d}d</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computePurchaseStatus(r)} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/suppliers')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="page-title">{supplier.name}</h1>
          <p className="page-subtitle">{supplier.phone}{supplier.email ? ` · ${supplier.email}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/purchases/create`}><Button icon={HiOutlinePlus} size="sm">Create Purchase</Button></Link>
          <Link to={`/purchase-payments`}><Button icon={HiOutlineCreditCard} size="sm" variant="secondary">Make Payment</Button></Link>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Purchases</p><p className="kpi-value mt-1">{formatCurrency(summary.totalPurchase)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Paid</p><p className="kpi-value mt-1 text-green-600">{formatCurrency(summary.totalPaid)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Outstanding</p><p className={`kpi-value mt-1 ${summary.totalPending > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(summary.totalPending)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">No. of Purchases</p><p className="kpi-value mt-1">{summary.purchaseCount}</p></Card>
        </div>
      </div>

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
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">Supplier Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Phone</span><span>{supplier.phone}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Email</span><span>{supplier.email || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">State</span><span>{supplier.state || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="text-right max-w-[200px]">{supplier.address || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment Terms</span><span>{supplier.paymentTerms || '—'}</span></div>
                </div>
                {supplier.bankName && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-sm">
                    <p className="font-medium text-slate-600 mb-1">Bank Details</p>
                    <p>{supplier.bankName} · {supplier.bankAccount}</p>
                    <p className="text-slate-500">{supplier.bankIFSC}</p>
                  </div>
                )}
              </div>
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">Purchase Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">First Purchase</span><span>{firstPurchase ? formatDate(firstPurchase.purchaseDate) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Last Purchase</span><span>{summary.lastPurchase ? formatDate(summary.lastPurchase.purchaseDate) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Purchases</span><span>{summary.purchaseCount}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">This Month</span><span>{monthPurchases}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Last Payment</span><span>{summary.lastPayment ? formatDate(summary.lastPayment.paymentDate) : '—'}</span></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'Purchases' && <DataTable columns={purchaseColumns} data={supPurchases} emptyMessage="No purchases yet" />}
          {tab === 'Payments' && <DataTable columns={paymentColumns} data={supPayments} emptyMessage="No payments yet" />}
          {tab === 'Outstanding' && <DataTable columns={outstandingColumns} data={pendingPurchases} emptyMessage="No outstanding purchases" />}
          {tab === 'Ledger' && (
            <div>
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span>Total Purchase: <strong>{formatCurrency(summary.totalPurchase)}</strong></span>
                <span>Total Paid: <strong className="text-green-600">{formatCurrency(summary.totalPaid)}</strong></span>
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
