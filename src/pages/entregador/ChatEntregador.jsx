import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import {
  buscarMensagensPorPedido,
  enviarMensagem as apiEnviarMensagem,
} from "../../services/mensagensService";

export default function ChatEntregador() {
  const { id } = useParams(); // ID do Pedido (UUID)
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const carregarMensagens = useCallback(
    async (isFirstLoad = false) => {
      if (isFirstLoad) setLoading(true);
      try {
        const data = await buscarMensagensPorPedido(id);

        // Validação: Garante que 'data' é um array antes de mapear
        if (data && Array.isArray(data)) {
          const formatadas = data.map((msg) => ({
            id: msg.id,
            texto: msg.texto,
            enviadaPorMim: String(msg.remetente) === String(userId),
            horario: msg.criado_em
              ? new Date(msg.criado_em).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--",
          }));
          setMensagens(formatadas);
        }
      } catch (error) {
        console.error(
          "Erro detalhado ao carregar mensagens:",
          error.response?.data || error.message,
        );
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    },
    [id, userId],
  );

  // Efeito para carregar dados iniciais e definir o intervalo (Polling)
  useEffect(() => {
    carregarMensagens(true);

    const interval = setInterval(() => {
      carregarMensagens(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [carregarMensagens]);

  // Efeito para rolar a tela sempre que houver novas mensagens
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const textoParaEnviar = novaMensagem;
    setNovaMensagem(""); // Otimismo na UI: limpa antes da resposta da API

    try {
      await apiEnviarMensagem(textoParaEnviar, id);
      await carregarMensagens();
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Não foi possível enviar a mensagem. Verifique sua conexão.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 flex flex-col bg-white mt-16 md:mt-20 overflow-hidden">
          {/* Cabeçalho do Chat */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm shrink-0 z-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight">Cliente</h3>
              <p className="text-xs text-green-600 font-medium tracking-wide">
                Online • Pedido #{id.slice(0, 8)}
              </p>
            </div>
          </div>

          {/* Área das Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
              </div>
            ) : mensagens.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                <i className="fas fa-comments text-4xl mb-2"></i>
                <p className="text-sm font-medium">Nenhuma mensagem ainda.</p>
                <p className="text-xs">Inicie a conversa sobre a entrega.</p>
              </div>
            ) : (
              mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.enviadaPorMim ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                      msg.enviadaPorMim
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.texto}</p>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        msg.enviadaPorMim ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {msg.horario}
                      {msg.enviadaPorMim && (
                        <i className="fas fa-check-double text-[8px]"></i>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={handleEnviar}
              className="max-w-4xl mx-auto flex items-center gap-2"
            >
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-blue-600 transition-colors hidden sm:block"
              >
                <i className="fas fa-camera text-xl"></i>
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Escreva para o cliente..."
                  className="w-full bg-gray-100 border-none rounded-full py-3 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!novaMensagem.trim()}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                  novaMensagem.trim()
                    ? "bg-blue-600 text-white shadow-md active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
