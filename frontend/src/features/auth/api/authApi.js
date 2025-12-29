// src/features/auth/api/authApi.js
import apiClient from '../../../api/apiClient';
export const loginRequest = async ({ email, password }) => {
  const { data } = await apiClient.get("/api/auth/login", { email, password });
  return data; // نفترض أن الرد يحتوي على الـ user والـ token
};