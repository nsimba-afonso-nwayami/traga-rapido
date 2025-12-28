import { api } from "./api";

export async function criarPedido(payload) {
  return api.post("/pedidos/", payload);
}

export async function listarPedidos() {
  return api.get("/pedidos/");
}

// Lista apenas pedidos do solicitante
export async function listarPedidosPorSolicitante(idSolicitante) {
  const response = await listarPedidos();
  return response.data.filter(pedido => pedido.solicitante === idSolicitante);
}

// Lista apenas pedidos disponíveis para entregador
export async function listarPedidosDisponiveis() {
  const response = await listarPedidos();
  console.log("PEDIDOS DA API:", response.data);

  return response.data.filter(
    pedido =>
      pedido.status === "AGUARDANDO_PROPOSTAS" &&
      pedido.entregador === null
  );
}

export async function obterPedidoPorId(id) {
  const response = await api.get(`/pedidos/${id}/`);
  return response.data;
}

export async function cancelarPedido(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/cancelar/`);
}

// Aceitar um pedido (atribuir ao entregador)
export async function aceitarPedido(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/aceitar/`);
}
