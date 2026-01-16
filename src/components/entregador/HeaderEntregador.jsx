import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { listarNotificacoes } from "../../services/notificacaoService";

export default function HeaderEntregador({
  sidebarOpen,
  setSidebarOpen,
  isOnline,
  setIsOnline,
}) {
  const location = useLocation();
  const { user } = useAuth();

  // Estado para armazenar a contagem de notificações não lidas
  const [unreadCount, setUnreadCount] = useState(0);

  // Função para buscar notificações (memorizada para evitar re-renderizações infinitas)
  const carregarNotificacoes = useCallback(async () => {
    // Só busca se o ID do usuário estiver disponível
    if (!user?.id) return;

    try {
      const response = await listarNotificacoes();
      const dados = response.data.results || response.data;

      // FILTRO: Apenas notificações que pertencem ao usuário logado E que não foram lidas
      const naoLidas = dados.filter(
        (n) =>
          Number(n.usuario) === Number(user.id) &&
          (n.lida === false || n.status === "NAO_LIDA")
      );

      setUnreadCount(naoLidas.length);
    } catch (error) {
      console.error("Erro ao buscar contagem de notificações:", error);
    }
  }, [user?.id]);

  // Efeito para carregar as notificações e configurar listeners
  useEffect(() => {
    carregarNotificacoes();

    // Escuta o evento global disparado quando uma notificação é marcada como lida
    window.addEventListener("notificacaoAtualizada", carregarNotificacoes);

    // Intervalo para verificar novos pedidos a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificacaoAtualizada", carregarNotificacoes);
    };
  }, [location.pathname, carregarNotificacoes]);

  // Títulos automáticos por rota
  const titles = {
    "/dashboard/entregador/": "Painel do Entregador",
    "/dashboard/entregador/mensagens/": "Mensagens",
    "/dashboard/entregador/mensagens/chat/": "Chat",
    "/dashboard/entregador/lista-pedidos": "Lista de Pedidos",
    "/dashboard/entregador/detalhes-corrida": "Detalhes da Corrida",
    "/dashboard/entregador/historico": "Histórico de Corridas",
    "/dashboard/entregador/notificacoes": "Notificações",
    "/dashboard/entregador/configuracoes": "Configurações",
  };

  // Ícones automáticos por rota
  const icons = {
    "/dashboard/entregador/": "fas fa-motorcycle",
    "/dashboard/entregador/mensagens/": "fas fa-message",
    "/dashboard/entregador/mensagens/chat/": "fas fa-message",
    "/dashboard/entregador/lista-pedidos": "fas fa-list",
    "/dashboard/entregador/detalhes-corrida": "fas fa-map-marker-alt",
    "/dashboard/entregador/historico": "fas fa-history",
    "/dashboard/entregador/notificacoes": "fas fa-bell",
    "/dashboard/entregador/configuracoes": "fas fa-cog",
  };

  const currentTitle = titles[location.pathname] || "Painel do Entregador";
  const currentIcon = icons[location.pathname] || "fas fa-motorcycle";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-blue-800/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-1001 shadow-md">
      {/* Botão Mobile */}
      <button
        className="md:hidden text-2xl text-white mr-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Título e ícone dinâmicos */}
      <div className="flex-1 flex items-center">
        <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center">
          <i className={`${currentIcon} mr-3 text-blue-400`}></i>
          <span className="truncate">{currentTitle}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Ícone Notificações com Contador Dinâmico */}
        <Link
          to="/dashboard/entregador/notificacoes"
          className="relative text-xl sm:text-2xl text-blue-400 hover:text-blue-300 transition-all"
        >
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Perfil */}
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80 hidden lg:block text-white truncate max-w-[150px]">
            {user?.email || "Entregador"}
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center border border-blue-400">
            <i className="fas fa-user text-white text-base"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
