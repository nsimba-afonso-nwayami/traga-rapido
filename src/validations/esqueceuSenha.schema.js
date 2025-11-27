import * as Yup from "yup";

export const esqueceuSenhaSchema = Yup.object().shape({
  email: Yup.string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),
});