import { useState, useEffect } from "react";
import { listarNotificacoes } from "../../services/notificacaoService";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotificacoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limiteExibicao, setLimiteExibicao] = useState(6);

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        setLoading(true);
        const response = await listarNotificacoes();
        // Ordenação: Mais recente primeiro
        const listaOrdenada = [...response.data].sort((a, b) => {
          return new Date(b.criado_em) - new Date(a.criado_em);
        });
        setNotificacoes(listaOrdenada);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        toast.error("Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    }
    carregarNotificacoes();
  }, []);

  const configurarEstilo = (tipo) => {
    switch (tipo) {
      case "SUCESSO":
        return { icon: "check-circle", color: "bg-green-600" };
      case "ALERTA":
        return { icon: "exclamation-triangle", color: "bg-yellow-600" };
      case "ERRO":
        return { icon: "times-circle", color: "bg-red-600" };
      default:
        return { icon: "bell", color: "bg-blue-600" };
    }
  };

  const notificacoesVisiveis = notificacoes.slice(0, limiteExibicao);

  const carregarMais = () => {
    setLimiteExibicao((prev) => prev + 6);
  };

  const NotificationItem = ({
    isUnread,
    icon,
    color,
    title,
    time,
    mensagem,
  }) => (
    <div
      className={`p-4 border-b border-gray-200 flex items-start gap-4 transition duration-150 ${
        isUnread
          ? "bg-blue-50/70 hover:bg-blue-100/70"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color} shadow-sm`}
      >
        <i className={`fas fa-${icon} text-white text-sm`}></i>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold truncate ${
            isUnread ? "text-gray-900" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-600 mt-0.5">{mensagem}</p>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <i className="far fa-clock mr-1"></i> {time}
        </p>
      </div>

      <div className="flex flex-col items-center shrink-0 gap-2">
        {isUnread && (
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
        )}
        <button className="text-gray-400 hover:text-blue-600 transition duration-150 p-1">
          <i className="far fa-circle-check text-lg"></i>
        </button>
      </div>
    </div>
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Centro de Notificações
                  </h3>
                  <p className="text-xs text-gray-500">
                    Acompanhe seus alertas e atualizações
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-10 text-center text-blue-600">
                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                  </div>
                ) : notificacoes.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-bell-slash text-4xl mb-3 block opacity-20"></i>
                    Nenhuma notificação por aqui.
                  </div>
                ) : (
                  notificacoesVisiveis.map((n) => {
                    const estilo = configurarEstilo(n.tipo);
                    return (
                      <NotificationItem
                        key={n.id}
                        isUnread={!n.lida}
                        icon={estilo.icon}
                        color={estilo.color}
                        title={n.titulo}
                        mensagem={n.mensagem}
                        time={new Date(n.criado_em).toLocaleString("pt-BR")}
                      />
                    );
                  })
                )}
              </div>

              {!loading && notificacoes.length > limiteExibicao && (
                <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={carregarMais}
                    className="text-sm text-gray-500 hover:text-blue-600 font-bold py-2 px-4 transition duration-150 flex items-center gap-2"
                  >
                    <i className="fas fa-history text-xs"></i>
                    Ver notificações mais antigas
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
