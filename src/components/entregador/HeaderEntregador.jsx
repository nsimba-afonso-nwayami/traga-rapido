import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function HeaderEntregador({
  sidebarOpen,
  setSidebarOpen,
  isOnline,
  setIsOnline,
}) {

  const location = useLocation();
  const { user } = useAuth();

  // Títulos automáticos por rota
  const titles = {
    "/dashboard/entregador/": "Painel do Entregador",
    "/dashboard/entregador/lista-pedidos": "Lista de Pedidos",
    "/dashboard/entregador/detalhes-corrida": "Detalhes da Corrida",
    "/dashboard/entregador/historico": "Histórico de Corridas",
    "/dashboard/entregador/notificacoes": "Notificações",
    "/dashboard/entregador/configuracoes": "Configurações",
  };

  // Ícones automáticos por rota (Font Awesome)
  const icons = {
    "/dashboard/entregador/": "fas fa-motorcycle",
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

        {/* Ícone Notificações */}
        <Link
          to="/dashboard/entregador/notificacoes"
          className="relative text-xl sm:text-2xl text-blue-400 hover:text-blue-300 transition-all"
        >
          <i className="fas fa-bell"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </Link>

        {/* Avatar */}
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