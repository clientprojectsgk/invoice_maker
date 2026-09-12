/** Central API configuration — change base URL here only. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://115.124.127.102:8010/api/v1/';

export const TOKEN_KEYS = {
  access: 'ip_access_token',
  refresh: 'ip_refresh_token',
  user: 'ip_user',
};
