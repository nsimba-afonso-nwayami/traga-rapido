import { useState, useEffect } from "react";
import { listarNotificacoes } from "../../services/notificacaoService";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function NotificacoesSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ESTADOS
  const [todasNotificacoes, setTodasNotificacoes] = useState([]); // Armazena o "grosso" dos dados
  const [limiteExibicao, setLimiteExibicao] = useState(6); // Começa exibindo 6
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const response = await listarNotificacoes();
        const dados = response.data.results || response.data;

        // Ordenamos tudo do mais recente para o mais antigo uma única vez
        const ordenadas = dados.sort((a, b) => {
          return new Date(b.criado_em) - new Date(a.criado_em);
        });

        setTodasNotificacoes(ordenadas);
      } catch (error) {
        console.error("Erro ao carregar notificações", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Aqui aplicamos o SLICE para pegar do índice 0 até o limite atual (6, 12, 18...)
  const notificacoesVisiveis = todasNotificacoes.slice(0, limiteExibicao);

  const carregarMais = () => {
    setLimiteExibicao((prev) => prev + 6);
  };

  const configurarEstilo = (tipo) => {
    switch (tipo) {
      case "SUCESSO":
        return { icon: "check-circle", color: "bg-green-600" };
      case "ALERTA":
        return { icon: "exclamation-triangle", color: "bg-yellow-600" };
      case "ERRO":
        return { icon: "times-circle", color: "bg-red-600" };
      default:
        return { icon: "box", color: "bg-blue-600" };
    }
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
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante
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
                    Exibindo {notificacoesVisiveis.length} de{" "}
                    {todasNotificacoes.length} notificações
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {notificacoesVisiveis.map((n) => {
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
                })}
                {loading && (
                  <div className="p-6 text-center text-blue-600">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                )}
              </div>

              {/* O botão só aparece se houver mais notificações para "fatiar" */}
              {todasNotificacoes.length > limiteExibicao && (
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
