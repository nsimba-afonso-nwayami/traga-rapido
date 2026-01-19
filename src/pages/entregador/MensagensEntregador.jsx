import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { listarPedidosDisponiveis } from "../../services/pedidoService";
import { buscarMensagensPorPedido } from "../../services/mensagensService";
import { getUsuario } from "../../services/usuarioService";

export default function MensagensEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limiteExibicao, setLimiteExibicao] = useState(6);
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const todosPedidos = await listarPedidosDisponiveis();

        // Filtra pedidos vinculados a este entregador
        const meusPedidosComChat = todosPedidos.filter(
          (p) => String(p.entregador) === String(userId),
        );

        const listaFormatada = [];

        // Loop para processar os chats
        for (const pedido of meusPedidosComChat) {
          try {
            const msgs = await buscarMensagensPorPedido(pedido.id);

            // SÓ CRIA O CARD SE HOUVER MENSAGENS REAIS
            if (msgs && msgs.length > 0) {
              const solicitante = await getUsuario(pedido.solicitante);
              const ultimaMsg = msgs[msgs.length - 1];

              listaFormatada.push({
                id: pedido.id,
                nome: solicitante.username || "Solicitante",
                ultimaMensagem: ultimaMsg.texto,
                horario: ultimaMsg.criado_em
                  ? new Date(ultimaMsg.criado_em).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
                naoLidas: 0,
              });
            }
          } catch (err) {
            console.error("Erro ao carregar detalhes do chat:", pedido.id);
          }
        }

        setConversas(listaFormatada);
      } catch (error) {
        console.error("Erro ao carregar mensagens do entregador:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const conversasFiltradas = conversas.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase()),
  );

  const conversasVisiveis = conversasFiltradas.slice(0, limiteExibicao);

  const carregarMais = () => {
    setLimiteExibicao((prev) => prev + 6);
  };

  const ChatItem = ({ chat }) => (
    <Link
      to={`/dashboard/entregador/mensagens/chat/${chat.id}`}
      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 group"
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {chat.nome.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {chat.nome}
          </h4>
          <span className="text-xs text-gray-500">{chat.horario}</span>
        </div>
        <p className="text-sm text-gray-600 truncate flex items-center">
          <i className="fas fa-check-double text-blue-400 text-xs mr-1"></i>
          {chat.ultimaMensagem}
        </p>
      </div>
    </Link>
  );

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

        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6 pb-10">
          <div className="h-20 w-full shrink-0"></div>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 px-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Minhas Conversas
              </h2>
              <p className="text-sm text-gray-500">
                Fale com os solicitantes responsáveis pelos pedidos aceitos
              </p>
            </div>

            <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="relative w-full max-w-xs">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Buscar solicitante..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Carregando conversas...
                  </div>
                ) : conversasFiltradas.length > 0 ? (
                  conversasVisiveis.map((chat) => (
                    <ChatItem key={chat.id} chat={chat} />
                  ))
                ) : (
                  /* ESTADO VAZIO IDENTICO À IMAGEM 136 */
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <i className="fas fa-comments text-2xl text-gray-300"></i>
                    </div>
                    <p className="text-gray-500 font-medium">
                      Nenhum solicitante contactado ainda.
                    </p>
                  </div>
                )}
              </div>

              {/* BOTÃO DE CONVERSAS ANTERIORES */}
              {conversasFiltradas.length > limiteExibicao && (
                <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={carregarMais}
                    className="text-sm text-gray-500 hover:text-blue-600 font-bold py-2 px-4 transition duration-150 flex items-center gap-2"
                  >
                    <i className="fas fa-history text-xs"></i>
                    Ver conversas anteriores
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
