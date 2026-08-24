import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/formatters';
import { getNextInvoiceNumber } from '../utils/invoiceNumber';
import { getNextPurchaseNumber, getNextPaymentNumber } from '../utils/transactionNumbers';
import { calculateInvoiceTotals } from '../utils/gstCalculator';
import {
  calcPurchaseAmounts, computeInvoiceStatus, computePurchaseStatus,
  getCustomerSummary, getSupplierSummary, buildCustomerLedger, buildSupplierLedger,
  buildStockLedger, getProductStock, getOutstandingCustomers, getOutstandingSuppliers,
  getDashboardBusinessStats, getCustomerProductHistory, getSupplierProductHistory,
  getInvoicePending, getPurchasePending, getCustomerAgingSummary,
} from '../utils/businessLogic';
import {
  initialCustomers, initialSuppliers, initialProducts, initialInvoices,
  initialBills, initialPurchases, initialCustomerPayments, initialSupplierPayments,
  initialStockMovements, defaultSettings,
} from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('ip_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('ip_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ip_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('ip_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('ip_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('ip_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });
  const [customerPayments, setCustomerPayments] = useState(() => {
    const saved = localStorage.getItem('ip_customer_payments');
    return saved ? JSON.parse(saved) : initialCustomerPayments;
  });
  const [supplierPayments, setSupplierPayments] = useState(() => {
    const saved = localStorage.getItem('ip_supplier_payments');
    return saved ? JSON.parse(saved) : initialSupplierPayments;
  });
  const [stockMovements, setStockMovements] = useState(() => {
    const saved = localStorage.getItem('ip_stock_movements');
    return saved ? JSON.parse(saved) : initialStockMovements;
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ip_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('ip_activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [deletedItems, setDeletedItems] = useState([]);

  useEffect(() => { localStorage.setItem('ip_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('ip_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('ip_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ip_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('ip_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('ip_purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem('ip_customer_payments', JSON.stringify(customerPayments)); }, [customerPayments]);
  useEffect(() => { localStorage.setItem('ip_supplier_payments', JSON.stringify(supplierPayments)); }, [supplierPayments]);
  useEffect(() => { localStorage.setItem('ip_stock_movements', JSON.stringify(stockMovements)); }, [stockMovements]);
  useEffect(() => { localStorage.setItem('ip_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('ip_activities', JSON.stringify(activities)); }, [activities]);

  const addActivity = useCallback((action, entity, entityId, details = '') => {
    setActivities((prev) => [
      { id: generateId(), action, entity, entityId, details, timestamp: new Date().toISOString() },
      ...prev.slice(0, 99),
    ]);
  }, []);

  const syncProductStock = useCallback((productId, movements) => {
    const stock = movements
      .filter((m) => m.productId === productId && m.status !== 'cancelled')
      .reduce((bal, m) => bal + (m.qtyIn || 0) - (m.qtyOut || 0), 0);
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
  }, []);

  const addStockMovement = useCallback((data) => {
    const movement = {
      ...data,
      id: generateId(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setStockMovements((prev) => {
      const updated = [...prev, movement];
      syncProductStock(data.productId, updated);
      return updated;
    });
    return movement;
  }, [syncProductStock]);

  const cancelStockMovement = useCallback((referenceId, referenceType) => {
    setStockMovements((prev) => {
      const updated = prev.map((m) =>
        m.referenceId === referenceId && m.referenceType === referenceType
          ? { ...m, status: 'cancelled' }
          : m
      );
      const affected = prev.filter((m) => m.referenceId === referenceId && m.referenceType === referenceType);
      affected.forEach((m) => syncProductStock(m.productId, updated));
      return updated;
    });
  }, [syncProductStock]);

  const checkStockAvailability = useCallback((items) => {
    if (settings.allowNegativeStock) return { ok: true };
    for (const item of items) {
      if (!item.productId) continue;
      const available = getProductStock(item.productId, products, stockMovements);
      const qty = Number(item.qty) || 0;
      if (qty > available) {
        const product = products.find((p) => p.id === item.productId);
        return { ok: false, product: product?.name || item.product, available, requested: qty };
      }
    }
    return { ok: true };
  }, [products, stockMovements, settings.allowNegativeStock]);

  const refreshInvoiceStatuses = useCallback((invList, payments) =>
    invList.map((inv) => ({
      ...inv,
      paymentStatus: computeInvoiceStatus(inv, payments),
      amountReceived: inv.totals?.grandTotal - getInvoicePending(inv, payments),
      amountPending: getInvoicePending(inv, payments),
    })), []);

  const addCustomer = (data) => {
    const customer = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setCustomers((prev) => [customer, ...prev]);
    addActivity('created', 'customer', customer.id, customer.name);
    return customer;
  };

  const updateCustomer = (id, data) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addActivity('updated', 'customer', id, data.name);
  };

  const deleteCustomer = (id) => {
    const customer = customers.find((c) => c.id === id);
    setDeletedItems((prev) => [...prev, { type: 'customer', data: customer, deletedAt: Date.now() }]);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addActivity('deleted', 'customer', id);
  };

  const addSupplier = (data) => {
    const supplier = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setSuppliers((prev) => [supplier, ...prev]);
    addActivity('created', 'supplier', supplier.id, supplier.name);
    return supplier;
  };

  const updateSupplier = (id, data) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    addActivity('updated', 'supplier', id, data.name);
  };

  const deleteSupplier = (id) => {
    const supplier = suppliers.find((s) => s.id === id);
    setDeletedItems((prev) => [...prev, { type: 'supplier', data: supplier, deletedAt: Date.now() }]);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    addActivity('deleted', 'supplier', id);
  };

  const addProduct = (data) => {
    const product = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setProducts((prev) => [product, ...prev]);
    addActivity('created', 'product', product.id, product.name);
    return product;
  };

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addActivity('updated', 'product', id, data.name);
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setDeletedItems((prev) => [...prev, { type: 'product', data: product, deletedAt: Date.now() }]);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addActivity('deleted', 'product', id);
  };

  const addInvoice = (data) => {
    const invoiceNumber = data.invoiceNumber || getNextInvoiceNumber(invoices, settings.invoicePrefix);
    const isInterState = data.isInterState || false;
    const totals = calculateInvoiceTotals(data.items || [], data.charges || {}, isInterState);
    const status = data.status === 'draft' ? 'draft' : 'confirmed';
    const validItems = (data.items || []).filter((i) => i.productId);

    if (status !== 'draft') {
      const stockCheck = checkStockAvailability(validItems);
      if (!stockCheck.ok) {
        throw new Error(`Insufficient stock for ${stockCheck.product}. Available: ${stockCheck.available}, Requested: ${stockCheck.requested}`);
      }
    }

    const invoice = {
      ...data,
      id: generateId(),
      invoiceNumber,
      totals,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [invoice, ...prev]);

    if (status !== 'draft') {
      validItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        addStockMovement({
          date: invoice.invoiceDate,
          type: 'sale',
          productId: item.productId,
          productName: item.product || product?.name,
          variety: item.variety || product?.variety,
          referenceType: 'invoice',
          referenceId: invoice.id,
          referenceNumber: invoiceNumber,
          qtyIn: 0,
          qtyOut: Number(item.qty) || 0,
          unit: item.unit || product?.unit || 'Kg',
        });
      });
    }
    addActivity('created', 'invoice', invoice.id, invoiceNumber);
    return invoice;
  };

  const updateInvoice = (id, data) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const isInterState = data.isInterState ?? inv.isInterState;
        const items = data.items || inv.items;
        const charges = data.charges || inv.charges;
        const totals = calculateInvoiceTotals(items, charges, isInterState);
        return { ...inv, ...data, totals, updatedAt: new Date().toISOString() };
      })
    );
    addActivity('updated', 'invoice', id);
  };

  const cancelInvoice = (id) => {
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice || invoice.status === 'cancelled') return;
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'cancelled', updatedAt: new Date().toISOString() } : i)));
    if (invoice.status !== 'draft') cancelStockMovement(id, 'invoice');
    addActivity('cancelled', 'invoice', id, invoice.invoiceNumber);
  };

  const deleteInvoice = (id) => {
    cancelInvoice(id);
    const invoice = invoices.find((i) => i.id === id);
    setDeletedItems((prev) => [...prev, { type: 'invoice', data: invoice, deletedAt: Date.now() }]);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    addActivity('deleted', 'invoice', id);
  };

  const duplicateInvoice = (id) => {
    const original = invoices.find((i) => i.id === id);
    if (!original) return null;
    const { id: _id, invoiceNumber: _num, ...rest } = original;
    return addInvoice({ ...rest, status: 'draft', invoiceDate: new Date().toISOString().split('T')[0] });
  };

  const addPurchase = (data) => {
    const amounts = calcPurchaseAmounts(data);
    const purchaseNumber = data.purchaseNumber || getNextPurchaseNumber(purchases);
    const supplierName = data.supplierName || suppliers.find((s) => s.id === data.supplierId)?.name;
    const items = data.items || [];

    // Build a flat summary for backward compat (first item or legacy single-item)
    const firstItem = items[0] || {};
    const product = products.find((p) => p.id === (firstItem.productId || data.productId));

    const purchase = {
      ...data,
      ...amounts,
      id: generateId(),
      purchaseNumber,
      // legacy single-item fields (kept for list display)
      product: items.length === 1 ? (firstItem.product || product?.name) : `${items.length} products`,
      variety: items.length === 1 ? (firstItem.variety || product?.variety) : '',
      unit: items.length === 1 ? (firstItem.unit || product?.unit || 'Kg') : '',
      qty: items.length === 1 ? (Number(firstItem.qty) || 0) : items.reduce((s, i) => s + (Number(i.qty) || 0), 0),
      purchaseRate: items.length === 1 ? (Number(firstItem.purchaseRate) || 0) : 0,
      items,
      supplierName,
      paymentStatus: amounts.amountPending <= 0 ? 'paid' : amounts.amountPaid > 0 ? 'partial' : 'unpaid',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPurchases((prev) => [purchase, ...prev]);

    // Add stock movement for each item
    const itemsToProcess = items.length > 0 ? items : [{
      productId: data.productId,
      product: data.product || product?.name,
      variety: data.variety || product?.variety,
      qty: Number(data.qty) || 0,
      unit: data.unit || product?.unit || 'Kg',
    }];

    itemsToProcess.forEach((item) => {
      if (!item.productId) return;
      const prod = products.find((p) => p.id === item.productId);
      addStockMovement({
        date: purchase.purchaseDate,
        type: 'purchase',
        productId: item.productId,
        productName: item.product || prod?.name,
        variety: item.variety || prod?.variety,
        referenceType: 'purchase',
        referenceId: purchase.id,
        referenceNumber: purchaseNumber,
        qtyIn: Number(item.qty) || 0,
        qtyOut: 0,
        unit: item.unit || prod?.unit || 'Kg',
      });
    });

    if (data.amountPaid > 0) {
      addSupplierPayment({
        supplierId: purchase.supplierId,
        supplierName: purchase.supplierName,
        paymentDate: purchase.purchaseDate,
        amount: Number(data.amountPaid),
        paymentMode: data.paymentMode || 'cash',
        referenceNumber: '',
        notes: `Initial payment for ${purchaseNumber}`,
        allocations: [{ purchaseId: purchase.id, purchaseNumber, amount: Number(data.amountPaid) }],
      }, true);
    }

    addActivity('created', 'purchase', purchase.id, purchaseNumber);
    return purchase;
  };

  const cancelPurchase = (id) => {
    const purchase = purchases.find((p) => p.id === id);
    if (!purchase || purchase.status === 'cancelled') return;
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'cancelled', updatedAt: new Date().toISOString() } : p)));
    cancelStockMovement(id, 'purchase');
    addActivity('cancelled', 'purchase', id, purchase.purchaseNumber);
  };

  const addCustomerPayment = (data, silent = false) => {
    const paymentNumber = data.paymentNumber || getNextPaymentNumber(customerPayments, 'customer');
    const totalAllocated = (data.allocations || []).reduce((s, a) => s + (Number(a.amount) || 0), 0);
    const payment = {
      ...data,
      id: generateId(),
      paymentNumber,
      customerName: data.customerName || customers.find((c) => c.id === data.customerId)?.name,
      amount: Number(data.amount) || 0,
      unallocatedAmount: Math.max(0, (Number(data.amount) || 0) - totalAllocated),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomerPayments((prev) => [payment, ...prev]);
    if (!silent) addActivity('created', 'payment', payment.id, paymentNumber);
    return payment;
  };

  const cancelCustomerPayment = (id) => {
    setCustomerPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cancelled', updatedAt: new Date().toISOString() } : p))
    );
    addActivity('cancelled', 'payment', id);
  };

  const addSupplierPayment = (data, silent = false) => {
    const paymentNumber = data.paymentNumber || getNextPaymentNumber(supplierPayments, 'supplier');
    const totalAllocated = (data.allocations || []).reduce((s, a) => s + (Number(a.amount) || 0), 0);
    const payment = {
      ...data,
      id: generateId(),
      paymentNumber,
      supplierName: data.supplierName || suppliers.find((s) => s.id === data.supplierId)?.name,
      amount: Number(data.amount) || 0,
      unallocatedAmount: Math.max(0, (Number(data.amount) || 0) - totalAllocated),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSupplierPayments((prev) => [payment, ...prev]);
    if (!silent) addActivity('created', 'supplier_payment', payment.id, paymentNumber);
    return payment;
  };

  const cancelSupplierPayment = (id) => {
    setSupplierPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cancelled', updatedAt: new Date().toISOString() } : p))
    );
    addActivity('cancelled', 'supplier_payment', id);
  };

  const adjustStock = (productId, qty, type, notes = '') => {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;
    const isIn = type === 'in';
    return addStockMovement({
      date: new Date().toISOString().split('T')[0],
      type: 'adjustment',
      productId,
      productName: product.name,
      variety: product.variety,
      referenceType: 'adjustment',
      referenceId: generateId(),
      referenceNumber: `ADJ-${Date.now()}`,
      qtyIn: isIn ? Math.abs(qty) : 0,
      qtyOut: isIn ? 0 : Math.abs(qty),
      unit: product.unit,
      notes,
    });
  };

  const addBill = (data) => {
    const bill = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setBills((prev) => [bill, ...prev]);
    addActivity('created', 'bill', bill.id);
    return bill;
  };

  const updateBill = (id, data) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    addActivity('updated', 'bill', id);
  };

  const deleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    addActivity('deleted', 'bill', id);
  };

  const undoDelete = () => {
    const last = deletedItems[deletedItems.length - 1];
    if (!last) return;
    const { type, data } = last;
    if (type === 'customer') setCustomers((prev) => [data, ...prev]);
    if (type === 'supplier') setSuppliers((prev) => [data, ...prev]);
    if (type === 'product') setProducts((prev) => [data, ...prev]);
    if (type === 'invoice') setInvoices((prev) => [data, ...prev]);
    setDeletedItems((prev) => prev.slice(0, -1));
    addActivity('restored', type, data.id);
  };

  const getDashboardStats = () => {
    const business = getDashboardBusinessStats(customers, suppliers, invoices, purchases, customerPayments, supplierPayments, products, stockMovements);
    const enrichedInvoices = refreshInvoiceStatuses(invoices, customerPayments);
    return {
      ...business,
      totalInvoices: invoices.filter((i) => i.status !== 'cancelled').length,
      pendingInvoices: enrichedInvoices.filter((i) => ['confirmed', 'partial', 'overdue'].includes(i.paymentStatus)).length,
      paidInvoices: enrichedInvoices.filter((i) => i.paymentStatus === 'paid').length,
      monthlyRevenue: business.totalSales,
      gstCollected: invoices.reduce((s, i) => s + (i.totals?.totalGst || 0), 0),
    };
  };

  const value = {
    customers, suppliers, products, invoices, bills, purchases,
    customerPayments, supplierPayments, stockMovements,
    settings, activities, deletedItems,
    addCustomer, updateCustomer, deleteCustomer,
    addSupplier, updateSupplier, deleteSupplier,
    addProduct, updateProduct, deleteProduct,
    addInvoice, updateInvoice, deleteInvoice, duplicateInvoice, cancelInvoice,
    addPurchase, cancelPurchase,
    addCustomerPayment, cancelCustomerPayment,
    addSupplierPayment, cancelSupplierPayment,
    addStockMovement, adjustStock, checkStockAvailability,
    addBill, updateBill, deleteBill,
    setSettings, undoDelete, getDashboardStats, addActivity,
    getCustomerSummary: (id) => getCustomerSummary(id, invoices, customerPayments),
    getSupplierSummary: (id) => getSupplierSummary(id, purchases, supplierPayments),
    getCustomerLedger: (id) => buildCustomerLedger(id, invoices, customerPayments),
    getSupplierLedger: (id) => buildSupplierLedger(id, purchases, supplierPayments),
    getStockLedger: (id) => buildStockLedger(id, stockMovements),
    getProductStock: (id) => getProductStock(id, products, stockMovements),
    getOutstandingCustomers: () => getOutstandingCustomers(customers, invoices, customerPayments),
    getOutstandingSuppliers: () => getOutstandingSuppliers(suppliers, purchases, supplierPayments),
    getCustomerProductHistory: (id) => getCustomerProductHistory(id, invoices),
    getSupplierProductHistory: (id) => getSupplierProductHistory(id, purchases),
    getInvoicePending: (inv) => getInvoicePending(inv, customerPayments),
    getPurchasePending: (pur) => getPurchasePending(pur, supplierPayments),
    computeInvoiceStatus: (inv) => computeInvoiceStatus(inv, customerPayments),
    computePurchaseStatus: (pur) => computePurchaseStatus(pur, supplierPayments),
    getCustomerAgingSummary: (id) => getCustomerAgingSummary(id, invoices, customerPayments),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
