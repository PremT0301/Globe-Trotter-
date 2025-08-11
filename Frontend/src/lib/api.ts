export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

// Debug logging
console.log('🔧 API Configuration:', {
  VITE_API_URL: (import.meta as any).env?.VITE_API_URL,
  BASE_URL: BASE_URL
});

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${BASE_URL}${path}`;
  console.log('🌐 Making request:', {
    method: options.method || 'GET',
    url: url,
    headers: headers,
    body: options.body ? JSON.parse(options.body as string) : undefined
  });

  const res = await fetch(url, { ...options, headers });
  
  console.log('📡 Response received:', {
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries())
  });
  
  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    let errorData;
    
    try {
      if (contentType.includes('application/json')) {
        errorData = await res.json();
      } else {
        errorData = await res.text();
      }
    } catch {
      errorData = `HTTP ${res.status}`;
    }
    
    console.log('❌ Request failed:', {
      status: res.status,
      errorData: errorData
    });
    
    const error = new Error() as any;
    error.response = {
      status: res.status,
      data: errorData
    };
    error.request = true;
    throw error;
  }
  
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ Request successful:', data);
    return data;
  }
  // @ts-expect-error allow non-json responses
  return null;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};


