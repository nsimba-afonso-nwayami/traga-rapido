import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function HeaderSolicitante({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user, loadingAuth } = useAuth(); // pega loadingAuth

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

  // Mostra "Carregando..." enquanto o AuthContext ainda inicializa
  if (loadingAuth) {
    return (
      <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
        <p className="text-white font-bold">Carregando...</p>
      </header>
    );
  }

  return (
    <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">

      {/* Botão abrir menu mobile */}
      <button
        className="md:hidden text-2xl text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Título + ícone automáticos */}
      <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white flex items-center">
        <i className={`${currentIcon} mr-2 text-blue-300`}></i>
        {currentTitle}
      </h2>

      <div className="flex items-center gap-4 sm:gap-6">

        {/* Notificações */}
        <Link
          to="/dashboard/solicitante/notificacoes"
          className="relative text-xl sm:text-2xl text-blue-300 hover:text-blue-200 transition-all"
        >
          <i className="fas fa-bell"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </Link>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80 hidden sm:block text-white">
            {user?.username || "Usuário"}
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-base"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
