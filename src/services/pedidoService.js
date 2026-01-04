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

// Lista pedidos disponíveis OU o pedido que o entregador já aceitou
export async function listarPedidosDisponiveis() {
  const response = await listarPedidos();
  
  // Recupera o ID do entregador logado
  const logadoId = localStorage.getItem("userId");

  return response.data.filter(pedido => {
    // 1. Mostrar pedidos que ninguém aceitou ainda
    const isDisponivel = pedido.status === "AGUARDANDO_PROPOSTAS" && pedido.entregador === null;
    
    // 2. MOSTRAR o pedido que EU aceitei e ainda estou entregando
    // Convertemos para String caso um venha como número e outro como texto
    const isMeuPedidoEmAndamento = 
      String(pedido.entregador) === String(logadoId) && 
      pedido.status !== "ENTREGUE" &&
      pedido.status !== "CANCELADO";

    return isDisponivel || isMeuPedidoEmAndamento;
  });
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

// Funções de atualização de status
export async function marcarACaminho(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/a_caminho/`);
}

export async function marcarItemRetirado(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/item_retirado/`);
}

export async function marcarEmEntrega(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/em_entrega/`);
}

export async function marcarEntregue(pedidoId) {
  return api.post(`/pedidos/${pedidoId}/entregue/`);
}