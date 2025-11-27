import * as Yup from "yup";

export const redefinirSenhaSchema = Yup.object().shape({
  novaSenha: Yup.string()
    .required("A nova senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: Yup.string()
    .required("Confirme a nova senha")
    .oneOf([Yup.ref("novaSenha")], "As senhas não coincidem"),
});