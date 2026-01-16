import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function ChatSolicitante() {
  const { id } = useParams(); // ID da conversa/entregador
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState("");
  const messagesEndRef = useRef(null);

  // Mock de mensagens para o layout
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto: "Olá! Peguei seu pedido agora.",
      enviadaPorMim: false,
      horario: "14:05",
    },
    {
      id: 2,
      texto: "Perfeito! Muito obrigado pela agilidade.",
      enviadaPorMim: true,
      horario: "14:06",
    },
    {
      id: 3,
      texto: "Sabe me dizer se o restaurante embalou bem os itens?",
      enviadaPorMim: true,
      horario: "14:06",
    },
    {
      id: 4,
      texto: "Sim, está tudo bem lacrado em uma bolsa térmica.",
      enviadaPorMim: false,
      horario: "14:08",
    },
    {
      id: 5,
      texto: "Estou saindo agora, chego em 10 minutos!",
      enviadaPorMim: false,
      horario: "14:10",
    },
  ]);

  // Função para rolar para a última mensagem automaticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const novaMsgObj = {
      id: Date.now(),
      texto: novaMensagem,
      enviadaPorMim: true,
      horario: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens([...mensagens, novaMsgObj]);
    setNovaMensagem("");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DO CHAT */}
        <main className="flex-1 flex flex-col bg-white mt-16 md:mt-20 overflow-hidden">
          {/* CABEÇALHO DO CHAT (SUB-HEADER) */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight">
                João Silva
              </h3>
              <p className="text-xs text-green-600 font-medium">Online agora</p>
            </div>
          </div>

          {/* ÁREA DE MENSAGENS (COM SCROLL) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.enviadaPorMim ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                    msg.enviadaPorMim
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p>{msg.texto}</p>
                  <p
                    className={`text-[10px] mt-1 flex items-center gap-1 ${
                      msg.enviadaPorMim ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.horario}
                    {msg.enviadaPorMim && (
                      <i className="fas fa-check-double"></i>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT DE MENSAGEM (FIXO NO RODAPÉ DO CHAT) */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={enviarMensagem}
              className="max-w-4xl mx-auto flex items-center gap-2"
            >
              <button
                type="button"
                className="p-3 text-gray-400 hover:text-blue-600 transition-colors"
                title="Anexar foto"
              >
                <i className="fas fa-image text-xl"></i>
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="w-full bg-gray-100 border-none rounded-full py-3 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={!novaMensagem.trim()}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                  novaMensagem.trim()
                    ? "bg-blue-600 text-white shadow-md active:scale-90"
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
