import * as yup from "yup";

export const pedidoSchema = yup.object().shape({
  titulo: yup.string().required("Digite o título do pedido"),
  descricao: yup.string().required("Descreva o pedido"),
  origem: yup.string().required("Informe o endereço de origem"),
  destino: yup.string().required("Informe o endereço de destino"),

  tipo_item: yup.string().optional(),
  peso_kg: yup
    .number()
    .typeError("Peso deve ser um número")
    .positive("Peso deve ser positivo")
    .nullable()
    .optional(),
  tamanho: yup.string().optional(),
  urgencia: yup
    .string()
    .required("Informe a urgência")
    .oneOf(["NORMAL", "URGENTE", "EXPRESS"], "Escolha uma urgência válida")
    .nullable(),
  valor_sugerido: yup
    .number()
    .required("Informe o valor sugerido")
    .typeError("Valor sugerido deve ser um número")
    .positive("Valor deve ser positivo")
    .nullable(),
});
