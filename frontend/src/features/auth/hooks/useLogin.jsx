// src/features/auth/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuth(data.user); // تخزين المستخدم في Zustand
      localStorage.setItem("token", data.token); // أو حسب طريقتك في التخزين
    },
  });
};