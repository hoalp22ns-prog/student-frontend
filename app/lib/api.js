import axios from 'axios';

// 🔧 Configure API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor - add logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    // Extract detailed error message from backend
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Unknown error occurred';
    const status = error.response?.status;
    
    console.error(`❌ API Error [${status}]: ${errorMessage}`);
    
    // Create enriched error object with details
    const enrichedError = new Error(errorMessage);
    enrichedError.status = status;
    enrichedError.originalError = error;
    
    return Promise.reject(enrichedError);
  }
);

export const studentApi = {
  // ========== CRUD OPERATIONS ==========
  // Lấy tất cả sinh viên
  getAll: () => api.get('/api/students'),

  // Lấy chi tiết một sinh viên
  getById: (id) => api.get(`/api/students/${id}`),

  // Thêm sinh viên mới
  create: (data) => api.post('/api/students', data),

  // Cập nhật sinh viên
  update: (id, data) => api.put(`/api/students/${id}`, data),

  // Xóa sinh viên
  delete: (id) => api.delete(`/api/students/${id}`),

  // ========== HEALTH CHECK ENDPOINTS ==========
  // Simple health ping
  healthPing: () => api.get('/api/students/health/ping'),

  // Basic health status
  healthStatus: () => api.get('/api/students/health/status'),

  // Detailed health - shows Render + Railway status
  healthDetailed: () => api.get('/api/students/health/detailed'),

  // ========== ADMIN ENDPOINTS ==========
  // Check data consistency between Render and Railway
  consistencyCheck: () => api.get('/api/students/admin/consistency-check'),

  // Manual trigger sync from Primary (Render) to Secondary (Railway)
  manualSync: () => api.post('/api/students/admin/sync'),

  // Debug: Get database connection info
  debugDbInfo: () => api.get('/api/students/debug/db-info'),
};