export const defaultSettings = {
  companyName: 'Acme Technologies Pvt. Ltd.',
  address: '123, Business Park, MG Road, Bangalore',
  gst: '29AABCU9603R1ZM',
  phone: '9876543210',
  email: 'info@acmetech.com',
  state: 'Karnataka',
  pincode: '560001',
  bankName: 'HDFC Bank',
  bankAccount: '50200012345678',
  bankIFSC: 'HDFC0001234',
  bankBranch: 'MG Road, Bangalore',
  invoicePrefix: 'INV',
  currency: 'INR',
  theme: 'classic',
  terms: 'Payment is due within 30 days. Late payments may incur interest charges.',
  declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  logo: null,
  signature: null,
  gstEnabled: true,
  cgstSgstSplit: true,
};

export const initialCustomers = [
  {
    id: 'c1', name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@example.com',
    gst: '27AABCR1234A1Z5', address: '45, Andheri East', state: 'Maharashtra', pincode: '400069',
    billingAddress: '45, Andheri East, Mumbai', shippingAddress: '45, Andheri East, Mumbai',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'c2', name: 'Priya Sharma', phone: '8765432109', email: 'priya@example.com',
    gst: '07AABCS5678B2Z3', address: '12, Connaught Place', state: 'Delhi', pincode: '110001',
    billingAddress: '12, Connaught Place, New Delhi', shippingAddress: '12, Connaught Place, New Delhi',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'c3', name: 'Suresh Patel', phone: '7654321098', email: 'suresh@example.com',
    gst: '24AABCP9012C3Z1', address: '78, CG Road', state: 'Gujarat', pincode: '380009',
    billingAddress: '78, CG Road, Ahmedabad', shippingAddress: '78, CG Road, Ahmedabad',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'c4', name: 'Anita Reddy', phone: '6543210987', email: 'anita@example.com',
    gst: '36AABCR3456D4Z9', address: '23, Banjara Hills', state: 'Telangana', pincode: '500034',
    billingAddress: '23, Banjara Hills, Hyderabad', shippingAddress: '23, Banjara Hills, Hyderabad',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'c5', name: 'Vikram Singh', phone: '9432109876', email: 'vikram@example.com',
    gst: '09AABCV7890E5Z7', address: '56, Civil Lines', state: 'Uttar Pradesh', pincode: '226001',
    billingAddress: '56, Civil Lines, Lucknow', shippingAddress: '56, Civil Lines, Lucknow',
    createdAt: '2026-02-15T10:00:00Z',
  },
];

export const initialSuppliers = [
  {
    id: 's1', name: 'Global Supplies Co.', phone: '9123456780', email: 'contact@globalsupplies.com',
    gst: '29AABCG1234F1Z2', address: '100, Industrial Area', state: 'Karnataka', pincode: '560058',
    billingAddress: '100, Industrial Area, Bangalore', shippingAddress: '100, Industrial Area, Bangalore',
    bankName: 'ICICI Bank', bankAccount: '601234567890', bankIFSC: 'ICIC0001234',
    paymentTerms: 'Net 30', createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 's2', name: 'Prime Materials Ltd.', phone: '8234567890', email: 'sales@primematerials.com',
    gst: '27AABCP5678G2Z4', address: '200, MIDC Area', state: 'Maharashtra', pincode: '400093',
    billingAddress: '200, MIDC Area, Mumbai', shippingAddress: '200, MIDC Area, Mumbai',
    bankName: 'SBI', bankAccount: '30123456789', bankIFSC: 'SBIN0001234',
    paymentTerms: 'Net 45', createdAt: '2026-01-25T10:00:00Z',
  },
];

export const initialProducts = [
  { id: 'p1', name: 'Laptop Dell Inspiron 15', category: 'Electronics', hsn: '8471', sku: 'DELL-INS15', barcode: '8901234567890', gst: 18, purchasePrice: 45000, sellingPrice: 52000, unit: 'Nos', stock: 25, minStock: 5, status: 'active', image: null },
  { id: 'p2', name: 'Wireless Mouse Logitech', category: 'Accessories', hsn: '8471', sku: 'LOG-MX3', barcode: '8901234567891', gst: 18, purchasePrice: 1200, sellingPrice: 1899, unit: 'Nos', stock: 150, minStock: 20, status: 'active', image: null },
  { id: 'p3', name: 'USB-C Hub 7-in-1', category: 'Accessories', hsn: '8544', sku: 'HUB-7IN1', barcode: '8901234567892', gst: 18, purchasePrice: 800, sellingPrice: 1499, unit: 'Nos', stock: 80, minStock: 15, status: 'active', image: null },
  { id: 'p4', name: 'A4 Paper Ream (500 sheets)', category: 'Stationery', hsn: '4802', sku: 'PAP-A4-500', barcode: '8901234567893', gst: 12, purchasePrice: 220, sellingPrice: 350, unit: 'Pkt', stock: 200, minStock: 50, status: 'active', image: null },
  { id: 'p5', name: 'Office Chair Ergonomic', category: 'Furniture', hsn: '9401', sku: 'CHR-ERG01', barcode: '8901234567894', gst: 18, purchasePrice: 8500, sellingPrice: 12500, unit: 'Nos', stock: 12, minStock: 3, status: 'active', image: null },
  { id: 'p6', name: 'LED Monitor 27"', category: 'Electronics', hsn: '8528', sku: 'MON-LED27', barcode: '8901234567895', gst: 18, purchasePrice: 15000, sellingPrice: 18999, unit: 'Nos', stock: 18, minStock: 5, status: 'active', image: null },
  { id: 'p7', name: 'Printer Ink Cartridge', category: 'Accessories', hsn: '3215', sku: 'INK-HP680', barcode: '8901234567896', gst: 18, purchasePrice: 650, sellingPrice: 999, unit: 'Pcs', stock: 45, minStock: 10, status: 'active', image: null },
  { id: 'p8', name: 'Network Switch 8-Port', category: 'Electronics', hsn: '8517', sku: 'NET-SW8', barcode: '8901234567897', gst: 18, purchasePrice: 2200, sellingPrice: 3499, unit: 'Nos', stock: 30, minStock: 8, status: 'active', image: null },
];

const generateInvoiceItems = (productIds, products) =>
  productIds.map(({ productId, qty, discount = 0 }) => {
    const p = products.find((pr) => pr.id === productId);
    return {
      productId, product: p?.name || '', hsn: p?.hsn || '', qty, unit: p?.unit || 'Nos',
      price: p?.sellingPrice || 0, discount, gst: p?.gst || 18,
    };
  });

export const initialInvoices = [
  {
    id: 'inv1', invoiceNumber: 'INV-2026-000001', status: 'paid',
    invoiceDate: '2026-03-01', dueDate: '2026-03-31',
    customerId: 'c1', customerName: 'Rajesh Kumar', customerGst: '27AABCR1234A1Z5',
    customerPhone: '9876543210', customerEmail: 'rajesh@example.com',
    billingAddress: '45, Andheri East, Mumbai', shippingAddress: '45, Andheri East, Mumbai',
    customerState: 'Maharashtra', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p1', qty: 2 }, { productId: 'p2', qty: 5 }], initialProducts),
    charges: { transport: 500, packing: 200, loading: 0, other: 0, discount: 0, roundOff: -0.32 },
    vehicleNumber: 'MH-12-AB-1234', transportName: 'Blue Dart',
    totals: { subtotal: 113495, totalDiscount: 0, totalTaxable: 113495, totalGst: 20429.1, cgst: 0, sgst: 0, igst: 20429.1, grandTotal: 134623.78, transport: 500, packing: 200 },
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2026-000002', status: 'sent',
    invoiceDate: '2026-03-05', dueDate: '2026-04-05',
    customerId: 'c2', customerName: 'Priya Sharma', customerGst: '07AABCS5678B2Z3',
    customerPhone: '8765432109', customerEmail: 'priya@example.com',
    billingAddress: '12, Connaught Place, New Delhi', shippingAddress: '12, Connaught Place, New Delhi',
    customerState: 'Delhi', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p3', qty: 10 }, { productId: 'p6', qty: 1 }], initialProducts),
    charges: { transport: 300, packing: 100, loading: 0, other: 0, discount: 500, roundOff: 0.18 },
    vehicleNumber: '', transportName: '',
    totals: { subtotal: 33989, totalDiscount: 0, totalTaxable: 33989, totalGst: 6118.02, cgst: 0, sgst: 0, igst: 6118.02, grandTotal: 39907.2 },
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2026-000003', status: 'overdue',
    invoiceDate: '2026-02-15', dueDate: '2026-03-15',
    customerId: 'c3', customerName: 'Suresh Patel', customerGst: '24AABCP9012C3Z1',
    customerPhone: '7654321098', customerEmail: 'suresh@example.com',
    billingAddress: '78, CG Road, Ahmedabad', shippingAddress: '78, CG Road, Ahmedabad',
    customerState: 'Gujarat', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p5', qty: 3 }, { productId: 'p4', qty: 20 }], initialProducts),
    charges: { transport: 0, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: 'GJ-01-CD-5678', transportName: 'DTDC',
    totals: { subtotal: 44500, totalDiscount: 0, totalTaxable: 44500, totalGst: 8010, cgst: 0, sgst: 0, igst: 8010, grandTotal: 52510 },
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2026-000004', status: 'draft',
    invoiceDate: '2026-03-10', dueDate: '2026-04-10',
    customerId: 'c4', customerName: 'Anita Reddy', customerGst: '36AABCR3456D4Z9',
    customerPhone: '6543210987', customerEmail: 'anita@example.com',
    billingAddress: '23, Banjara Hills, Hyderabad', shippingAddress: '23, Banjara Hills, Hyderabad',
    customerState: 'Telangana', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p7', qty: 15 }, { productId: 'p8', qty: 2 }], initialProducts),
    charges: { transport: 0, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: '', transportName: '',
    totals: { subtotal: 21983, totalDiscount: 0, totalTaxable: 21983, totalGst: 3956.94, cgst: 0, sgst: 0, igst: 3956.94, grandTotal: 25939.94 },
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2026-000005', status: 'partial',
    invoiceDate: '2026-03-08', dueDate: '2026-04-08',
    customerId: 'c5', customerName: 'Vikram Singh', customerGst: '09AABCV7890E5Z7',
    customerPhone: '9432109876', customerEmail: 'vikram@example.com',
    billingAddress: '56, Civil Lines, Lucknow', shippingAddress: '56, Civil Lines, Lucknow',
    customerState: 'Uttar Pradesh', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p1', qty: 1 }, { productId: 'p6', qty: 2 }], initialProducts),
    charges: { transport: 800, packing: 0, loading: 0, other: 0, discount: 1000, roundOff: -0.46 },
    vehicleNumber: 'UP-32-EF-9012', transportName: 'FedEx',
    totals: { subtotal: 89998, totalDiscount: 0, totalTaxable: 89998, totalGst: 16199.64, cgst: 0, sgst: 0, igst: 16199.64, grandTotal: 105997.18 },
    createdAt: '2026-03-08T10:00:00Z',
  },
];

export const initialBills = [
  { id: 'b1', type: 'purchase', billNumber: 'PUR-2026-001', supplierId: 's1', supplierName: 'Global Supplies Co.', amount: 125000, gst: 22500, status: 'paid', billDate: '2026-02-28', dueDate: '2026-03-30', description: 'Electronics bulk order' },
  { id: 'b2', type: 'expense', billNumber: 'EXP-2026-001', supplierId: '', supplierName: 'Office Rent', amount: 45000, gst: 0, status: 'paid', billDate: '2026-03-01', dueDate: '2026-03-01', description: 'Monthly office rent' },
  { id: 'b3', type: 'vendor', billNumber: 'VEN-2026-001', supplierId: 's2', supplierName: 'Prime Materials Ltd.', amount: 78500, gst: 14130, status: 'pending', billDate: '2026-03-05', dueDate: '2026-04-19', description: 'Raw materials supply' },
];

export const monthlySalesData = [
  { month: 'Apr', sales: 185000, purchase: 95000 },
  { month: 'May', sales: 220000, purchase: 110000 },
  { month: 'Jun', sales: 198000, purchase: 102000 },
  { month: 'Jul', sales: 245000, purchase: 125000 },
  { month: 'Aug', sales: 267000, purchase: 135000 },
  { month: 'Sep', sales: 289000, purchase: 148000 },
  { month: 'Oct', sales: 310000, purchase: 155000 },
  { month: 'Nov', sales: 295000, purchase: 142000 },
  { month: 'Dec', sales: 340000, purchase: 168000 },
  { month: 'Jan', sales: 278000, purchase: 138000 },
  { month: 'Feb', sales: 315000, purchase: 152000 },
  { month: 'Mar', sales: 352000, purchase: 175000 },
];

export const productSalesData = [
  { name: 'Laptop Dell', sales: 520000 },
  { name: 'LED Monitor', sales: 285000 },
  { name: 'Office Chair', sales: 187500 },
  { name: 'USB-C Hub', sales: 134910 },
  { name: 'Wireless Mouse', sales: 94950 },
  { name: 'A4 Paper', sales: 70000 },
  { name: 'Net Switch', sales: 69980 },
  { name: 'Ink Cartridge', sales: 44955 },
];
