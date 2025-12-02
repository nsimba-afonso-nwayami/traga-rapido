import * as yup from "yup";

export const pedidoSchema = yup.object().shape({
  titulo: yup.string().required("Digite o título do pedido"),
  descricao: yup.string().required("Descreva o pedido"),
  origem: yup.string().required("Informe o endereço de origem"),
  destino: yup.string().required("Informe o endereço de destino"),
});
