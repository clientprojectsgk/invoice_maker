import dayjs from 'dayjs';

const ACTIVE = (s) => s !== 'cancelled' && s !== 'draft';

export const getAgingBucket = (date) => {
  const days = dayjs().diff(dayjs(date), 'day');
  if (days <= 7) return '0-7 Days';
  if (days <= 15) return '8-15 Days';
  if (days <= 30) return '16-30 Days';
  if (days <= 60) return '31-60 Days';
  return '60+ Days';
};

export const getCustomerAgingSummary = (customerId, invoices, payments) => {
  const buckets = { '0-7 Days': 0, '8-15 Days': 0, '16-30 Days': 0, '31-60 Days': 0, '60+ Days': 0 };
  invoices
    .filter((i) => i.customerId === customerId && ACTIVE(i.status))
    .forEach((inv) => {
      const pending = getInvoicePending(inv, payments);
      if (pending > 0) buckets[getAgingBucket(inv.invoiceDate)] += pending;
    });
  return buckets;
};

export const computeInvoicePayments = (invoiceId, payments) => {
  const received = payments
    .filter((p) => p.status !== 'cancelled')
    .reduce((sum, p) => {
      const alloc = (p.allocations || []).find((a) => a.invoiceId === invoiceId);
      return sum + (alloc?.amount || 0);
    }, 0);
  return received;
};

export const computeInvoiceStatus = (invoice, payments) => {
  if (invoice.status === 'cancelled') return 'cancelled';
  if (invoice.status === 'draft') return 'draft';
  const total = invoice.totals?.grandTotal || 0;
  const received = computeInvoicePayments(invoice.id, payments);
  if (received <= 0) {
    if (invoice.dueDate && dayjs(invoice.dueDate).isBefore(dayjs(), 'day')) return 'overdue';
    return 'confirmed';
  }
  if (received >= total) return 'paid';
  return 'partial';
};

export const getInvoicePending = (invoice, payments) => {
  if (invoice.status === 'cancelled' || invoice.status === 'draft') return 0;
  const total = invoice.totals?.grandTotal || 0;
  const received = computeInvoicePayments(invoice.id, payments);
  return Math.max(0, total - received);
};

export const computePurchasePayments = (purchaseId, payments) =>
  payments
    .filter((p) => p.status !== 'cancelled')
    .reduce((sum, p) => {
      const alloc = (p.allocations || []).find((a) => a.purchaseId === purchaseId);
      return sum + (alloc?.amount || 0);
    }, 0);

export const computePurchaseStatus = (purchase, payments) => {
  if (purchase.status === 'cancelled') return 'cancelled';
  const total = purchase.finalAmount || 0;
  const paid = computePurchasePayments(purchase.id, payments);
  if (paid <= 0) return 'unpaid';
  if (paid >= total) return 'paid';
  return 'partial';
};

export const getPurchasePending = (purchase, payments) => {
  if (purchase.status === 'cancelled') return 0;
  const total = purchase.finalAmount || 0;
  const paid = computePurchasePayments(purchase.id, payments);
  return Math.max(0, total - paid);
};

export const getCustomerSummary = (customerId, invoices, payments) => {
  const custInvoices = invoices.filter(
    (i) => i.customerId === customerId && ACTIVE(i.status) && i.status !== 'draft'
  );
  const totalSales = custInvoices.reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
  const custPayments = payments.filter(
    (p) => p.customerId === customerId && p.status !== 'cancelled'
  );
  const totalReceived = custPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const totalOutstanding = Math.max(0, totalSales - totalReceived);
  const lastPayment = custPayments.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))[0];
  const lastSale = custInvoices.sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate))[0];
  return { totalSales, totalReceived, totalOutstanding, lastPayment, lastSale, invoiceCount: custInvoices.length };
};

export const getSupplierSummary = (supplierId, purchases, payments) => {
  const supPurchases = purchases.filter((p) => p.supplierId === supplierId && p.status !== 'cancelled');
  const totalPurchase = supPurchases.reduce((s, p) => s + (p.finalAmount || 0), 0);
  const supPayments = payments.filter((p) => p.supplierId === supplierId && p.status !== 'cancelled');
  const totalPaid = supPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = Math.max(0, totalPurchase - totalPaid);
  const lastPayment = supPayments.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))[0];
  const lastPurchase = supPurchases.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))[0];
  return { totalPurchase, totalPaid, totalPending, lastPayment, lastPurchase, purchaseCount: supPurchases.length };
};

export const buildCustomerLedger = (customerId, invoices, payments) => {
  const entries = [];
  invoices
    .filter((i) => i.customerId === customerId && i.status !== 'draft' && i.status !== 'cancelled')
    .forEach((inv) => {
      entries.push({
        date: inv.invoiceDate,
        reference: inv.invoiceNumber,
        description: 'Invoice / Sale',
        debit: inv.totals?.grandTotal || 0,
        credit: 0,
        type: 'invoice',
        id: inv.id,
      });
    });
  payments
    .filter((p) => p.customerId === customerId && p.status !== 'cancelled')
    .forEach((pay) => {
      entries.push({
        date: pay.paymentDate,
        reference: pay.paymentNumber,
        description: pay.unallocatedAmount > 0 && !(pay.allocations?.length)
          ? 'Advance Payment'
          : 'Payment Received',
        debit: 0,
        credit: pay.amount || 0,
        type: 'payment',
        id: pay.id,
      });
    });
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.reference.localeCompare(b.reference));
  let balance = 0;
  return entries.map((e) => {
    balance += e.debit - e.credit;
    return { ...e, balance };
  });
};

export const buildSupplierLedger = (supplierId, purchases, payments) => {
  const entries = [];
  purchases
    .filter((p) => p.supplierId === supplierId && p.status !== 'cancelled')
    .forEach((pur) => {
      entries.push({
        date: pur.purchaseDate,
        reference: pur.purchaseNumber,
        description: 'Purchase',
        debit: 0,
        credit: pur.finalAmount || 0,
        type: 'purchase',
        id: pur.id,
      });
    });
  payments
    .filter((p) => p.supplierId === supplierId && p.status !== 'cancelled')
    .forEach((pay) => {
      entries.push({
        date: pay.paymentDate,
        reference: pay.paymentNumber,
        description: 'Payment Made',
        debit: pay.amount || 0,
        credit: 0,
        type: 'payment',
        id: pay.id,
      });
    });
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.reference.localeCompare(b.reference));
  let balance = 0;
  return entries.map((e) => {
    balance += e.credit - e.debit;
    return { ...e, balance };
  });
};

export const getProductStock = (productId, products, stockMovements) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return 0;
  const fromMovements = stockMovements
    .filter((m) => m.productId === productId && m.status !== 'cancelled')
    .reduce((bal, m) => bal + (m.qtyIn || 0) - (m.qtyOut || 0), 0);
  return fromMovements || product.stock || 0;
};

export const buildStockLedger = (productId, stockMovements) => {
  const movements = stockMovements
    .filter((m) => m.productId === productId && m.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt?.localeCompare(b.createdAt));
  let balance = 0;
  return movements.map((m) => {
    balance += (m.qtyIn || 0) - (m.qtyOut || 0);
    return { ...m, balance };
  });
};

export const getCustomerProductHistory = (customerId, invoices) => {
  const map = {};
  invoices
    .filter((i) => i.customerId === customerId && i.status !== 'cancelled' && i.status !== 'draft')
    .forEach((inv) => {
      (inv.items || []).forEach((item) => {
        const key = item.productId || item.product;
        if (!map[key]) map[key] = { product: item.product, unit: item.unit, qty: 0, sales: 0 };
        map[key].qty += Number(item.qty) || 0;
        const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0) * (1 - (Number(item.discount) || 0) / 100);
        map[key].sales += lineTotal;
      });
    });
  return Object.values(map);
};

export const getSupplierProductHistory = (supplierId, purchases) => {
  const map = {};
  purchases
    .filter((p) => p.supplierId === supplierId && p.status !== 'cancelled')
    .forEach((pur) => {
      const key = pur.productId || pur.product;
      if (!map[key]) map[key] = { product: pur.product, variety: pur.variety, unit: pur.unit, qty: 0, amount: 0 };
      map[key].qty += Number(pur.qty) || 0;
      map[key].amount += pur.totalAmount || 0;
    });
  return Object.values(map);
};

export const getOutstandingCustomers = (customers, invoices, payments) =>
  customers.map((c) => {
    const summary = getCustomerSummary(c.id, invoices, payments);
    const pendingInvoices = invoices.filter(
      (i) => i.customerId === c.id && getInvoicePending(i, payments) > 0 && i.status !== 'cancelled' && i.status !== 'draft'
    );
    const oldestDue = pendingInvoices.length
      ? pendingInvoices.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0].dueDate
      : null;
    const oldestDays = oldestDue ? dayjs().diff(dayjs(oldestDue), 'day') : 0;
    let paymentFilter = 'paid';
    if (summary.totalOutstanding > 0) {
      paymentFilter = oldestDays > 0 ? 'overdue' : summary.totalReceived > 0 ? 'partial' : 'pending';
    }
    return {
      ...c,
      ...summary,
      oldestDue,
      oldestDays,
      paymentFilter,
      pendingInvoiceCount: pendingInvoices.length,
    };
  }).filter((c) => c.totalSales > 0 || c.totalReceived > 0);

export const getOutstandingSuppliers = (suppliers, purchases, payments) =>
  suppliers.map((s) => {
    const summary = getSupplierSummary(s.id, purchases, payments);
    const pendingPurchases = purchases.filter(
      (p) => p.supplierId === s.id && getPurchasePending(p, payments) > 0 && p.status !== 'cancelled'
    );
    const oldestDue = pendingPurchases.length
      ? pendingPurchases.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))[0].purchaseDate
      : null;
    return { ...s, ...summary, oldestDue, pendingPurchaseCount: pendingPurchases.length };
  }).filter((s) => s.totalPurchase > 0 || s.totalPaid > 0);

export const getDashboardBusinessStats = (customers, suppliers, invoices, purchases, customerPayments, supplierPayments, products, stockMovements) => {
  const today = dayjs().format('YYYY-MM-DD');
  const activeInvoices = invoices.filter((i) => i.status !== 'cancelled' && i.status !== 'draft');
  const activePurchases = purchases.filter((p) => p.status !== 'cancelled');
  const activeCustPay = customerPayments.filter((p) => p.status !== 'cancelled');
  const activeSupPay = supplierPayments.filter((p) => p.status !== 'cancelled');

  const todayPurchases = activePurchases
    .filter((p) => p.purchaseDate === today)
    .reduce((s, p) => s + (p.finalAmount || 0), 0);
  const todaySales = activeInvoices
    .filter((i) => i.invoiceDate === today)
    .reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
  const todayPaymentsReceived = activeCustPay
    .filter((p) => p.paymentDate === today)
    .reduce((s, p) => s + (p.amount || 0), 0);
  const todaySupplierPayments = activeSupPay
    .filter((p) => p.paymentDate === today)
    .reduce((s, p) => s + (p.amount || 0), 0);

  const totalSales = activeInvoices.reduce((s, i) => s + (i.totals?.grandTotal || 0), 0);
  const totalPurchases = activePurchases.reduce((s, p) => s + (p.finalAmount || 0), 0);
  const totalReceived = activeCustPay.reduce((s, p) => s + (p.amount || 0), 0);
  const totalSupplierPaid = activeSupPay.reduce((s, p) => s + (p.amount || 0), 0);
  const totalReceivables = Math.max(0, totalSales - totalReceived);
  const totalPayables = Math.max(0, totalPurchases - totalSupplierPaid);

  const lowStock = products.filter((p) => {
    const stock = getProductStock(p.id, products, stockMovements);
    return stock <= (p.minStock || 0) && stock > 0;
  });
  const outOfStock = products.filter((p) => getProductStock(p.id, products, stockMovements) <= 0);

  const overdueCustomers = getOutstandingCustomers(customers, invoices, customerPayments)
    .filter((c) => c.paymentFilter === 'overdue');

  return {
    todayPurchases, todaySales, todayPaymentsReceived, todaySupplierPayments,
    totalSales, totalPurchases, totalReceivables, totalPayables,
    totalReceived, totalSupplierPaid,
    lowStockCount: lowStock.length, outOfStockCount: outOfStock.length,
    lowStock, outOfStock, overdueCustomers,
    partialInvoices: activeInvoices.filter((i) => computeInvoiceStatus(i, customerPayments) === 'partial').length,
  };
};

export const calcPurchaseAmounts = (data) => {
  const items = data.items || [];
  let totalAmount = 0;
  if (items.length > 0) {
    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.purchaseRate) || 0;
      const gross = qty * rate;
      const discount = Number(item.discount) || 0;
      const otherCharges = Number(item.otherCharges) || 0;
      totalAmount += gross - discount + otherCharges;
    });
  } else {
    const qty = Number(data.qty) || 0;
    const rate = Number(data.purchaseRate) || 0;
    totalAmount = qty * rate;
  }
  const transport = Number(data.transportationCost) || 0;
  const other = Number(data.otherExpenses) || 0;
  const finalAmount = totalAmount + transport + other;
  const paid = Number(data.amountPaid) || 0;
  const pending = Math.max(0, finalAmount - paid);
  return { totalAmount, finalAmount, amountPending: pending };
};
