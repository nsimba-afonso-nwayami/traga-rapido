import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string()
    .required("O nome de usuário é obrigatório"),

  password: Yup.string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
});
