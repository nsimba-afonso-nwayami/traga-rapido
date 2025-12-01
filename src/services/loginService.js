import { api } from "./api";

export async function loginService(payload) {
  return api.post("/usuarios/login/", {
    username: payload.email,
    password: payload.password,
  });
}
