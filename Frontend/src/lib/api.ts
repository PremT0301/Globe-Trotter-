export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem('token');
    console.log('🔑 API: Token from localStorage:', token ? 'Present' : 'Missing');
    return token;
  } catch {
    console.log('❌ API: Error getting token from localStorage');
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getAuthToken();
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
    console.log('✅ API: Adding Authorization header');
  } else {
    console.log('⚠️ API: No token found, request will be unauthenticated');
  }

  console.log('🌐 API: Making request to:', `${BASE_URL}${path}`);
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    console.log('❌ API: Request failed with status:', res.status);
    const text = await res.text();
    console.log('❌ API: Error response:', text);
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  // @ts-expect-error allow non-json responses
  return null;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};


