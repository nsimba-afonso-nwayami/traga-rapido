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
  const response = await api.get("/pedidos/");

  console.log("PEDIDOS DA API:", response.data);

  return response.data.filter(
    (pedido) =>
      pedido.status === "AGUARDANDO_PROPOSTAS" &&
      (pedido.entregador === null || pedido.entregador === undefined)
  );
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
