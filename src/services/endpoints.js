/**
 * All API endpoint paths — relative to API_BASE_URL.
 * Grouped by domain; use with apiClient (GET/POST/PATCH/PUT/DELETE).
 */
export const ENDPOINTS = {
  // Health
  root: '/',
  health: '/health',

  // Auth
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    me: '/auth/me',
    permissions: '/auth/me/permissions',
    logout: '/auth/logout',
  },

  // Users
  users: {
    list: '/users',
    create: '/users',
    get: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    assignRole: (id) => `/users/${id}/role`,
  },

  // Roles & Permissions
  modules: {
    list: '/modules',
    create: '/modules',
    update: (id) => `/modules/${id}`,
    delete: (id) => `/modules/${id}`,
  },
  roles: {
    list: '/roles',
    create: '/roles',
    get: (id) => `/roles/${id}`,
    update: (id) => `/roles/${id}`,
    delete: (id) => `/roles/${id}`,
    permissions: (id) => `/roles/${id}/permissions`,
  },

  // Customers
  customers: {
    list: '/customers',
    outstanding: '/customers/outstanding',
    create: '/customers',
    get: (id) => `/customers/${id}`,
    update: (id) => `/customers/${id}`,
    delete: (id) => `/customers/${id}`,
    summary: (id) => `/customers/${id}/summary`,
    ledger: (id) => `/customers/${id}/ledger`,
    aging: (id) => `/customers/${id}/aging`,
  },

  // Suppliers
  suppliers: {
    list: '/suppliers',
    outstanding: '/suppliers/outstanding',
    create: '/suppliers',
    get: (id) => `/suppliers/${id}`,
    update: (id) => `/suppliers/${id}`,
    delete: (id) => `/suppliers/${id}`,
    summary: (id) => `/suppliers/${id}/summary`,
    ledger: (id) => `/suppliers/${id}/ledger`,
  },

  // Products
  products: {
    list: '/products',
    create: '/products',
    get: (id) => `/products/${id}`,
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
    stockLedger: (id) => `/products/${id}/stock-ledger`,
    adjustStock: (id) => `/products/${id}/adjust-stock`,
  },

  // Invoices
  invoices: {
    list: '/invoices',
    create: '/invoices',
    get: (id) => `/invoices/${id}`,
    update: (id) => `/invoices/${id}`,
    delete: (id) => `/invoices/${id}`,
    cancel: (id) => `/invoices/${id}/cancel`,
    duplicate: (id) => `/invoices/${id}/duplicate`,
  },

  // Purchases
  purchases: {
    list: '/purchases',
    create: '/purchases',
    get: (id) => `/purchases/${id}`,
    cancel: (id) => `/purchases/${id}/cancel`,
  },

  // Customer Payments
  customerPayments: {
    list: '/customer-payments',
    create: '/customer-payments',
    get: (id) => `/customer-payments/${id}`,
    cancel: (id) => `/customer-payments/${id}/cancel`,
  },

  // Supplier Payments
  supplierPayments: {
    list: '/supplier-payments',
    create: '/supplier-payments',
    get: (id) => `/supplier-payments/${id}`,
    cancel: (id) => `/supplier-payments/${id}/cancel`,
  },

  // Stock
  stockMovements: {
    list: '/stock-movements',
  },

  // Labour
  labours: {
    list: '/labours',
    create: '/labours',
    get: (id) => `/labours/${id}`,
    update: (id) => `/labours/${id}`,
    delete: (id) => `/labours/${id}`,
    earnings: (id) => `/labours/${id}/earnings`,
    attendance: '/labours/attendance',
    payments: '/labours/payments',
    deletePayment: (id) => `/labours/payments/${id}`,
  },

  // Bills
  bills: {
    list: '/bills',
    create: '/bills',
    get: (id) => `/bills/${id}`,
    update: (id) => `/bills/${id}`,
    delete: (id) => `/bills/${id}`,
  },

  // Settings
  settings: {
    get: '/settings',
    update: '/settings',
  },

  // Dashboard & Reports
  dashboard: {
    stats: '/dashboard/stats',
    activities: '/activities',
  },
  reports: {
    monthlySales: '/reports/monthly-sales',
    productSales: '/reports/product-sales',
  },
};
