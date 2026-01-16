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

/**
 * Envia uma nova mensagem vinculada a um pedido.
 * @param {string} texto - O conteúdo da mensagem.
 * @param {number} pedidoId - O ID do pedido ao qual esta conversa pertence.
 */
export const enviarMensagem = (texto, pedidoId) => {
  return api.post("/mensagens/", {
    texto: texto,
    pedido: pedidoId
  });
};

/**
 * Buscar mensagens por pedido
 */
export const buscarMensagensPorPedido = (pedidoId) => {
  return api.get(`/mensagens/?pedido=${pedidoId}`);
};