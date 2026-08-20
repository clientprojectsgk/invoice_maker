import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCurrencyRupee, HiOutlineDocumentText, HiOutlineClock,
  HiOutlineTrendingUp, HiOutlinePlus, HiOutlineUserAdd, HiOutlineCube, HiOutlineDownload,
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import Card, { KPICard, CardHeader } from '../components/common/Card';
import { SalesChart, InvoiceStatusChart, ProductSalesChart, RevenueChart } from '../components/charts/DashboardCharts';
import { monthlySalesData, productSalesData } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/FormField';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';

export default function Dashboard() {
  const { getDashboardStats, invoices, activities } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => { setStats(getDashboardStats()); }, [getDashboardStats]);

  if (!stats) return null;

  const recentInvoices = invoices.slice(0, 5);
  const quickActions = [
    { label: 'Create Invoice', icon: HiOutlinePlus, path: '/invoices/create' },
    { label: 'Add Customer', icon: HiOutlineUserAdd, path: '/customers' },
    { label: 'Add Product', icon: HiOutlineCube, path: '/products' },
    { label: 'Export Reports', icon: HiOutlineDownload, path: '/reports' },
  ];

  const invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true, render: (r) => <span className="font-medium text-primary-600">{r.invoiceNumber}</span> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'invoiceDate', label: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totals', label: 'Amount', render: (r) => <span className="font-medium">{formatCurrency(r.totals?.grandTotal)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your business</p>
        </div>
        <Link to="/invoices/create">
          <Button icon={HiOutlinePlus}>Create Invoice</Button>
        </Link>
      </div>

      {/* Main KPIs - 4 key metrics */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard title="Total Sales" value={formatCurrency(stats.totalSales)} icon={HiOutlineCurrencyRupee} change="+12.5% vs last month" trend="up" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard title="Total Invoices" value={stats.totalInvoices} icon={HiOutlineDocumentText} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard title="Pending Bills" value={stats.pendingBills} icon={HiOutlineClock} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KPICard title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={HiOutlineTrendingUp} change="+15.3%" trend="up" />
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <Card>
            <CardHeader title="Sales & Purchase" subtitle="Last 12 months" />
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

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader title="Top Products" />
            <ProductSalesChart data={productSalesData} />
          </Card>
        </div>
        <div className="col-12 col-lg-6">
          <Card>
            <CardHeader title="Revenue Trend" />
            <RevenueChart data={monthlySalesData} />
          </Card>
        </div>
      </div>

      {/* Quick actions + Recent */}
      <div className="row g-3">
        <div className="col-12 col-lg-4">
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
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-3">No activity yet</p>
              ) : activities.slice(0, 6).map((act) => (
                <div key={act.id} className="text-sm border-b border-gray-50 pb-2 last:border-0">
                  <p className="text-gray-700">
                    <span className="capitalize">{act.action}</span> {act.entity}
                    {act.details && <span className="text-gray-500"> — {act.details}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(act.timestamp, 'DD MMM, hh:mm A')}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-8">
          <Card padding={false}>
            <div className="p-5 pb-0">
              <CardHeader
                title="Recent Invoices"
                action={<Link to="/invoices" className="text-sm text-primary-600 hover:underline">View all</Link>}
              />
            </div>
            <DataTable columns={invoiceColumns} data={recentInvoices} emptyMessage="No invoices yet" />
          </Card>
        </div>
      </div>
    </div>
  );
}
