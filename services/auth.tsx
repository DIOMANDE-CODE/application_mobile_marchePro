import * as SecureStore from "expo-secure-store";
import { attachTokenToApi } from "./api";

export async function isAuthenticated() {
  const token = await SecureStore.getItemAsync("auth_token");
  if (!token) return false;
  await attachTokenToApi();
}