import * as yup from "yup";

export const usuarioUpdateSchema = yup.object({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),

  email: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),

  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(
      /^(?:\+244)?9[1-9]\d{7}$/,
      "Telefone inválido. Use 9XXXXXXXX ou +2449XXXXXXXX"
    ),
});
