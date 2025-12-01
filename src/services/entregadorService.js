import { api } from "./api";

export async function completarCadastroEntregador(payload) {
  const formData = new FormData();

  formData.append("foto_rosto", payload.fotoRosto || "");
  formData.append("doc_frente", payload.biFrente || "");
  formData.append("doc_verso", payload.biVerso || "");
  formData.append("carta_conducao", payload.cartaConducao || "");
  formData.append("matricula_veiculo", payload.placaVeiculo);
  formData.append("usuario", payload.userId);

  // inspecionar conteúdo para debug
  console.log("Conteúdo do FormData antes do envio:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return api.post("/entregadores/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
