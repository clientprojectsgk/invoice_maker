import {
  HiOutlineChartBar, HiOutlineShoppingCart, HiOutlineReceiptTax,
  HiOutlineUserGroup, HiOutlineTruck, HiOutlineCube, HiOutlineTrendingUp,
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import ReportCard from '../components/reports/ReportCard';
import { PageHeader } from '../components/common/PageHeader';
import { exportToCSV } from '../utils/formatters';

export default function Reports() {
  const { invoices, bills, customers, suppliers, products } = useApp();

  const handleExport = (type, format) => {
    const datasets = {
      sales: invoices.map((i) => ({ 'Invoice #': i.invoiceNumber, Customer: i.customerName, Date: i.invoiceDate, Amount: i.totals?.grandTotal, GST: i.totals?.totalGst, Status: i.status })),
      purchase: bills.map((b) => ({ 'Bill #': b.billNumber, Vendor: b.supplierName, Date: b.billDate, Amount: b.amount, GST: b.gst, Status: b.status })),
      gst: invoices.map((i) => ({ 'Invoice #': i.invoiceNumber, CGST: i.totals?.cgst, SGST: i.totals?.sgst, IGST: i.totals?.igst, Total: i.totals?.totalGst })),
      customer: customers.map((c) => ({ Name: c.name, Phone: c.phone, Email: c.email, GST: c.gst, State: c.state })),
      supplier: suppliers.map((s) => ({ Name: s.name, Phone: s.phone, GST: s.gst, 'Payment Terms': s.paymentTerms })),
      product: products.map((p) => ({ Name: p.name, SKU: p.sku, Price: p.sellingPrice, Stock: p.stock, GST: p.gst })),
      profit: invoices.map((i) => ({ 'Invoice #': i.invoiceNumber, Revenue: i.totals?.grandTotal, Cost: i.totals?.subtotal * 0.7, Profit: (i.totals?.grandTotal || 0) - (i.totals?.subtotal || 0) * 0.7 })),
    };

    if (format === 'excel' || format === 'csv') {
      exportToCSV(datasets[type] || [], `${type}-report`);
      Swal.fire('Exported!', `${type} report downloaded as CSV`, 'success');
    } else {
      Swal.fire('PDF Export', 'PDF generation ready for backend integration', 'info');
    }
  };

  const reports = [
    { title: 'Sales Report', description: 'All sales invoices with amounts and status', icon: HiOutlineChartBar, color: 'blue', type: 'sales' },
    { title: 'Purchase Report', description: 'Purchase bills and vendor payments', icon: HiOutlineShoppingCart, color: 'purple', type: 'purchase' },
    { title: 'GST Report', description: 'CGST, SGST, IGST breakdown by invoice', icon: HiOutlineReceiptTax, color: 'green', type: 'gst' },
    { title: 'Customer Report', description: 'Complete customer directory export', icon: HiOutlineUserGroup, color: 'amber', type: 'customer' },
    { title: 'Supplier Report', description: 'Supplier details and payment terms', icon: HiOutlineTruck, color: 'red', type: 'supplier' },
    { title: 'Product Report', description: 'Product catalog with pricing and stock', icon: HiOutlineCube, color: 'slate', type: 'product' },
    { title: 'Profit Report', description: 'Revenue vs cost analysis per invoice', icon: HiOutlineTrendingUp, color: 'green', type: 'profit' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" subtitle="Generate and export business reports" />

      <div className="row g-4">
        {reports.map((report) => (
          <div key={report.type} className="col-12 col-md-6 col-xl-4">
            <ReportCard {...report} onExport={(format) => handleExport(report.type, format)} />
          </div>
        ))}
      </div>
    </div>
  );
}
