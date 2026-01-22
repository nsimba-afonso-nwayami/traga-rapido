const BASE_URL = "https://traga-rapido.fimbatec.com/mensagem/pedidos";

export const listarMensagens = async (pedidoId) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${BASE_URL}/${pedidoId}/mensagens/`, {
      method: 'GET',
      headers: { 
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error("Erro ao carregar mensagens");
    return await response.json();
  } catch (error) {
    console.error("Erro no serviço de mensagens:", error);
    throw error;
  }
};

export const enviarMensagem = async (pedidoId, texto) => {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch(`${BASE_URL}/${pedidoId}/mensagens/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ texto })
    });
    if (!response.ok) throw new Error("Erro ao enviar mensagem");
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};