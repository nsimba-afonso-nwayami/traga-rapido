import { api } from "./api";
import axios from "axios";

// Definimos a base específica para o rastreamento
const RASTREAMENTO_BASE_URL = "https://traga-rapido.fimbatec.com/rastreamento";

export const enviarPosicao = async (pedidoId, latitude, longitude) => {
  // Usamos a URL completa para ignorar o "/api" da baseURL, mas manter o interceptor do Token
  const response = await axios.post(`${RASTREAMENTO_BASE_URL}/pedidos/${pedidoId}/posicao/enviar/`, {
    pedidoId,
    latitude,
    longitude,
  });
  return response.data;
};

export const consultarPosicao = async (pedidoId) => {
  const response = await axios.get(`${RASTREAMENTO_BASE_URL}/pedidos/${pedidoId}/posicao/`);
  return response.data;
};