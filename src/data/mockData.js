export const defaultSettings = {
  companyName: 'Raj Lakshmi Fruit Suppliers',
  address: 'Wholesale Market, Nashik Road, Nashik',
  gst: '27AABFR1234A1Z5',
  phone: '9876543210',
  email: 'info@rajlakshmi.com',
  state: 'Maharashtra',
  pincode: '422101',
  bankName: 'HDFC Bank',
  bankAccount: '50200012345678',
  bankIFSC: 'HDFC0001234',
  bankBranch: 'Nashik Road',
  invoicePrefix: 'INV',
  currency: 'INR',
  theme: 'classic',
  terms: 'Payment is due within 15 days. Fresh produce — no returns after 24 hours.',
  declaration: 'We declare that this invoice shows the actual price of the goods described.',
  logo: null,
  signature: null,
  gstEnabled: true,
  cgstSgstSplit: true,
  allowNegativeStock: false,
};

export const initialCustomers = [
  {
    id: 'c1', name: 'ABC Traders', phone: '9876543210', email: 'abc@traders.com',
    gst: '27AABCR1234A1Z5', address: 'APMC Market, Mumbai', state: 'Maharashtra', pincode: '400069',
    billingAddress: 'APMC Market, Vashi, Mumbai', shippingAddress: 'APMC Market, Vashi, Mumbai',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'c2', name: 'XYZ Market', phone: '8765432109', email: 'xyz@market.com',
    gst: '07AABCS5678B2Z3', address: 'Azadpur Mandi, Delhi', state: 'Delhi', pincode: '110033',
    billingAddress: 'Azadpur Mandi, Delhi', shippingAddress: 'Azadpur Mandi, Delhi',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'c3', name: 'Green Fresh Mart', phone: '7654321098', email: 'green@fresh.com',
    gst: '24AABCP9012C3Z1', address: 'CG Road, Ahmedabad', state: 'Gujarat', pincode: '380009',
    billingAddress: 'CG Road, Ahmedabad', shippingAddress: 'CG Road, Ahmedabad',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'c4', name: 'City Super Bazaar', phone: '6543210987', email: 'city@bazaar.com',
    gst: '36AABCR3456D4Z9', address: 'Banjara Hills, Hyderabad', state: 'Telangana', pincode: '500034',
    billingAddress: 'Banjara Hills, Hyderabad', shippingAddress: 'Banjara Hills, Hyderabad',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'c5', name: 'Daily Needs Store', phone: '9432109876', email: 'daily@needs.com',
    gst: '09AABCV7890E5Z7', address: 'Civil Lines, Lucknow', state: 'Uttar Pradesh', pincode: '226001',
    billingAddress: 'Civil Lines, Lucknow', shippingAddress: 'Civil Lines, Lucknow',
    createdAt: '2026-02-15T10:00:00Z',
  },
];

export const initialSuppliers = [
  {
    id: 's1', name: 'Ramesh Patil', phone: '9123456780', email: 'ramesh@farmer.com',
    gst: '', address: 'Lasalgaon, Nashik', state: 'Maharashtra', pincode: '422306',
    billingAddress: 'Lasalgaon, Nashik', shippingAddress: 'Lasalgaon, Nashik',
    bankName: 'SBI', bankAccount: '30123456789', bankIFSC: 'SBIN0001234',
    paymentTerms: 'Net 7', createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 's2', name: 'Suresh Kadam', phone: '8234567890', email: 'suresh@farmer.com',
    gst: '', address: 'Pimpalgaon, Nashik', state: 'Maharashtra', pincode: '422209',
    billingAddress: 'Pimpalgaon, Nashik', shippingAddress: 'Pimpalgaon, Nashik',
    bankName: 'ICICI Bank', bankAccount: '601234567890', bankIFSC: 'ICIC0001234',
    paymentTerms: 'Net 15', createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 's3', name: 'Ganesh Bhosale', phone: '7345678901', email: 'ganesh@farmer.com',
    gst: '', address: 'Sinnar, Nashik', state: 'Maharashtra', pincode: '422103',
    billingAddress: 'Sinnar, Nashik', shippingAddress: 'Sinnar, Nashik',
    bankName: 'Bank of Maharashtra', bankAccount: '40123456789', bankIFSC: 'MAHB0001234',
    paymentTerms: 'Net 7', createdAt: '2026-02-01T10:00:00Z',
  },
];

export const initialProducts = [
  { id: 'p1', name: 'Onion', category: 'Vegetables', variety: 'Red', hsn: '0703', sku: 'ONI-RED', barcode: '', gst: 0, purchasePrice: 25, sellingPrice: 32, unit: 'Kg', stock: 400, minStock: 100, status: 'active', image: null },
  { id: 'p2', name: 'Tomato', category: 'Vegetables', variety: 'Hybrid', hsn: '0702', sku: 'TOM-HYB', barcode: '', gst: 0, purchasePrice: 30, sellingPrice: 40, unit: 'Kg', stock: 250, minStock: 50, status: 'active', image: null },
  { id: 'p3', name: 'Potato', category: 'Vegetables', variety: 'Jyoti', hsn: '0701', sku: 'POT-JYO', barcode: '', gst: 0, purchasePrice: 18, sellingPrice: 24, unit: 'Kg', stock: 600, minStock: 150, status: 'active', image: null },
  { id: 'p4', name: 'Apple', category: 'Fruits', variety: 'Kashmiri', hsn: '0808', sku: 'APL-KAS', barcode: '', gst: 0, purchasePrice: 120, sellingPrice: 150, unit: 'Kg', stock: 80, minStock: 20, status: 'active', image: null },
  { id: 'p5', name: 'Banana', category: 'Fruits', variety: 'Robusta', hsn: '0803', sku: 'BAN-ROB', barcode: '', gst: 0, purchasePrice: 35, sellingPrice: 45, unit: 'Kg', stock: 120, minStock: 30, status: 'active', image: null },
  { id: 'p6', name: 'Grapes', category: 'Fruits', variety: 'Thompson', hsn: '0806', sku: 'GRP-THO', barcode: '', gst: 0, purchasePrice: 60, sellingPrice: 80, unit: 'Kg', stock: 50, minStock: 15, status: 'active', image: null },
  { id: 'p7', name: 'Capsicum', category: 'Vegetables', variety: 'Green', hsn: '0709', sku: 'CAP-GRN', barcode: '', gst: 0, purchasePrice: 40, sellingPrice: 55, unit: 'Kg', stock: 30, minStock: 10, status: 'active', image: null },
  { id: 'p8', name: 'Cabbage', category: 'Vegetables', variety: 'Regular', hsn: '0704', sku: 'CAB-REG', barcode: '', gst: 0, purchasePrice: 15, sellingPrice: 22, unit: 'Kg', stock: 200, minStock: 40, status: 'active', image: null },
];

const generateInvoiceItems = (productIds, products) =>
  productIds.map(({ productId, qty, discount = 0 }) => {
    const p = products.find((pr) => pr.id === productId);
    return {
      productId, product: p?.name || '', variety: p?.variety || '', hsn: p?.hsn || '', qty, unit: p?.unit || 'Kg',
      price: p?.sellingPrice || 0, discount, gst: p?.gst || 0,
    };
  });

export const initialInvoices = [
  {
    id: 'inv1', invoiceNumber: 'INV-2026-000001', status: 'paid',
    invoiceDate: '2026-08-01', dueDate: '2026-08-15',
    customerId: 'c1', customerName: 'ABC Traders', customerGst: '27AABCR1234A1Z5',
    customerPhone: '9876543210', customerEmail: 'abc@traders.com',
    billingAddress: 'APMC Market, Vashi, Mumbai', shippingAddress: 'APMC Market, Vashi, Mumbai',
    customerState: 'Maharashtra', isInterState: false,
    items: generateInvoiceItems([{ productId: 'p1', qty: 500 }, { productId: 'p2', qty: 200 }], initialProducts),
    charges: { transport: 1000, packing: 0, loading: 500, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: 'MH-15-AB-1234', transportName: 'Local Transport',
    totals: { subtotal: 24000, totalDiscount: 0, totalTaxable: 24000, totalGst: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 25500, transport: 1000, packing: 0 },
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2026-000002', status: 'partial',
    invoiceDate: '2026-08-05', dueDate: '2026-08-20',
    customerId: 'c2', customerName: 'XYZ Market', customerGst: '07AABCS5678B2Z3',
    customerPhone: '8765432109', customerEmail: 'xyz@market.com',
    billingAddress: 'Azadpur Mandi, Delhi', shippingAddress: 'Azadpur Mandi, Delhi',
    customerState: 'Delhi', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p3', qty: 300 }, { productId: 'p4', qty: 50 }], initialProducts),
    charges: { transport: 2000, packing: 0, loading: 0, other: 0, discount: 500, roundOff: 0 },
    vehicleNumber: 'DL-01-CD-5678', transportName: 'North Transport',
    totals: { subtotal: 14700, totalDiscount: 0, totalTaxable: 14700, totalGst: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 16200, transport: 2000, packing: 0 },
    createdAt: '2026-08-05T10:00:00Z',
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2026-000003', status: 'overdue',
    invoiceDate: '2026-07-15', dueDate: '2026-07-30',
    customerId: 'c3', customerName: 'Green Fresh Mart', customerGst: '24AABCP9012C3Z1',
    customerPhone: '7654321098', customerEmail: 'green@fresh.com',
    billingAddress: 'CG Road, Ahmedabad', shippingAddress: 'CG Road, Ahmedabad',
    customerState: 'Gujarat', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p5', qty: 100 }, { productId: 'p6', qty: 40 }], initialProducts),
    charges: { transport: 1500, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: 'GJ-01-EF-9012', transportName: 'West Cargo',
    totals: { subtotal: 7700, totalDiscount: 0, totalTaxable: 7700, totalGst: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 9200, transport: 1500, packing: 0 },
    createdAt: '2026-07-15T10:00:00Z',
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2026-000004', status: 'draft',
    invoiceDate: '2026-08-20', dueDate: '2026-09-05',
    customerId: 'c4', customerName: 'City Super Bazaar', customerGst: '36AABCR3456D4Z9',
    customerPhone: '6543210987', customerEmail: 'city@bazaar.com',
    billingAddress: 'Banjara Hills, Hyderabad', shippingAddress: 'Banjara Hills, Hyderabad',
    customerState: 'Telangana', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p7', qty: 20 }, { productId: 'p8', qty: 100 }], initialProducts),
    charges: { transport: 0, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: '', transportName: '',
    totals: { subtotal: 3300, totalDiscount: 0, totalTaxable: 3300, totalGst: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 3300, transport: 0, packing: 0 },
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2026-000005', status: 'partial',
    invoiceDate: '2026-08-10', dueDate: '2026-08-25',
    customerId: 'c5', customerName: 'Daily Needs Store', customerGst: '09AABCV7890E5Z7',
    customerPhone: '9432109876', customerEmail: 'daily@needs.com',
    billingAddress: 'Civil Lines, Lucknow', shippingAddress: 'Civil Lines, Lucknow',
    customerState: 'Uttar Pradesh', isInterState: true,
    items: generateInvoiceItems([{ productId: 'p1', qty: 200 }, { productId: 'p3', qty: 150 }], initialProducts),
    charges: { transport: 800, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    vehicleNumber: 'UP-32-GH-3456', transportName: 'UP Transport',
    totals: { subtotal: 10000, totalDiscount: 0, totalTaxable: 10000, totalGst: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 10800, transport: 800, packing: 0 },
    createdAt: '2026-08-10T10:00:00Z',
  },
];

export const initialPurchases = [
  {
    id: 'pur1', purchaseNumber: 'PUR-2026-0001', purchaseDate: '2026-08-20',
    supplierId: 's1', supplierName: 'Ramesh Patil',
    productId: 'p1', product: 'Onion', variety: 'Red', qty: 500, unit: 'Kg',
    purchaseRate: 25, totalAmount: 12500, transportationCost: 1000, otherExpenses: 0,
    finalAmount: 13500, amountPaid: 10000, amountPending: 3500,
    paymentStatus: 'partial', status: 'confirmed', notes: 'Fresh batch from Lasalgaon',
    createdAt: '2026-08-20T08:00:00Z',
  },
  {
    id: 'pur2', purchaseNumber: 'PUR-2026-0002', purchaseDate: '2026-08-22',
    supplierId: 's1', supplierName: 'Ramesh Patil',
    productId: 'p2', product: 'Tomato', variety: 'Hybrid', qty: 300, unit: 'Kg',
    purchaseRate: 30, totalAmount: 9000, transportationCost: 500, otherExpenses: 0,
    finalAmount: 9500, amountPaid: 9500, amountPending: 0,
    paymentStatus: 'paid', status: 'confirmed', notes: '',
    createdAt: '2026-08-22T08:00:00Z',
  },
  {
    id: 'pur3', purchaseNumber: 'PUR-2026-0003', purchaseDate: '2026-08-24',
    supplierId: 's2', supplierName: 'Suresh Kadam',
    productId: 'p3', product: 'Potato', variety: 'Jyoti', qty: 400, unit: 'Kg',
    purchaseRate: 18, totalAmount: 7200, transportationCost: 800, otherExpenses: 200,
    finalAmount: 8200, amountPaid: 3000, amountPending: 5200,
    paymentStatus: 'partial', status: 'confirmed', notes: 'Cold storage delivery',
    createdAt: '2026-08-24T07:00:00Z',
  },
];

export const initialCustomerPayments = [
  {
    id: 'cpay1', paymentNumber: 'PAY-2026-0001', paymentDate: '2026-08-03',
    customerId: 'c1', customerName: 'ABC Traders', amount: 25500,
    paymentMode: 'bank', referenceNumber: 'TXN123456', notes: 'Full payment',
    allocations: [{ invoiceId: 'inv1', invoiceNumber: 'INV-2026-000001', amount: 25500 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-03T10:00:00Z',
  },
  {
    id: 'cpay2', paymentNumber: 'PAY-2026-0002', paymentDate: '2026-08-08',
    customerId: 'c2', customerName: 'XYZ Market', amount: 10000,
    paymentMode: 'upi', referenceNumber: 'UPI789012', notes: 'Partial payment',
    allocations: [{ invoiceId: 'inv2', invoiceNumber: 'INV-2026-000002', amount: 10000 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-08T14:00:00Z',
  },
  {
    id: 'cpay3', paymentNumber: 'PAY-2026-0003', paymentDate: '2026-08-15',
    customerId: 'c5', customerName: 'Daily Needs Store', amount: 5000,
    paymentMode: 'cash', referenceNumber: '', notes: 'Partial',
    allocations: [{ invoiceId: 'inv5', invoiceNumber: 'INV-2026-000005', amount: 5000 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-15T11:00:00Z',
  },
];

export const initialSupplierPayments = [
  {
    id: 'spay1', paymentNumber: 'SPAY-2026-0001', paymentDate: '2026-08-21',
    supplierId: 's1', supplierName: 'Ramesh Patil', amount: 10000,
    paymentMode: 'cash', referenceNumber: '', notes: 'Partial for onion purchase',
    allocations: [{ purchaseId: 'pur1', purchaseNumber: 'PUR-2026-0001', amount: 10000 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-21T09:00:00Z',
  },
  {
    id: 'spay2', paymentNumber: 'SPAY-2026-0002', paymentDate: '2026-08-22',
    supplierId: 's1', supplierName: 'Ramesh Patil', amount: 9500,
    paymentMode: 'upi', referenceNumber: 'UPI456789', notes: 'Full payment tomato',
    allocations: [{ purchaseId: 'pur2', purchaseNumber: 'PUR-2026-0002', amount: 9500 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-22T16:00:00Z',
  },
  {
    id: 'spay3', paymentNumber: 'SPAY-2026-0003', paymentDate: '2026-08-24',
    supplierId: 's2', supplierName: 'Suresh Kadam', amount: 3000,
    paymentMode: 'bank', referenceNumber: 'NEFT987654', notes: 'Advance',
    allocations: [{ purchaseId: 'pur3', purchaseNumber: 'PUR-2026-0003', amount: 3000 }],
    unallocatedAmount: 0, status: 'active',
    createdAt: '2026-08-24T12:00:00Z',
  },
];

export const initialStockMovements = [
  { id: 'sm1', date: '2026-08-20', type: 'purchase', productId: 'p1', productName: 'Onion', variety: 'Red', referenceType: 'purchase', referenceId: 'pur1', referenceNumber: 'PUR-2026-0001', qtyIn: 500, qtyOut: 0, unit: 'Kg', status: 'active', createdAt: '2026-08-20T08:00:00Z' },
  { id: 'sm2', date: '2026-08-22', type: 'purchase', productId: 'p2', productName: 'Tomato', variety: 'Hybrid', referenceType: 'purchase', referenceId: 'pur2', referenceNumber: 'PUR-2026-0002', qtyIn: 300, qtyOut: 0, unit: 'Kg', status: 'active', createdAt: '2026-08-22T08:00:00Z' },
  { id: 'sm3', date: '2026-08-24', type: 'purchase', productId: 'p3', productName: 'Potato', variety: 'Jyoti', referenceType: 'purchase', referenceId: 'pur3', referenceNumber: 'PUR-2026-0003', qtyIn: 400, qtyOut: 0, unit: 'Kg', status: 'active', createdAt: '2026-08-24T07:00:00Z' },
  { id: 'sm4', date: '2026-08-01', type: 'sale', productId: 'p1', productName: 'Onion', variety: 'Red', referenceType: 'invoice', referenceId: 'inv1', referenceNumber: 'INV-2026-000001', qtyIn: 0, qtyOut: 500, unit: 'Kg', status: 'active', createdAt: '2026-08-01T10:00:00Z' },
  { id: 'sm5', date: '2026-08-01', type: 'sale', productId: 'p2', productName: 'Tomato', variety: 'Hybrid', referenceType: 'invoice', referenceId: 'inv1', referenceNumber: 'INV-2026-000001', qtyIn: 0, qtyOut: 200, unit: 'Kg', status: 'active', createdAt: '2026-08-01T10:00:00Z' },
  { id: 'sm6', date: '2026-08-05', type: 'sale', productId: 'p3', productName: 'Potato', variety: 'Jyoti', referenceType: 'invoice', referenceId: 'inv2', referenceNumber: 'INV-2026-000002', qtyIn: 0, qtyOut: 300, unit: 'Kg', status: 'active', createdAt: '2026-08-05T10:00:00Z' },
  { id: 'sm7', date: '2026-08-05', type: 'sale', productId: 'p4', productName: 'Apple', variety: 'Kashmiri', referenceType: 'invoice', referenceId: 'inv2', referenceNumber: 'INV-2026-000002', qtyIn: 0, qtyOut: 50, unit: 'Kg', status: 'active', createdAt: '2026-08-05T10:00:00Z' },
  { id: 'sm8', date: '2026-08-10', type: 'sale', productId: 'p1', productName: 'Onion', variety: 'Red', referenceType: 'invoice', referenceId: 'inv5', referenceNumber: 'INV-2026-000005', qtyIn: 0, qtyOut: 200, unit: 'Kg', status: 'active', createdAt: '2026-08-10T10:00:00Z' },
  { id: 'sm9', date: '2026-08-10', type: 'sale', productId: 'p3', productName: 'Potato', variety: 'Jyoti', referenceType: 'invoice', referenceId: 'inv5', referenceNumber: 'INV-2026-000005', qtyIn: 0, qtyOut: 150, unit: 'Kg', status: 'active', createdAt: '2026-08-10T10:00:00Z' },
];

export const initialBills = [
  { id: 'b1', type: 'purchase', billNumber: 'PUR-2026-001', supplierId: 's1', supplierName: 'Ramesh Patil', amount: 13500, gst: 0, status: 'partial', billDate: '2026-08-20', dueDate: '2026-08-27', description: 'Onion purchase' },
  { id: 'b2', type: 'expense', billNumber: 'EXP-2026-001', supplierId: '', supplierName: 'Cold Storage Rent', amount: 15000, gst: 0, status: 'paid', billDate: '2026-08-01', dueDate: '2026-08-01', description: 'Monthly cold storage rent' },
  { id: 'b3', type: 'vendor', billNumber: 'VEN-2026-001', supplierId: 's2', supplierName: 'Suresh Kadam', amount: 8200, gst: 0, status: 'partial', billDate: '2026-08-24', dueDate: '2026-09-08', description: 'Potato purchase' },
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
  { name: 'Onion', sales: 520000 },
  { name: 'Tomato', sales: 285000 },
  { name: 'Potato', sales: 187500 },
  { name: 'Apple', sales: 134910 },
  { name: 'Banana', sales: 94950 },
  { name: 'Grapes', sales: 70000 },
  { name: 'Capsicum', sales: 44980 },
  { name: 'Cabbage', sales: 44955 },
];
