import { api } from "./api";

export const criarAvaliacao = async (dadosAvaliacao) => {
  try {
    // Blindagem dos dados: Garantimos que números sejam números e strings sejam strings
    const payload = {
      estrelas: Number(dadosAvaliacao.estrelas),
      comentario: dadosAvaliacao.comentario || "", // Evita enviar null
      pedido: Number(dadosAvaliacao.pedido)
    };

    // Log para você conferir no console antes de enviar
    console.log("Payload enviado para API:", payload);

    const response = await api.post("avaliacoes/", payload);
    return response.data;
  } catch (error) {
    // Se der erro 400, este log vai mostrar EXATAMENTE qual campo a API rejeitou
    if (error.response && error.response.data) {
      console.error("A API rejeitou os dados:", error.response.data);
    }
    console.error("Erro ao criar avaliação:", error);
    throw error;
  }
};

export const obterAvaliacaoPorPedido = async (pedidoId) => {
  try {
    const response = await api.get(`avaliacoes/?pedido=${pedidoId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};