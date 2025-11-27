import * as Yup from "yup";

const allowedTypes = ["image/jpeg", "application/pdf"];
const FILE_SIZE_MAX = 5 * 1024 * 1024; // 5MB

export const cadastroEntregadorSchema = Yup.object().shape({
  fotoRosto: Yup.mixed()
    .required("A foto do rosto é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  fotoBIFrente: Yup.mixed()
    .required("A foto do BI (frente) é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  fotoBIVerso: Yup.mixed()
    .required("A foto do BI (verso) é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  cartaConducao: Yup.mixed()
    .required("A carta de condução é obrigatória")
    .test("fileType", "O arquivo deve ser JPG ou PDF", (value) => {
      return value && value[0] && allowedTypes.includes(value[0].type);
    })
    .test("fileSize", "O arquivo deve ter no máximo 5MB", (value) => {
      return value && value[0] && value[0].size <= FILE_SIZE_MAX;
    }),

  placaVeiculo: Yup.string()
  .required("A placa do veículo é obrigatória")
  .matches(
    /^[A-Z]{2}-\d{2}-\d{2}(-[A-Z]{2})?$/,
    "A placa deve estar no formato válido (ex: LD-45-22 ou LD-45-22-AA)"
  ),
});
