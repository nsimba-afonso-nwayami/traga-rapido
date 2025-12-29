import { api } from "./api"; // o mesmo axios que você já usa

export function criarNotificacao(payload) {
  return api.post("/notificacoes/", payload);
}

export function listarNotificacoes() {
  return api.get("/notificacoes/");
}

export function obterNotificacao(id) {
  return api.get(`/notificacoes/${id}/`);
}
