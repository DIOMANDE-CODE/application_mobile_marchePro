import axios from "axios";

export const API_BASE_URL = "http://192.168.100.2:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   async (config) => {
//     // exemple si tu veux ajouter le token JWT
//     // const token = await AsyncStorage.getItem("token");
//     // if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;