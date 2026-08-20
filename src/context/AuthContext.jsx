import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@invoicepro.com', password: 'admin123', role: 'admin', avatar: null },
  { id: '2', name: 'Manager User', email: 'manager@invoicepro.com', password: 'manager123', role: 'manager', avatar: null },
  { id: '3', name: 'Operator User', email: 'operator@invoicepro.com', password: 'operator123', role: 'operator', avatar: null },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ip_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingOTP, setPendingOTP] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem('ip_user', JSON.stringify(user));
    else localStorage.removeItem('ip_user');
  }, [user]);

  const login = async (email, password) => {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...userData } = found;
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const exists = DEMO_USERS.find((u) => u.email === data.email);
    if (exists) throw new Error('Email already registered');
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setPendingOTP({ email: data.email, otp, data });
    return otp;
  };

  const verifyOTP = async (otp) => {
    if (!pendingOTP || pendingOTP.otp !== otp) throw new Error('Invalid OTP');
    const newUser = {
      id: Date.now().toString(),
      name: pendingOTP.data.name,
      email: pendingOTP.data.email,
      role: 'operator',
      avatar: null,
    };
    setUser(newUser);
    setPendingOTP(null);
    return newUser;
  };

  const forgotPassword = async (email) => {
    const found = DEMO_USERS.find((u) => u.email === email);
    if (!found) throw new Error('Email not found');
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setPendingOTP({ email, otp, reset: true });
    return otp;
  };

  const resetPassword = async (otp, newPassword) => {
    if (!pendingOTP || pendingOTP.otp !== otp) throw new Error('Invalid OTP');
    setPendingOTP(null);
    return true;
  };

  const logout = () => setUser(null);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'manager') return ['read', 'write', 'reports'].includes(permission);
    if (user.role === 'operator') return ['read', 'write'].includes(permission);
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, forgotPassword, resetPassword, logout, hasPermission, pendingOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
