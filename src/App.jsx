import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import OTPVerification from './pages/auth/OTPVerification';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoicePreviewPage from './pages/InvoicePreviewPage';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Suppliers from './pages/Suppliers';
import SupplierDetail from './pages/SupplierDetail';
import Products from './pages/Products';
import Bills from './pages/Bills';
import Purchases from './pages/Purchases';
import PurchaseCreate from './pages/PurchaseCreate';
import PurchasePayments from './pages/PurchasePayments';
import CustomerPayments from './pages/CustomerPayments';
import Receivables from './pages/Receivables';
import Payables from './pages/Payables';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/create" element={<InvoiceCreate />} />
                <Route path="invoices/:id" element={<InvoicePreviewPage />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="suppliers/:id" element={<SupplierDetail />} />
                <Route path="products" element={<Products />} />
                <Route path="bills" element={<Bills />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="purchases/create" element={<PurchaseCreate />} />
                <Route path="purchase-payments" element={<PurchasePayments />} />
                <Route path="customer-payments" element={<CustomerPayments />} />
                <Route path="receivables" element={<Receivables />} />
                <Route path="payables" element={<Payables />} />
                <Route path="stock" element={<Stock />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
