import { api } from "./api";

export async function loginService(payload) {
  // Agora envia username diretamente
  return api.post("/auth/token/", {
    email: payload.email,
    password: payload.password,
  });
}
