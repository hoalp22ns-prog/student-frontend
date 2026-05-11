import axios from 'axios';

// 🔧 Configure API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`);
    return response;
  },
  (error) => {
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message;
    console.error(`❌ Error: ${errorMsg}`);
    return Promise.reject(new Error(errorMsg));
  }
);

// ==========================================
// 🔐 AUTHENTICATION API
// ==========================================
export const authApi = {
  register: (username, password, role = 'ROLE_USER') =>
    api.post('/api/auth/register', { username, password, role }),

  login: (username, password) =>
    api.post('/api/auth/login', { username, password }),
};

// ==========================================
// 👥 STUDENT API
// ==========================================
export const studentApi = {
  getAll: () => api.get('/api/students'),
  getById: (id) => api.get(`/api/students/${id}`),
  create: (data) => api.post('/api/students', data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`),
  healthCheck: () => api.get('/api/students/health/status'),
};

// ==========================================
// 📊 GRADE API
// ==========================================
export const gradeApi = {
  getAll: () => api.get('/api/grades'),
  getById: (id) => api.get(`/api/grades/${id}`),
  getByStudent: (studentId) => api.get(`/api/grades/student/${studentId}`),
  create: (data) => api.post('/api/grades', data),
  update: (id, data) => api.put(`/api/grades/${id}`, data),
  delete: (id) => api.delete(`/api/grades/${id}`),
};

export default api;