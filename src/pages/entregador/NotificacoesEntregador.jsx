import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  listarNotificacoes,
  marcarComoLida,
} from "../../services/notificacaoService"; // Importado aqui
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { toast } from "react-hot-toast";

export default function NotificacoesEntregador() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todasNotificacoes, setTodasNotificacoes] = useState([]);
  const [limiteExibicao, setLimiteExibicao] = useState(6);
  const [loading, setLoading] = useState(true);

  const carregarDados = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await listarNotificacoes();
      const dados = response.data.results || response.data;

      const filtradas = dados.filter(
        (n) => Number(n.usuario) === Number(user.id)
      );

      const ordenadas = filtradas.sort((a, b) => {
        return new Date(b.criado_em) - new Date(a.criado_em);
      });

      setTodasNotificacoes(ordenadas);
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // FUNÇÃO PARA MARCAR COMO LIDA
  // Dentro de NotificacoesEntregador
  const handleMarcarLida = async (id) => {
    try {
      // 1. Faz a chamada ao backend
      const response = await marcarComoLida(id);

      // 2. O Django REST costuma retornar 200 OK com o objeto atualizado
      if (response.status === 200 || response.status === 204) {
        // 3. Atualiza o estado local para garantir que a UI mude agora
        setTodasNotificacoes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
        );

        // 4. DISPARA EVENTO para o Header atualizar o contador vermelho imediatamente
        window.dispatchEvent(new Event("notificacaoAtualizada"));

        console.log(`Notificação ${id} marcada como lida com sucesso.`);
      }
    } catch (error) {
      console.error(
        "Erro detalhado ao marcar como lida:",
        error.response?.data || error.message
      );
      toast.error("Erro ao salvar status no servidor.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

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

  // Componente de Item Interno Atualizado
  const NotificationItem = ({
    id,
    isUnread,
    icon,
    color,
    title,
    time,
    mensagem,
    onMarkRead,
  }) => (
    <div
      onClick={() => isUnread && onMarkRead(id)} // Marca como lida ao clicar no card se estiver não lida
      className={`p-4 border-b border-gray-200 flex items-start gap-4 transition duration-150 cursor-pointer ${
        isUnread
          ? "bg-blue-50/70 hover:bg-blue-100/70"
          : "bg-white hover:bg-gray-50 opacity-80"
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
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita disparar o clique do card pai
            onMarkRead(id);
          }}
          className={`${
            isUnread ? "text-gray-400 hover:text-blue-600" : "text-green-500"
          } transition duration-150 p-1`}
          title="Marcar como lida"
        >
          <i
            className={`${
              isUnread ? "far fa-circle" : "fas fa-circle-check"
            } text-lg`}
          ></i>
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
                    {todasNotificacoes.length > 0
                      ? `Exibindo ${notificacoesVisiveis.length} de ${todasNotificacoes.length} notificações`
                      : "Nenhuma notificação encontrada"}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center text-blue-600">
                    <i className="fas fa-spinner fa-spin text-2xl"></i>
                  </div>
                ) : todasNotificacoes.length > 0 ? (
                  notificacoesVisiveis.map((n) => {
                    const estilo = configurarEstilo(n.tipo);
                    return (
                      <NotificationItem
                        key={n.id}
                        id={n.id}
                        isUnread={!n.lida}
                        icon={estilo.icon}
                        color={estilo.color}
                        title={n.titulo}
                        mensagem={n.mensagem}
                        time={new Date(n.criado_em).toLocaleString("pt-BR")}
                        onMarkRead={handleMarcarLida} // Passando a função
                      />
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500">Sem notificações</p>
                  </div>
                )}
              </div>

              {!loading && todasNotificacoes.length > limiteExibicao && (
                <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={carregarMais}
                    className="text-sm text-gray-500 hover:text-blue-600 font-bold py-2 px-4 transition duration-150"
                  >
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
