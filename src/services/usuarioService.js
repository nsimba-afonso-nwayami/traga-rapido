// services/usuarioService.js
import { api } from "./api"; // sua instância axios já configurada

// Buscar dados do usuário pelo ID
export async function getUsuario(userId) {
  try {
    const response = await api.get(`/usuarios/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

// Atualizar dados do usuário pelo ID
export async function updateUsuario(userId, dados) {
  try {
    const response = await api.put(`/usuarios/${userId}/`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

// Alterar senha
export async function updateSenhaUsuario(userId, dados) {
  try {
    const response = await api.patch(`/usuarios/${userId}/`, {
      password: dados.nova_senha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    throw error;
  }
}
