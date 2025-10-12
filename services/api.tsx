import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = "http://192.168.100.2:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Charger si token existant
export async function attachTokenToApi() {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Intercepteur global : si 401 -> cleanup et redirect vers login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      // supprime le token local
      await SecureStore.deleteItemAsync("auth_token");
      delete api.defaults.headers.common["Authorization"];
      // redirection : expo-router ou navigation
      try {
        const { router } = await import("expo-router");
        router.replace("/login");
      } catch (e) {
        console.warn("Impossible de router.replace dans l'interceptor", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;