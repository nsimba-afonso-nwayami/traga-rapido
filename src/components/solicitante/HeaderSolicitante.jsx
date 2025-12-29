import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function HeaderSolicitante({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user } = useAuth();

  // Títulos automáticos por rota
  const titles = {
    "/dashboard/solicitante/": "Painel do Solicitante",
    "/dashboard/solicitante/pedidos": "Meus Pedidos",
    "/dashboard/solicitante/novo-pedido": "Criar Novo Pedido",
    "/dashboard/solicitante/editar-pedido": "Editar Pedido",
    "/dashboard/solicitante/detalhes-pedido": "Detalhes do Pedido",
    "/dashboard/solicitante/historico": "Histórico de Pedidos",
    "/dashboard/solicitante/configuracoes": "Configurações",
    "/dashboard/solicitante/notificacoes": "Notificações",
  };

  // Ícones automáticos
  const icons = {
    "/dashboard/solicitante/": "fas fa-user",
    "/dashboard/solicitante/pedidos": "fas fa-box",
    "/dashboard/solicitante/novo-pedido": "fas fa-plus-circle",
    "/dashboard/solicitante/editar-pedido": "fas fa-edit",
    "/dashboard/solicitante/detalhes-pedido": "fas fa-receipt",
    "/dashboard/solicitante/historico": "fas fa-history",
    "/dashboard/solicitante/configuracoes": "fas fa-cog",
    "/dashboard/solicitante/notificacoes": "fas fa-bell",
  };

  const currentTitle = titles[location.pathname] || "Painel do Solicitante";
  const currentIcon = icons[location.pathname] || "fas fa-user";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-1001 shadow-md">
      {/* Botão abrir menu mobile */}
      <button
        className="md:hidden text-2xl text-white mr-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Título + ícone automáticos */}
      <div className="flex-1 flex items-center">
        <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center">
          <i className={`${currentIcon} mr-3 text-blue-300`}></i>
          <span className="truncate">{currentTitle}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notificações */}
        <Link
          to="/dashboard/solicitante/notificacoes"
          className="relative text-xl sm:text-2xl text-blue-300 hover:text-white transition-all"
        >
          <i className="fas fa-bell"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </Link>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80 hidden lg:block text-white truncate max-w-[150px]">
            {user?.email || "Usuário"}
          </span>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center border border-blue-400">
            <i className="fas fa-user text-white"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
