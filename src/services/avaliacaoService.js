import { api } from "./api";

export const criarAvaliacao = async (dadosAvaliacao) => {
  try {
    const payload = {
      estrelas: Number(dadosAvaliacao.estrelas),
      comentario: dadosAvaliacao.comentario || "",
      pedido: dadosAvaliacao.pedido
    };

    console.log("Payload enviado para API:", payload);

    const response = await api.post("avaliacoes/", payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("A API rejeitou os dados:", error.response.data);
    }
    throw error;
  }
};

export const listarAvaliacoes = async () => {
  try {
    const response = await api.get("avaliacoes/");
    return response.data; 
  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    return [];
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