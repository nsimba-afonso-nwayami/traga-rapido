import * as Yup from "yup";

const allowedTypes = ["image/jpeg", "application/pdf"];
const FILE_SIZE_MAX = 5 * 1024 * 1024; // 5MB

export const cadastroSolicitanteSchema = Yup.object().shape({
  fotoRosto: Yup.mixed()
    .required("A foto do rosto é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  biFrente: Yup.mixed()
    .required("A foto do BI (frente) é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  biVerso: Yup.mixed()
    .required("A foto do BI (verso) é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  morada: Yup.string()
    .required("A morada é obrigatória")
    .min(3, "A morada deve ter pelo menos 3 caracteres"),
});
