import * as Yup from "yup";

export const cadastroSchema = Yup.object({
  nome: Yup.string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  email: Yup.string()
    .required("O email é obrigatório")
    .email("Insira um email válido"),

  telefone: Yup.string()
  .required("O número de telefone é obrigatório")
  .matches(
    /^(?:\+244)?9[1-9]\d{7}$/,
    "O número deve ser um telefone válido de Angola (ex: 923456789 ou +244923456789)"
  ),

  tipo: Yup.string()
    .required("O tipo de usuário é obrigatório")
    .oneOf(["entregador", "solicitante"], "Selecione um tipo válido"),

  senha: Yup.string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});
