export const APP_NAME = 'Raj Lakshmi Fruit Suppliers';
export const PRIMARY_COLOR = '#1a5fb8';

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  { value: 'paid', label: 'Paid', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'partial', label: 'Partial', color: 'bg-amber-100 text-amber-700' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-100 text-red-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
];

export const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'overdue', label: 'Overdue' },
];

export const PRODUCT_UNITS = [
  'Nos', 'Pcs', 'Kg', 'Gm', 'Ltr', 'Ml', 'Box', 'Pkt', 'Set', 'Pair', 'Dozen', 'Meter', 'Sq.Ft', 'Hour', 'Day',
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

export const ROLES = {
  admin: { label: 'Admin', permissions: ['all'] },
  manager: { label: 'Manager', permissions: ['read', 'write', 'reports'] },
  operator: { label: 'Operator', permissions: ['read', 'write'] },
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'HiOutlineViewGrid' },
  { path: '/invoices', label: 'Invoices', icon: 'HiOutlineDocumentText' },
  { path: '/invoices/create', label: 'Create Invoice', icon: 'HiOutlinePlusCircle' },
  { path: '/customers', label: 'Customers', icon: 'HiOutlineUserGroup' },
  { path: '/suppliers', label: 'Suppliers', icon: 'HiOutlineTruck' },
  { path: '/products', label: 'Products', icon: 'HiOutlineCube' },
  { path: '/bills', label: 'Bills', icon: 'HiOutlineReceiptRefund' },
  { path: '/reports', label: 'Reports', icon: 'HiOutlineChartBar' },
  { path: '/settings', label: 'Settings', icon: 'HiOutlineCog' },
];

export const CURRENCIES = [
  { value: 'INR', label: '₹ Indian Rupee (INR)', symbol: '₹' },
  { value: 'USD', label: '$ US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: '€ Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: '£ British Pound (GBP)', symbol: '£' },
];

export const INVOICE_FORMATS = [
  { id: 'classic', label: 'Classic', description: 'Clean professional GST layout' },
  { id: 'tally', label: 'Tally Grid', description: 'Traditional bordered grid format' },
  { id: 'modern', label: 'Modern', description: 'Minimal clean design' },
];

export const INVOICE_THEMES = [
  { id: 'classic', label: 'Classic Blue', primary: '#2563EB' },
  { id: 'emerald', label: 'Emerald Green', primary: '#059669' },
  { id: 'purple', label: 'Royal Purple', primary: '#7C3AED' },
  { id: 'slate', label: 'Professional Slate', primary: '#475569' },
];
