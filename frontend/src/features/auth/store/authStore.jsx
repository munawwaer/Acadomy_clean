// تعديل بسيط في authStore.js
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' } // سيتم حفظ البيانات في LocalStorage تلقائياً
  )
);