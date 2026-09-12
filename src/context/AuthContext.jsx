import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { setTokens, clearTokens, getAccessToken } from '../services/apiClient';
import { TOKEN_KEYS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(TOKEN_KEYS.user);
    return saved ? JSON.parse(saved) : null;
  });
  const [permissions, setPermissions] = useState(null);
  const [pendingOTP, setPendingOTP] = useState(null);

  const persistUser = useCallback((userData) => {
    setUser(userData);
    if (userData) localStorage.setItem(TOKEN_KEYS.user, JSON.stringify(userData));
    else localStorage.removeItem(TOKEN_KEYS.user);
  }, []);

  const loadPermissions = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const perms = await authApi.permissions();
      setPermissions(perms);
    } catch {
      setPermissions(null);
    }
  }, []);

  useEffect(() => {
    if (user && getAccessToken()) loadPermissions();
    else setPermissions(null);
  }, [user, loadPermissions]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setTokens(data.accessToken, data.refreshToken);
    persistUser(data.user);
    await loadPermissions();
    return data.user;
  };

  const register = async (formData) => {
    const data = await authApi.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setPendingOTP({ email: formData.email, data, reset: false });
    return data?.otp || data?.demoOtp || null;
  };

  const verifyOTP = async (otp) => {
    if (!pendingOTP?.email) throw new Error('No pending verification');
    const data = await authApi.verifyOtp(pendingOTP.email, otp);
    if (pendingOTP.reset) {
      setPendingOTP(null);
      return true;
    }
    setTokens(data.accessToken, data.refreshToken);
    persistUser(data.user);
    setPendingOTP(null);
    await loadPermissions();
    return data.user;
  };

  const forgotPassword = async (email) => {
    const data = await authApi.forgotPassword(email);
    setPendingOTP({ email, reset: true });
    return data?.otp || data?.demoOtp || null;
  };

  const resetPassword = async (otp, newPassword) => {
    if (!pendingOTP?.email) throw new Error('No pending reset');
    await authApi.resetPassword({ email: pendingOTP.email, otp, newPassword });
    setPendingOTP(null);
    return true;
  };

  const logout = async () => {
    try {
      if (getAccessToken()) await authApi.logout();
    } catch { /* ignore */ }
    clearTokens();
    persistUser(null);
    setPermissions(null);
    setPendingOTP(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (permissions?.isSuperadmin) return true;
    if (!permissions?.modules?.length) return true;
    return permissions.modules.some(
      (m) => m.canView || m.canAdd || m.canUpdate || m.canDelete
    );
  };

  const canModule = (moduleCode, action = 'canView') => {
    if (!user) return false;
    if (permissions?.isSuperadmin) return true;
    const mod = permissions?.modules?.find((m) => m.moduleCode === moduleCode);
    return mod ? mod[action] : false;
  };

  return (
    <AuthContext.Provider value={{
      user, permissions, login, register, verifyOTP, forgotPassword, resetPassword,
      logout, hasPermission, canModule, pendingOTP, loadPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
