import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getAccessToken } from '../services/apiClient';
import {
  loadAppData,
  customersApi, suppliersApi, productsApi, invoicesApi, purchasesApi,
  customerPaymentsApi, supplierPaymentsApi, stockApi, laboursApi, billsApi,
  settingsApi, dashboardApi,
} from '../services/api';
import { defaultSettings } from '../data/mockData';
import {
  computeInvoiceStatus, computePurchaseStatus,
  getCustomerSummary, getSupplierSummary, buildCustomerLedger, buildSupplierLedger,
  buildStockLedger, getProductStock, getOutstandingCustomers, getOutstandingSuppliers,
  getCustomerProductHistory, getSupplierProductHistory,
  getInvoicePending, getPurchasePending, getCustomerAgingSummary,
} from '../utils/businessLogic';

const AppContext = createContext(null);

const mapInvoicePayload = (data) => {
  const { totals, id, createdAt, updatedAt, invoiceNumber, ...rest } = data;
  const status = rest.status === 'sent' ? 'confirmed' : (rest.status || 'confirmed');
  const items = (rest.items || [])
    .filter((i) => i.productId || i.product)
    .map(({ id: _id, ...item }) => item);
  return { ...rest, status, items };
};

const mapPurchasePayload = (data) => {
  const { id, purchaseNumber, totalAmount, finalAmount, amountPending, paymentStatus, status, createdAt, updatedAt, ...rest } = data;
  const items = (rest.items || []).map(({ id: _id, grade, ...item }) => item);
  return { ...rest, items };
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customerPayments, setCustomerPayments] = useState([]);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [labours, setLabours] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [labourPayments, setLabourPayments] = useState([]);
  const [settings, setSettingsState] = useState(defaultSettings);
  const [activities, setActivities] = useState([]);
  const [dashboardStatsCache, setDashboardStatsCache] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refreshAll = useCallback(async () => {
    if (!getAccessToken()) return;
    setLoading(true);
    try {
      const data = await loadAppData();
      setCustomers(data.customers || []);
      setSuppliers(data.suppliers || []);
      setProducts(data.products || []);
      setInvoices(data.invoices || []);
      setBills(data.bills || []);
      setPurchases(data.purchases || []);
      setCustomerPayments(data.customerPayments || []);
      setSupplierPayments(data.supplierPayments || []);
      setStockMovements(data.stockMovements || []);
      setLabours(data.labours || []);
      setSettingsState(data.settings?.id ? data.settings : defaultSettings);
      setActivities(data.activities || []);
      try {
        const stats = await dashboardApi.stats();
        setDashboardStatsCache(stats);
      } catch { /* optional */ }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (user && getAccessToken()) refreshAll();
    else if (!user) {
      setCustomers([]);
      setSuppliers([]);
      setProducts([]);
      setInvoices([]);
      setBills([]);
      setPurchases([]);
      setCustomerPayments([]);
      setSupplierPayments([]);
      setStockMovements([]);
      setLabours([]);
      setAttendances([]);
      setLabourPayments([]);
      setActivities([]);
      setDashboardStatsCache(null);
      setInitialized(false);
    }
  }, [user, refreshAll]);

  const refreshProducts = async () => {
    const list = await productsApi.list();
    setProducts(list || []);
    return list;
  };

  const refreshStockMovements = async () => {
    const list = await stockApi.listMovements();
    setStockMovements(list || []);
    return list;
  };

  // ─── Customers ─────────────────────────────────────────────────────────────
  const addCustomer = async (data) => {
    const customer = await customersApi.create(data);
    setCustomers((prev) => [customer, ...prev]);
    return customer;
  };

  const updateCustomer = async (id, data) => {
    const customer = await customersApi.update(id, data);
    setCustomers((prev) => prev.map((c) => (c.id === id ? customer : c)));
    return customer;
  };

  const deleteCustomer = async (id) => {
    await customersApi.delete(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // ─── Suppliers ─────────────────────────────────────────────────────────────
  const addSupplier = async (data) => {
    const supplier = await suppliersApi.create(data);
    setSuppliers((prev) => [supplier, ...prev]);
    return supplier;
  };

  const updateSupplier = async (id, data) => {
    const supplier = await suppliersApi.update(id, data);
    setSuppliers((prev) => prev.map((s) => (s.id === id ? supplier : s)));
    return supplier;
  };

  const deleteSupplier = async (id) => {
    await suppliersApi.delete(id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── Products ────────────────────────────────────────────────────────────────
  const addProduct = async (data) => {
    const product = await productsApi.create(data);
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (id, data) => {
    const product = await productsApi.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    return product;
  };

  const deleteProduct = async (id) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ─── Invoices ──────────────────────────────────────────────────────────────
  const addInvoice = async (data) => {
    const payload = mapInvoicePayload(data);
    const invoice = await invoicesApi.create(payload);
    setInvoices((prev) => [invoice, ...prev]);
    await refreshProducts();
    await refreshStockMovements();
    return invoice;
  };

  const updateInvoice = async (id, data) => {
    const payload = mapInvoicePayload({ ...data, status: data.status });
    const invoice = await invoicesApi.update(id, payload);
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? invoice : inv)));
    await refreshProducts();
    await refreshStockMovements();
    return invoice;
  };

  const cancelInvoice = async (id) => {
    const invoice = await invoicesApi.cancel(id);
    setInvoices((prev) => prev.map((i) => (i.id === id ? invoice : i)));
    await refreshProducts();
    await refreshStockMovements();
    return invoice;
  };

  const deleteInvoice = async (id) => {
    await invoicesApi.delete(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    await refreshProducts();
    await refreshStockMovements();
  };

  const duplicateInvoice = async (id) => {
    const invoice = await invoicesApi.duplicate(id);
    setInvoices((prev) => [invoice, ...prev]);
    return invoice;
  };

  // ─── Purchases ─────────────────────────────────────────────────────────────
  const addPurchase = async (data) => {
    const payload = mapPurchasePayload(data);
    const purchase = await purchasesApi.create(payload);
    setPurchases((prev) => [purchase, ...prev]);
    const supplierPayList = await supplierPaymentsApi.list();
    setSupplierPayments(supplierPayList || []);
    await refreshProducts();
    await refreshStockMovements();
    return purchase;
  };

  const cancelPurchase = async (id) => {
    const purchase = await purchasesApi.cancel(id);
    setPurchases((prev) => prev.map((p) => (p.id === id ? purchase : p)));
    await refreshProducts();
    await refreshStockMovements();
    return purchase;
  };

  // ─── Payments ──────────────────────────────────────────────────────────────
  const addCustomerPayment = async (data) => {
    const payment = await customerPaymentsApi.create(data);
    setCustomerPayments((prev) => [payment, ...prev]);
    const invList = await invoicesApi.list();
    setInvoices(invList || []);
    return payment;
  };

  const cancelCustomerPayment = async (id) => {
    const payment = await customerPaymentsApi.cancel(id);
    setCustomerPayments((prev) => prev.map((p) => (p.id === id ? payment : p)));
    const invList = await invoicesApi.list();
    setInvoices(invList || []);
    return payment;
  };

  const addSupplierPayment = async (data) => {
    const payment = await supplierPaymentsApi.create(data);
    setSupplierPayments((prev) => [payment, ...prev]);
    const purList = await purchasesApi.list();
    setPurchases(purList || []);
    return payment;
  };

  const cancelSupplierPayment = async (id) => {
    const payment = await supplierPaymentsApi.cancel(id);
    setSupplierPayments((prev) => prev.map((p) => (p.id === id ? payment : p)));
    const purList = await purchasesApi.list();
    setPurchases(purList || []);
    return payment;
  };

  // ─── Stock ─────────────────────────────────────────────────────────────────
  const checkStockAvailability = useCallback((items) => {
    if (settings.allowNegativeStock) return { ok: true };
    for (const item of items) {
      if (!item.productId) continue;
      const product = products.find((p) => p.id === item.productId);
      const available = product?.stock ?? 0;
      const qty = Number(item.qty) || 0;
      if (qty > available) {
        return { ok: false, product: product?.name || item.product, available, requested: qty };
      }
    }
    return { ok: true };
  }, [products, settings.allowNegativeStock]);

  const adjustStock = async (productId, qty, type, notes = '') => {
    const product = await productsApi.adjustStock(productId, {
      qty: Math.abs(qty),
      type,
      notes,
    });
    setProducts((prev) => prev.map((p) => (p.id === productId ? product : p)));
    await refreshStockMovements();
    return product;
  };

  // ─── Labour ────────────────────────────────────────────────────────────────
  const addLabour = async (data) => {
    const labour = await laboursApi.create(data);
    setLabours((prev) => [labour, ...prev]);
    return labour;
  };

  const updateLabour = async (id, data) => {
    const labour = await laboursApi.update(id, data);
    setLabours((prev) => prev.map((l) => (l.id === id ? labour : l)));
    return labour;
  };

  const deleteLabour = async (id) => {
    await laboursApi.delete(id);
    setLabours((prev) => prev.filter((l) => l.id !== id));
  };

  const markAttendance = async (labourId, date, status, overtimeHours = 0, notes = '') => {
    const record = await laboursApi.markAttendance({ labourId, date, status, overtimeHours, notes });
    setAttendances((prev) => {
      const idx = prev.findIndex((a) => a.labourId === labourId && a.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = record;
        return updated;
      }
      return [...prev, record];
    });
    return record;
  };

  const deleteAttendance = async (labourId, date) => {
    await laboursApi.deleteAttendance(labourId, date);
    setAttendances((prev) => prev.filter((a) => !(a.labourId === labourId && a.date === date)));
  };

  const addLabourPayment = async (data) => {
    const payment = await laboursApi.addPayment(data);
    setLabourPayments((prev) => [payment, ...prev]);
    return payment;
  };

  const deleteLabourPayment = async (id) => {
    await laboursApi.deletePayment(id);
    setLabourPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const getLabourEarnings = useCallback(async (labourId, dateFrom, dateTo) => {
    try {
      return await laboursApi.earnings(labourId, { dateFrom, dateTo });
    } catch {
      return { presentDays: 0, halfDays: 0, overtimeHours: 0, earned: 0, paid: 0, balance: 0, totalDays: 0 };
    }
  }, []);

  // ─── Bills ─────────────────────────────────────────────────────────────────
  const addBill = async (data) => {
    const bill = await billsApi.create(data);
    setBills((prev) => [bill, ...prev]);
    return bill;
  };

  const updateBill = async (id, data) => {
    const bill = await billsApi.update(id, data);
    setBills((prev) => prev.map((b) => (b.id === id ? bill : b)));
    return bill;
  };

  const deleteBill = async (id) => {
    await billsApi.delete(id);
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  // ─── Settings ──────────────────────────────────────────────────────────────
  const setSettings = async (data) => {
    const updated = await settingsApi.update(data);
    setSettingsState(updated);
    return updated;
  };

  // ─── Dashboard & computed helpers ──────────────────────────────────────────
  const getDashboardStats = useCallback(() => {
    if (dashboardStatsCache) return dashboardStatsCache;
    const enrichedInvoices = invoices.map((inv) => ({
      ...inv,
      paymentStatus: computeInvoiceStatus(inv, customerPayments),
    }));
    return {
      todayPurchases: 0, todaySales: 0, todayPaymentsReceived: 0, todaySupplierPayments: 0,
      totalSales: 0, totalPurchases: 0, totalReceivables: 0, totalPayables: 0,
      totalReceived: 0, totalSupplierPaid: 0, lowStockCount: 0, outOfStockCount: 0,
      totalInvoices: invoices.filter((i) => i.status !== 'cancelled').length,
      pendingInvoices: enrichedInvoices.filter((i) => ['confirmed', 'partial', 'overdue'].includes(i.paymentStatus)).length,
      paidInvoices: enrichedInvoices.filter((i) => i.paymentStatus === 'paid').length,
      monthlyRevenue: 0, gstCollected: 0, partialInvoices: 0,
    };
  }, [dashboardStatsCache, invoices, customerPayments]);

  const value = {
    customers, suppliers, products, invoices, bills, purchases,
    customerPayments, supplierPayments, stockMovements,
    labours, attendances, labourPayments,
    settings, activities,
    loading, initialized, refreshAll,
    addCustomer, updateCustomer, deleteCustomer,
    addSupplier, updateSupplier, deleteSupplier,
    addProduct, updateProduct, deleteProduct,
    addInvoice, updateInvoice, deleteInvoice, duplicateInvoice, cancelInvoice,
    addPurchase, cancelPurchase,
    addCustomerPayment, cancelCustomerPayment,
    addSupplierPayment, cancelSupplierPayment,
    adjustStock, checkStockAvailability,
    addBill, updateBill, deleteBill,
    addLabour, updateLabour, deleteLabour,
    markAttendance, deleteAttendance,
    addLabourPayment, deleteLabourPayment, getLabourEarnings,
    setSettings, getDashboardStats,
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
