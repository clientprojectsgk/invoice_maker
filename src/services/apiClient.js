import { API_BASE_URL, TOKEN_KEYS } from '../config/api';
import { keysToCamel, keysToSnake } from '../utils/caseTransform';

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.access);
export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.refresh);

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(TOKEN_KEYS.access, accessToken);
  if (refreshToken) localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
  localStorage.removeItem(TOKEN_KEYS.user);
};

/** Backend wraps payloads as { success, error, message, data }. */
const unwrapEnvelope = (raw) => {
  if (!raw || typeof raw !== 'object' || !('data' in raw) || !('success' in raw)) {
    return raw;
  }
  if (raw.success === 0 || raw.error === 1) {
    throw new ApiError(raw.message || 'Request failed', 400, raw);
  }
  return raw.data ?? raw;
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    if (data?.success === 0 || data?.error === 1) return data.message || 'Request failed';
    if (Array.isArray(data?.detail)) {
      return data.detail.map((d) => d.msg).join(', ');
    }
    if (typeof data?.detail === 'string') return data.detail;
    if (data?.message) return data.message;
    return `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError('Session expired', 401);

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new ApiError('Session expired', 401);
        const raw = keysToCamel(await res.json());
        const data = unwrapEnvelope(raw);
        setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

/**
 * Core HTTP client — attaches auth, transforms case, retries once on 401.
 */
export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    params,
    auth = true,
    transform = true,
    raw = false,
  } = options;

  let url = `${API_BASE_URL}${path.replace(/^\//, '')}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, v);
    });
    const q = qs.toString();
    if (q) url += `?${q}`;
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const payload = body !== undefined
    ? JSON.stringify(transform ? keysToSnake(body) : body)
    : undefined;

  const doFetch = (authHeader) => fetch(url, {
    method,
    headers: authHeader ? { ...headers, Authorization: `Bearer ${authHeader}` } : headers,
    body: payload,
  });

  let response = await doFetch(auth && token ? token : null);

  if (response.status === 401 && auth && getRefreshToken()) {
    try {
      const newToken = await refreshAccessToken();
      response = await doFetch(newToken);
    } catch {
      clearTokens();
      throw new ApiError('Session expired. Please sign in again.', 401);
    }
  }

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const message = await parseError(response);
    throw new ApiError(message, response.status);
  }

  const text = await response.text();
  if (!text) return null;

  const parsed = JSON.parse(text);
  const camel = transform ? keysToCamel(parsed) : parsed;
  return unwrapEnvelope(camel);
};

export const api = {
  get: (path, opts) => apiRequest(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiRequest(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => apiRequest(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => apiRequest(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => apiRequest(path, { ...opts, method: 'DELETE' }),
};

export { ApiError };
