import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/formatters';
import { getNextInvoiceNumber } from '../utils/invoiceNumber';
import { calculateInvoiceTotals } from '../utils/gstCalculator';
import { initialCustomers, initialSuppliers, initialProducts, initialInvoices, initialBills, defaultSettings } from '../data/mockData';

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
  useEffect(() => { localStorage.setItem('ip_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('ip_activities', JSON.stringify(activities)); }, [activities]);

  const addActivity = useCallback((action, entity, entityId, details = '') => {
    setActivities((prev) => [
      { id: generateId(), action, entity, entityId, details, timestamp: new Date().toISOString() },
      ...prev.slice(0, 49),
    ]);
  }, []);

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
    const invoice = {
      ...data,
      id: generateId(),
      invoiceNumber,
      totals,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [invoice, ...prev]);
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

  const deleteInvoice = (id) => {
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
    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const pendingInvoices = invoices.filter((i) => ['sent', 'partial', 'overdue'].includes(i.status));
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const totalSales = paidInvoices.reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
    const totalPurchase = bills.reduce((s, b) => s + (b.amount || 0), 0);
    const todaySales = invoices
      .filter((i) => i.invoiceDate === today)
      .reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
    const monthlyRevenue = invoices
      .filter((i) => {
        const d = new Date(i.invoiceDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
    const gstCollected = invoices.reduce((s, i) => s + (i.totals?.totalGst || 0), 0);

    return {
      totalSales,
      totalPurchase,
      totalInvoices: invoices.length,
      paidBills: paidInvoices.length,
      pendingBills: pendingInvoices.length,
      todaySales,
      monthlyRevenue,
      gstCollected,
    };
  };

  const value = {
    customers, suppliers, products, invoices, bills, settings, activities, deletedItems,
    addCustomer, updateCustomer, deleteCustomer,
    addSupplier, updateSupplier, deleteSupplier,
    addProduct, updateProduct, deleteProduct,
    addInvoice, updateInvoice, deleteInvoice, duplicateInvoice,
    addBill, updateBill, deleteBill,
    setSettings, undoDelete, getDashboardStats, addActivity,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
