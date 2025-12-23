import * as yup from "yup";

export const usuarioSenhaUpdateSchema = yup.object().shape({
  senha_atual: yup
    .string()
    .required("A senha atual é obrigatória"),

  nova_senha: yup
    .string()
    .required("A nova senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),

  confirma_senha: yup
    .string()
    .oneOf([yup.ref("nova_senha")], "As senhas não coincidem")
    .required("Confirme a nova senha"),
});
