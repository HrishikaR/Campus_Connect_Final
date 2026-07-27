import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor with Automatic Token Refresh
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cc_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          if (res.data?.token) {
            localStorage.setItem('cc_token', res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem('cc_refresh_token', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            const retryRes = await API(originalRequest);
            return retryRes;
          }
        } catch (refreshErr) {
          localStorage.removeItem('cc_token');
          localStorage.removeItem('cc_refresh_token');
          localStorage.removeItem('cc_user');
        }
      }
    }

    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default API;
