import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),

  password: Yup.string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});
