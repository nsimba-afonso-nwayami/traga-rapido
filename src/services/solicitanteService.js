import { api } from "./api";

export async function completarCadastroSolicitante(payload) {
  const formData = new FormData();

  formData.append("foto_rosto", payload.fotoRosto || "");
  formData.append("doc_frente", payload.biFrente || "");
  formData.append("doc_verso", payload.biVerso || "");
  formData.append("morada", payload.morada);
  formData.append("usuario", payload.userId);
  
  // inspecionar o conteúdo no console antes do envio
  console.log("Conteúdo do FormData antes do envio:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return api.post("/solicitantes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}