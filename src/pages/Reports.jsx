import { useState } from 'react';
import {
  HiOutlineChartBar, HiOutlineShoppingCart, HiOutlineUserGroup,
  HiOutlineTruck, HiOutlineCube, HiOutlineCash, HiOutlineCreditCard,
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DataTable from '../components/common/DataTable';
import { FormField, Input, Select } from '../components/common/FormField';
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters';
import { StatusBadge } from '../components/common/FormField';

const REPORT_TYPES = [
  { id: 'sales', label: 'Sales Report', icon: HiOutlineChartBar, color: 'blue' },
  { id: 'purchase', label: 'Purchase Report', icon: HiOutlineShoppingCart, color: 'purple' },
  { id: 'customer_outstanding', label: 'Customer Outstanding', icon: HiOutlineUserGroup, color: 'amber' },
  { id: 'supplier_outstanding', label: 'Supplier Outstanding', icon: HiOutlineTruck, color: 'red' },
  { id: 'stock', label: 'Stock Report', icon: HiOutlineCube, color: 'green' },
  { id: 'customer_payments', label: 'Payment Received', icon: HiOutlineCash, color: 'emerald' },
  { id: 'supplier_payments', label: 'Payments Made', icon: HiOutlineCreditCard, color: 'slate' },
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function Reports() {
  const { invoices, purchases, customers, suppliers, products, customerPayments, supplierPayments,
    getOutstandingCustomers, getOutstandingSuppliers, getProductStock, getInvoicePending, computeInvoiceStatus, getPurchasePending, computePurchaseStatus } = useApp();

  const [activeReport, setActiveReport] = useState(null);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', search: '' });

  const updateFilter = (f, v) => setFilters((p) => ({ ...p, [f]: v }));

  const inDateRange = (date) => {
    if (filters.dateFrom && date < filters.dateFrom) return false;
    if (filters.dateTo && date > filters.dateTo) return false;
    return true;
  };

  const getReportData = (type) => {
    switch (type) {
      case 'sales': {
        const data = invoices
          .filter((i) => i.status !== 'cancelled' && i.status !== 'draft' && inDateRange(i.invoiceDate))
          .map((i) => ({
            Date: formatDate(i.invoiceDate),
            'Invoice #': i.invoiceNumber,
            Customer: i.customerName,
            Amount: i.totals?.grandTotal || 0,
            Received: (i.totals?.grandTotal || 0) - getInvoicePending(i),
            Pending: getInvoicePending(i),
            Status: computeInvoiceStatus(i),
          }));
        const columns = [
          { key: 'Date', label: 'Date' },
          { key: 'Invoice #', label: 'Invoice #', render: (r) => <span className="font-medium text-primary-600">{r['Invoice #']}</span> },
          { key: 'Customer', label: 'Customer' },
          { key: 'Amount', label: 'Amount', render: (r) => formatCurrency(r.Amount) },
          { key: 'Received', label: 'Received', render: (r) => <span className="text-green-600">{formatCurrency(r.Received)}</span> },
          { key: 'Pending', label: 'Pending', render: (r) => r.Pending > 0 ? <span className="text-amber-600 font-medium">{formatCurrency(r.Pending)}</span> : '—' },
          { key: 'Status', label: 'Status', render: (r) => <StatusBadge status={r.Status} /> },
        ];
        return { data, columns };
      }
      case 'purchase': {
        const data = purchases
          .filter((p) => p.status !== 'cancelled' && inDateRange(p.purchaseDate))
          .map((p) => ({
            Date: formatDate(p.purchaseDate),
            'Purchase #': p.purchaseNumber,
            Farmer: p.supplierName,
            Product: p.items?.length > 1 ? `${p.items.length} products` : p.product,
            Qty: p.qty ? `${p.qty} ${p.unit}` : '—',
            Amount: p.finalAmount || 0,
            Paid: (p.finalAmount || 0) - getPurchasePending(p),
            Pending: getPurchasePending(p),
            Status: computePurchaseStatus(p),
          }));
        const columns = [
          { key: 'Date', label: 'Date' },
          { key: 'Purchase #', label: 'Purchase #', render: (r) => <span className="font-medium text-primary-600">{r['Purchase #']}</span> },
          { key: 'Farmer', label: 'Farmer' },
          { key: 'Product', label: 'Product' },
          { key: 'Qty', label: 'Qty' },
          { key: 'Amount', label: 'Amount', render: (r) => formatCurrency(r.Amount) },
          { key: 'Paid', label: 'Paid', render: (r) => <span className="text-green-600">{formatCurrency(r.Paid)}</span> },
          { key: 'Pending', label: 'Pending', render: (r) => r.Pending > 0 ? <span className="text-amber-600 font-medium">{formatCurrency(r.Pending)}</span> : '—' },
          { key: 'Status', label: 'Status', render: (r) => <StatusBadge status={r.Status} /> },
        ];
        return { data, columns };
      }
      case 'customer_outstanding': {
        const data = getOutstandingCustomers().map((c) => ({
          Customer: c.name,
          Phone: c.phone,
          'Total Sales': c.totalSales,
          'Total Received': c.totalReceived,
          Outstanding: c.totalOutstanding,
          'Pending Invoices': c.pendingInvoiceCount,
          'Oldest (Days)': c.oldestDays,
          Status: c.paymentFilter,
        }));
        const columns = [
          { key: 'Customer', label: 'Customer', render: (r) => <span className="font-medium">{r.Customer}</span> },
          { key: 'Phone', label: 'Phone' },
          { key: 'Total Sales', label: 'Total Sales', render: (r) => formatCurrency(r['Total Sales']) },
          { key: 'Total Received', label: 'Received', render: (r) => <span className="text-green-600">{formatCurrency(r['Total Received'])}</span> },
          { key: 'Outstanding', label: 'Outstanding', render: (r) => <span className="font-semibold text-amber-600">{formatCurrency(r.Outstanding)}</span> },
          { key: 'Pending Invoices', label: 'Pending Invoices' },
          { key: 'Oldest (Days)', label: 'Oldest (Days)', render: (r) => r['Oldest (Days)'] > 0 ? <span className={r['Oldest (Days)'] > 30 ? 'text-red-600 font-medium' : ''}>{r['Oldest (Days)']}d</span> : '—' },
          { key: 'Status', label: 'Status', render: (r) => <StatusBadge status={r.Status} /> },
        ];
        return { data, columns };
      }
      case 'supplier_outstanding': {
        const data = getOutstandingSuppliers().map((s) => ({
          Supplier: s.name,
          Phone: s.phone,
          'Total Purchase': s.totalPurchase,
          'Total Paid': s.totalPaid,
          Outstanding: s.totalPending,
          'Pending Purchases': s.pendingPurchaseCount,
        }));
        const columns = [
          { key: 'Supplier', label: 'Supplier', render: (r) => <span className="font-medium">{r.Supplier}</span> },
          { key: 'Phone', label: 'Phone' },
          { key: 'Total Purchase', label: 'Total Purchase', render: (r) => formatCurrency(r['Total Purchase']) },
          { key: 'Total Paid', label: 'Paid', render: (r) => <span className="text-green-600">{formatCurrency(r['Total Paid'])}</span> },
          { key: 'Outstanding', label: 'Outstanding', render: (r) => <span className="font-semibold text-red-600">{formatCurrency(r.Outstanding)}</span> },
          { key: 'Pending Purchases', label: 'Pending Purchases' },
        ];
        return { data, columns };
      }
      case 'stock': {
        const data = products.map((p) => ({
          Product: p.name,
          Variety: p.variety || '—',
          Category: p.category || '—',
          Unit: p.unit,
          'Current Stock': getProductStock(p.id),
          'Min Stock': p.minStock || 0,
          Status: getProductStock(p.id) <= 0 ? 'out_of_stock' : getProductStock(p.id) <= (p.minStock || 0) ? 'low' : 'ok',
        }));
        const columns = [
          { key: 'Product', label: 'Product', render: (r) => <span className="font-medium">{r.Product}</span> },
          { key: 'Variety', label: 'Variety' },
          { key: 'Category', label: 'Category' },
          { key: 'Current Stock', label: 'Current Stock', render: (r) => {
            const cls = r.Status === 'out_of_stock' ? 'text-red-600 font-bold' : r.Status === 'low' ? 'text-amber-600 font-medium' : 'text-green-600 font-medium';
            return <span className={cls}>{r['Current Stock']} {r.Unit}</span>;
          }},
          { key: 'Min Stock', label: 'Min Stock', render: (r) => `${r['Min Stock']} ${r.Unit}` },
          { key: 'Status', label: 'Status', render: (r) => {
            const label = r.Status === 'out_of_stock' ? 'Out of Stock' : r.Status === 'low' ? 'Low Stock' : 'Available';
            const cls = r.Status === 'out_of_stock' ? 'bg-red-50 text-red-700' : r.Status === 'low' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
            return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
          }},
        ];
        return { data, columns };
      }
      case 'customer_payments': {
        const data = customerPayments
          .filter((p) => p.status !== 'cancelled' && inDateRange(p.paymentDate))
          .map((p) => ({
            Date: formatDate(p.paymentDate),
            'Payment #': p.paymentNumber,
            Customer: p.customerName,
            Amount: p.amount,
            Mode: p.paymentMode,
            Reference: p.referenceNumber || '—',
            Against: p.allocations?.map((a) => a.invoiceNumber).join(', ') || 'Advance',
          }));
        const columns = [
          { key: 'Date', label: 'Date' },
          { key: 'Payment #', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r['Payment #']}</span> },
          { key: 'Customer', label: 'Customer' },
          { key: 'Amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.Amount)}</span> },
          { key: 'Mode', label: 'Mode', render: (r) => <span className="capitalize">{r.Mode}</span> },
          { key: 'Reference', label: 'Reference' },
          { key: 'Against', label: 'Against' },
        ];
        return { data, columns };
      }
      case 'supplier_payments': {
        const data = supplierPayments
          .filter((p) => p.status !== 'cancelled' && inDateRange(p.paymentDate))
          .map((p) => ({
            Date: formatDate(p.paymentDate),
            'Payment #': p.paymentNumber,
            Supplier: p.supplierName,
            Amount: p.amount,
            Mode: p.paymentMode,
            Reference: p.referenceNumber || '—',
            Against: p.allocations?.map((a) => a.purchaseNumber).join(', ') || 'Unallocated',
          }));
        const columns = [
          { key: 'Date', label: 'Date' },
          { key: 'Payment #', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r['Payment #']}</span> },
          { key: 'Supplier', label: 'Supplier' },
          { key: 'Amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.Amount)}</span> },
          { key: 'Mode', label: 'Mode', render: (r) => <span className="capitalize">{r.Mode}</span> },
          { key: 'Reference', label: 'Reference' },
          { key: 'Against', label: 'Against' },
        ];
        return { data, columns };
      }
      default: return { data: [], columns: [] };
    }
  };

  const handleExport = (type) => {
    const { data } = getReportData(type);
    if (!data.length) { Swal.fire('No Data', 'No records to export', 'info'); return; }
    exportToCSV(data, `${type}-report`);
    Swal.fire('Exported!', `${type} report downloaded as CSV`, 'success');
  };

  const report = activeReport ? getReportData(activeReport) : null;

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" subtitle="Generate and export business reports" />

      <div className="row g-3">
        {REPORT_TYPES.map((r) => {
          const Icon = r.icon;
          const active = activeReport === r.id;
          return (
            <div key={r.id} className="col-6 col-md-4 col-xl-3">
              <button
                onClick={() => setActiveReport(active ? null : r.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${active ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : `border ${colorMap[r.color]} hover:shadow-sm`}`}
              >
                <Icon className={`w-6 h-6 mb-2 ${active ? 'text-primary-600' : ''}`} />
                <p className="font-semibold text-sm">{r.label}</p>
              </button>
            </div>
          );
        })}
      </div>

      {activeReport && report && (
        <Card>
          <div className="flex flex-wrap gap-3 items-end justify-between mb-4">
            <div className="flex flex-wrap gap-3">
              <div className="w-40">
                <FormField label="From Date">
                  <Input type="date" value={filters.dateFrom} onChange={(e) => updateFilter('dateFrom', e.target.value)} />
                </FormField>
              </div>
              <div className="w-40">
                <FormField label="To Date">
                  <Input type="date" value={filters.dateTo} onChange={(e) => updateFilter('dateTo', e.target.value)} />
                </FormField>
              </div>
            </div>
            <div className="flex gap-2 pb-4">
              <Button variant="secondary" size="sm" onClick={() => setFilters({ dateFrom: '', dateTo: '', search: '' })}>Clear</Button>
              <Button size="sm" onClick={() => handleExport(activeReport)}>Export CSV</Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-3">{report.data.length} records</p>
          <DataTable columns={report.columns} data={report.data} emptyMessage="No data for selected filters" />
        </Card>
      )}
    </div>
  );
}
