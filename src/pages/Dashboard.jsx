import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCurrencyRupee, HiOutlineShoppingCart, HiOutlineCash,
  HiOutlineCreditCard, HiOutlinePlus, HiOutlineExclamation,
  HiOutlineCube, HiOutlineUserGroup, HiOutlineTruck,
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import Card, { KPICard, CardHeader } from '../components/common/Card';
import { SalesChart, InvoiceStatusChart } from '../components/charts/DashboardCharts';
import { monthlySalesData } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/FormField';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

export default function Dashboard() {
  const { getDashboardStats, invoices, purchases, activities, computeInvoiceStatus, getInvoicePending } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => { setStats(getDashboardStats()); }, [getDashboardStats]);

  if (!stats) return null;

  const recentInvoices = [...invoices]
    .filter((i) => i.status !== 'cancelled')
    .sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate))
    .slice(0, 5);

  const recentPurchases = [...purchases]
    .filter((p) => p.status !== 'cancelled')
    .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))
    .slice(0, 5);

  const quickActions = [
    { label: 'New Purchase', icon: HiOutlineShoppingCart, path: '/purchases/create' },
    { label: 'Create Invoice', icon: HiOutlinePlus, path: '/invoices/create' },
    { label: 'Receive Payment', icon: HiOutlineCash, path: '/customer-payments' },
    { label: 'Make Payment', icon: HiOutlineCreditCard, path: '/purchase-payments' },
  ];

  const invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (r) => <Link to={`/invoices/${r.id}`} className="font-medium text-primary-600 hover:underline">{r.invoiceNumber}</Link> },
    { key: 'customerName', label: 'Customer' },
    { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totals', label: 'Amount', render: (r) => <span className="font-medium">{formatCurrency(r.totals?.grandTotal)}</span> },
    { key: 'pending', label: 'Pending', render: (r) => { const p = getInvoicePending(r); return p > 0 ? <span className="text-amber-600 font-medium">{formatCurrency(p)}</span> : <span className="text-green-600">Paid</span>; } },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computeInvoiceStatus(r)} /> },
  ];

  const purchaseColumns = [
    { key: 'purchaseNumber', label: 'Purchase #', render: (r) => <span className="font-medium text-primary-600">{r.purchaseNumber}</span> },
    { key: 'supplierName', label: 'Supplier' },
    { key: 'purchaseDate', label: 'Date', render: (r) => formatDate(r.purchaseDate) },
    { key: 'finalAmount', label: 'Amount', render: (r) => <span className="font-medium">{formatCurrency(r.finalAmount)}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time business overview</p>
        </div>
        <Link to="/invoices/create"><Button icon={HiOutlinePlus}>Create Invoice</Button></Link>
      </div>

      {/* Today's Summary */}
      <div>
        <p className="label-caps mb-2">Today's Summary</p>
        <div className="row g-3">
          <div className="col-6 col-xl-3">
            <KPICard title="Today's Purchase" value={formatCurrency(stats.todayPurchases)} icon={HiOutlineShoppingCart} />
          </div>
          <div className="col-6 col-xl-3">
            <KPICard title="Today's Sales" value={formatCurrency(stats.todaySales)} icon={HiOutlineCurrencyRupee} />
          </div>
          <div className="col-6 col-xl-3">
            <KPICard title="Today's Collection" value={formatCurrency(stats.todayPaymentsReceived)} icon={HiOutlineCash} />
          </div>
          <div className="col-6 col-xl-3">
            <KPICard title="Today's Supplier Payment" value={formatCurrency(stats.todaySupplierPayments)} icon={HiOutlineCreditCard} />
          </div>
        </div>
      </div>

      {/* Outstanding */}
      <div>
        <p className="label-caps mb-2">Outstanding</p>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Customer Receivable</p>
              <p className="kpi-value mt-1 text-amber-600">{formatCurrency(stats.totalReceivables)}</p>
              <Link to="/receivables" className="text-xs text-primary-600 hover:underline mt-1 block">View details →</Link>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Supplier Payable</p>
              <p className="kpi-value mt-1 text-red-600">{formatCurrency(stats.totalPayables)}</p>
              <Link to="/payables" className="text-xs text-primary-600 hover:underline mt-1 block">View details →</Link>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Total Sales</p>
              <p className="kpi-value mt-1">{formatCurrency(stats.totalSales)}</p>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Total Purchases</p>
              <p className="kpi-value mt-1">{formatCurrency(stats.totalPurchases)}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div>
        <p className="label-caps mb-2">Inventory</p>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Low Stock Items</p>
              <p className={`kpi-value mt-1 ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>{stats.lowStockCount}</p>
              <Link to="/stock" className="text-xs text-primary-600 hover:underline mt-1 block">View stock →</Link>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Out of Stock</p>
              <p className={`kpi-value mt-1 ${stats.outOfStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{stats.outOfStockCount}</p>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Partial Invoices</p>
              <p className="kpi-value mt-1 text-amber-600">{stats.partialInvoices}</p>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card>
              <p className="label-caps">Overdue Customers</p>
              <p className={`kpi-value mt-1 ${stats.overdueCustomers?.length > 0 ? 'text-red-600' : 'text-green-600'}`}>{stats.overdueCustomers?.length || 0}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(stats.overdueCustomers?.length > 0 || stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <HiOutlineExclamation className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-400">Alerts</p>
              {stats.overdueCustomers?.length > 0 && (
                <p className="text-amber-700 dark:text-amber-300">
                  {stats.overdueCustomers.length} customer(s) with overdue payments:&nbsp;
                  {stats.overdueCustomers.slice(0, 3).map((c) => c.name).join(', ')}
                  {stats.overdueCustomers.length > 3 ? ` +${stats.overdueCustomers.length - 3} more` : ''}
                </p>
              )}
              {stats.outOfStockCount > 0 && <p className="text-amber-700 dark:text-amber-300">{stats.outOfStockCount} product(s) out of stock: {stats.outOfStock?.map((p) => p.name).join(', ')}</p>}
              {stats.lowStockCount > 0 && <p className="text-amber-700 dark:text-amber-300">{stats.lowStockCount} product(s) running low: {stats.lowStock?.map((p) => p.name).join(', ')}</p>}
            </div>
          </div>
        </Card>
      )}

      {/* Charts + Quick Actions */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <Card>
            <CardHeader title="Sales & Purchase Trend" subtitle="Last 12 months" />
            <SalesChart data={monthlySalesData} />
          </Card>
        </div>
        <div className="col-12 col-lg-4">
          <Card>
            <CardHeader title="Invoice Status" />
            <InvoiceStatusChart invoices={invoices} />
          </Card>
        </div>
      </div>

      {/* Quick Actions + Activity */}
      <div className="row g-3">
        <div className="col-12 col-lg-3">
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.path}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
                    <action.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="mt-3">
            <CardHeader title="Recent Activity" />
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-3">No activity yet</p>
              ) : activities.slice(0, 6).map((act) => (
                <div key={act.id} className="text-sm border-b border-gray-50 pb-2 last:border-0">
                  <p className="text-gray-700 capitalize">{act.action} {act.entity}{act.details ? ` — ${act.details}` : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(act.timestamp, 'DD MMM, hh:mm A')}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-9">
          <div className="row g-3">
            <div className="col-12">
              <Card padding={false}>
                <div className="p-5 pb-0"><CardHeader title="Recent Invoices" action={<Link to="/invoices" className="text-sm text-primary-600 hover:underline">View all</Link>} /></div>
                <DataTable columns={invoiceColumns} data={recentInvoices} emptyMessage="No invoices yet" />
              </Card>
            </div>
            <div className="col-12">
              <Card padding={false}>
                <div className="p-5 pb-0"><CardHeader title="Recent Purchases" action={<Link to="/purchases" className="text-sm text-primary-600 hover:underline">View all</Link>} /></div>
                <DataTable columns={purchaseColumns} data={recentPurchases} emptyMessage="No purchases yet" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
