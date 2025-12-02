import { api } from "./api";

export async function criarPedido(payload) {
  return api.post("/pedidos/", payload);
}
