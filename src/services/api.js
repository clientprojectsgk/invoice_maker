import { api } from './apiClient';
import { ENDPOINTS as E } from './endpoints';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) => api.post(E.auth.login, { email, password }, { auth: false }),
  refresh: (refreshToken) => api.post(E.auth.refresh, { refreshToken }, { auth: false }),
  register: (data) => api.post(E.auth.register, data, { auth: false }),
  verifyOtp: (email, otp) => api.post(E.auth.verifyOtp, undefined, { auth: false, params: { email, otp } }),
  forgotPassword: (email) => api.post(E.auth.forgotPassword, { email }, { auth: false }),
  resetPassword: (data) => api.post(E.auth.resetPassword, data, { auth: false }),
  changePassword: (data) => api.post(E.auth.changePassword, data),
  me: () => api.get(E.auth.me),
  permissions: () => api.get(E.auth.permissions),
  logout: () => api.post(E.auth.logout),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
  list: () => api.get(E.users.list),
  create: (data) => api.post(E.users.create, data),
  get: (id) => api.get(E.users.get(id)),
  update: (id, data) => api.patch(E.users.update(id), data),
  delete: (id) => api.delete(E.users.delete(id)),
  assignRole: (id, roleId) => api.patch(E.users.assignRole(id), { roleId }),
};

// ─── Roles & Modules ─────────────────────────────────────────────────────────
export const modulesApi = {
  list: () => api.get(E.modules.list),
  create: (data) => api.post(E.modules.create, data),
  update: (id, data) => api.patch(E.modules.update(id), data),
  delete: (id) => api.delete(E.modules.delete(id)),
};

export const rolesApi = {
  list: () => api.get(E.roles.list),
  create: (data) => api.post(E.roles.create, data),
  get: (id) => api.get(E.roles.get(id)),
  update: (id, data) => api.patch(E.roles.update(id), data),
  delete: (id) => api.delete(E.roles.delete(id)),
  getPermissions: (id) => api.get(E.roles.permissions(id)),
  setPermissions: (id, modules) => api.put(E.roles.permissions(id), { modules }),
};

// ─── Customers ───────────────────────────────────────────────────────────────
export const customersApi = {
  list: (search) => api.get(E.customers.list, { params: { search } }),
  outstanding: () => api.get(E.customers.outstanding),
  create: (data) => api.post(E.customers.create, data),
  get: (id) => api.get(E.customers.get(id)),
  update: (id, data) => api.patch(E.customers.update(id), data),
  delete: (id) => api.delete(E.customers.delete(id)),
  summary: (id) => api.get(E.customers.summary(id)),
  ledger: (id) => api.get(E.customers.ledger(id)),
  aging: (id) => api.get(E.customers.aging(id)),
};

// ─── Suppliers ───────────────────────────────────────────────────────────────
export const suppliersApi = {
  list: (search) => api.get(E.suppliers.list, { params: { search } }),
  outstanding: () => api.get(E.suppliers.outstanding),
  create: (data) => api.post(E.suppliers.create, data),
  get: (id) => api.get(E.suppliers.get(id)),
  update: (id, data) => api.patch(E.suppliers.update(id), data),
  delete: (id) => api.delete(E.suppliers.delete(id)),
  summary: (id) => api.get(E.suppliers.summary(id)),
  ledger: (id) => api.get(E.suppliers.ledger(id)),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params) => api.get(E.products.list, { params }),
  create: (data) => api.post(E.products.create, data),
  get: (id) => api.get(E.products.get(id)),
  update: (id, data) => api.patch(E.products.update(id), data),
  delete: (id) => api.delete(E.products.delete(id)),
  stockLedger: (id) => api.get(E.products.stockLedger(id)),
  adjustStock: (id, data) => api.post(E.products.adjustStock(id), data),
};

// ─── Invoices ────────────────────────────────────────────────────────────────
export const invoicesApi = {
  list: (params) => api.get(E.invoices.list, { params }),
  create: (data) => api.post(E.invoices.create, data),
  get: (id) => api.get(E.invoices.get(id)),
  update: (id, data) => api.patch(E.invoices.update(id), data),
  delete: (id) => api.delete(E.invoices.delete(id)),
  cancel: (id) => api.post(E.invoices.cancel(id)),
  duplicate: (id) => api.post(E.invoices.duplicate(id)),
};

// ─── Purchases ───────────────────────────────────────────────────────────────
export const purchasesApi = {
  list: (params) => api.get(E.purchases.list, { params }),
  create: (data) => api.post(E.purchases.create, data),
  get: (id) => api.get(E.purchases.get(id)),
  cancel: (id) => api.post(E.purchases.cancel(id)),
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const customerPaymentsApi = {
  list: (params) => api.get(E.customerPayments.list, { params }),
  create: (data) => api.post(E.customerPayments.create, data),
  get: (id) => api.get(E.customerPayments.get(id)),
  cancel: (id) => api.post(E.customerPayments.cancel(id)),
};

export const supplierPaymentsApi = {
  list: (params) => api.get(E.supplierPayments.list, { params }),
  create: (data) => api.post(E.supplierPayments.create, data),
  get: (id) => api.get(E.supplierPayments.get(id)),
  cancel: (id) => api.post(E.supplierPayments.cancel(id)),
};

// ─── Stock ───────────────────────────────────────────────────────────────────
export const stockApi = {
  listMovements: (params) => api.get(E.stockMovements.list, { params }),
};

// ─── Labour ──────────────────────────────────────────────────────────────────
export const laboursApi = {
  list: () => api.get(E.labours.list),
  create: (data) => api.post(E.labours.create, data),
  get: (id) => api.get(E.labours.get(id)),
  update: (id, data) => api.patch(E.labours.update(id), data),
  delete: (id) => api.delete(E.labours.delete(id)),
  earnings: (id, params) => api.get(E.labours.earnings(id), { params }),
  markAttendance: (data) => api.post(E.labours.attendance, data),
  deleteAttendance: (labourId, date) => api.delete(E.labours.attendance, { params: { labour_id: labourId, date }, transform: false }),
  addPayment: (data) => api.post(E.labours.payments, data),
  deletePayment: (id) => api.delete(E.labours.deletePayment(id)),
};

// ─── Bills ───────────────────────────────────────────────────────────────────
export const billsApi = {
  list: (params) => api.get(E.bills.list, { params }),
  create: (data) => api.post(E.bills.create, data),
  get: (id) => api.get(E.bills.get(id)),
  update: (id, data) => api.patch(E.bills.update(id), data),
  delete: (id) => api.delete(E.bills.delete(id)),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get(E.settings.get),
  update: (data) => api.put(E.settings.update, data),
};

// ─── Dashboard & Reports ─────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get(E.dashboard.stats),
  activities: (limit = 50) => api.get(E.dashboard.activities, { params: { limit } }),
};

export const reportsApi = {
  monthlySales: () => api.get(E.reports.monthlySales),
  productSales: () => api.get(E.reports.productSales),
};

/** Load all core app data in parallel (used on login / refresh). */
export const loadAppData = async () => {
  const [
    customers, suppliers, products, invoices, bills, purchases,
    customerPayments, supplierPayments, stockMovements, labours, settings, activities,
  ] = await Promise.all([
    customersApi.list(),
    suppliersApi.list(),
    productsApi.list(),
    invoicesApi.list(),
    billsApi.list(),
    purchasesApi.list(),
    customerPaymentsApi.list(),
    supplierPaymentsApi.list(),
    stockApi.listMovements(),
    laboursApi.list(),
    settingsApi.get(),
    dashboardApi.activities(),
  ]);
  return {
    customers, suppliers, products, invoices, bills, purchases,
    customerPayments, supplierPayments, stockMovements, labours, settings, activities,
  };
};
