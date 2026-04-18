import axios from 'axios';

const BACKEND_URL = "https://hifone-web.onrender.com";
const API_BASE = `${BACKEND_URL}/api`;
// const BACKEND_URL = '';  // empty - proxy handle karega
// const API_BASE = `/api`;
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: get auth headers from stored token
function authHeaders() {
  const token = localStorage.getItem('hifone_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth APIs
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
};

// Device APIs
export const deviceApi = {
  getAll: () => api.get('/devices'),
  getBrands: () => api.get('/devices/brands'),
  getBrandsGrouped: () => api.get('/devices/brands-grouped'),
  getByBrand: (brand) => api.get(`/devices/brand/${brand}`),
  getById: (id) => api.get(`/devices/${id}`),
  create: (data) => api.post('/devices', data, { headers: authHeaders() }),
  update: (id, data) => api.put(`/devices/${id}`, data, { headers: authHeaders() }),
};

// Service APIs
export const serviceApi = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data, { headers: authHeaders() }),
  update: (id, data) => api.put(`/services/${id}`, data, { headers: authHeaders() }),
};

// Pricing APIs
export const pricingApi = {
  getAll: () => api.get('/pricing'),
  getPrice: (deviceId, serviceId) => api.get(`/pricing/${deviceId}/${serviceId}`),
  create: (data) => api.post('/pricing', data, { headers: authHeaders() }),
  update: (id, data) => api.put(`/pricing/${id}`, data, { headers: authHeaders() }),
};

// Booking APIs
export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getAll: () => api.get('/bookings'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status?status=${status}`),
};

// Testimonial APIs
export const testimonialApi = {
  getAll: () => api.get('/testimonials'),
};

// Blog APIs
export const blogApi = {
  getAll: () => api.get('/blogs'),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
};

// Location APIs
export const locationApi = {
  getAll: () => api.get('/locations'),
};

// Contact APIs
export const contactApi = {
  submit: (data) => api.post('/contact', data),
};

// Payment APIs - COMING SOON
export const paymentApi = {
  createCheckout: () => Promise.reject(new Error('Online payments coming soon')),
  getStatus: () => Promise.reject(new Error('Online payments coming soon')),
};

// Business Settings APIs
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data, { headers: authHeaders() }),
  testEmail: () => api.post('/admin/test-email', {}, { headers: authHeaders() }),
};

// Google Reviews API
export const reviewsApi = {
  get: () => api.get('/reviews'),
};

// SEO Page APIs
export const seoApi = {
  getPageData: (deviceSlug, serviceSlug, location = 'adelaide') =>
    api.get(`/seo-page-data?device_slug=${deviceSlug}&service_slug=${serviceSlug}&location=${location}`),
  getAllSlugs: () => api.get('/seo-slugs'),
};

// Seed API (for initial setup)
export const seedApi = {
  seed: () => api.post('/seed'),
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
};
// Render free tier cold start fix - ping backend on app load
export const warmupBackend = () => {
  api.get('/health').catch(() => {
    // Silent fail - just warming up
  });
};


export const mailInApi = {
 
  // Customer: submit mail-in repair form (no auth needed)
  create: (data) => api.post('/mail-in-requests', data),
 
  // Customer: add tracking number (no auth needed)
  updateTracking: (id, trackingNumber) =>
    api.patch(`/mail-in-requests/${id}/tracking`, null, {
      params: { tracking_number: trackingNumber }
    }),
 
  // Admin: get all mail-in requests
  getAll: (status = null) => {
    const token = localStorage.getItem('hifone_admin_token');
    return api.get('/admin/mail-in-requests', {
      params: status ? { status } : {},
      headers: { Authorization: `Bearer ${token}` },
    });
  },
 
  // Admin: update status
  updateStatus: (id, status) => {
    const token = localStorage.getItem('hifone_admin_token');
    return api.patch(`/admin/mail-in-requests/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
 
  // Admin: delete
  delete: (id) => {
    const token = localStorage.getItem('hifone_admin_token');
    return api.delete(`/admin/mail-in-requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
 
 
export default api;
