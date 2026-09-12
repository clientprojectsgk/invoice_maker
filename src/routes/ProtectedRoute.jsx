import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccessToken } from '../services/apiClient';

export default function ProtectedRoute({ children, permission }) {
  const { user, hasPermission } = useAuth();
  if (!user || !getAccessToken()) return <Navigate to="/login" replace />;
  if (permission && !hasPermission(permission)) return <Navigate to="/dashboard" replace />;
  return children;
}
