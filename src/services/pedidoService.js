import { api } from "./api";

export async function criarPedido(data) {
  return api.post("/pedidos/", {
    titulo: data.titulo,
    descricao: data.descricao,
    origem_latitude: data.origemLatitude,
    origem_longitude: data.origemLongitude,
    destino_latitude: data.destinoLatitude,
    destino_longitude: data.destinoLongitude,
    //solicitante: data.solicitanteId,
  });
}
