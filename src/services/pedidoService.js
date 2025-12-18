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

// Elimina pedido
export async function eliminarPedido(id) {
  return api.delete(`/pedidos/${id}/`);
}

// Aceitar um pedido (atribuir ao entregador)
export function aceitarPedido(pedidoId, entregadorId) {
  return api.put(`/pedidos/${pedidoId}/`, {
    entregador: entregadorId,
    status: "ACEITO",
  });
}
