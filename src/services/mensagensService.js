import { api } from "./api";

/**
 * Lista todas as mensagens. 
 */
export const listarMensagens = () => {
  return api.get("/mensagens/");
};

/**
 * Busca os detalhes de uma mensagem específica por ID.
 */
export const buscarMensagemPorId = (id) => {
  return api.get(`/mensagens/${id}/`);
};

export const enviarMensagem = (texto, pedidoId) => {
  const userId = localStorage.getItem("userId");

  const payload = {
    texto: texto,
    pedido: pedidoId,
    remetente: userId ? parseInt(userId, 10) : null
  };

  console.log("Payload Final sendo enviado:", payload);

  return api.post("/mensagens/", payload);
};

/**
 * Buscar mensagens por pedido
 */
export const buscarMensagensPorPedido = (pedidoId) => {
  return api.get(`/mensagens/?pedido=${pedidoId}`);
};