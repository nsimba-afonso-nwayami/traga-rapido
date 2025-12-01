import { api } from "./api";

export async function cadastrarUsuario(data) {
  return api.post("/usuarios/", {
    username: data.nome,
    password: data.senha,
    tipo: data.tipo,
    email: data.email,
    telefone: data.telefone,
  });
}
