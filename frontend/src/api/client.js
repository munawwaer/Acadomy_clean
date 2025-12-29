import axios from 'axios';

// التحديث هنا: أضفنا /api للنهاية حسب التوثيق
const BASE_URL = 'http://127.0.0.1:8000/api'; 

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
// src/api/apiClient.js
// import axios from 'axios';
// import { useAuthStore } from '../features/auth/store/authStore';

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // --- Request Interceptor ---
// // يضيف التوكن لكل طلب يخرج من التطبيق
// apiClient.interceptors.request.use(
//   (config) => {
//     // نجلب التوكن من Zustand store مباشرة
//     const token = useAuthStore.getState().token; 
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // --- Response Interceptor ---
// // يعالج الأخطاء العامة (مثل انتهاء صلاحية التوكن 401)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // إذا انتهت صلاحية التوكن، نقوم بتسجيل الخروج تلقائياً
//       useAuthStore.getState().logout();
//       window.location.href = '/login'; // توجيه للمسار الرئيسي
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;