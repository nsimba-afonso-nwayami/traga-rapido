import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SidebarSolicitante({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();

  return (
    <>
      <aside
        className={`
          bg-blue-700/90 backdrop-blur-xl border-r border-blue-700
          w-64 fixed top-0 left-0 h-screen p-6 shadow-xl
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-9999
        `}
      >
        {/* Botão para fechar no mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-2xl text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>

        <h1 className="text-2xl font-bold mb-10 tracking-wide mt-6 md:mt-0 text-white">
          TRAGA<span className="text-blue-500">Rápido</span>
        </h1>

        <nav className="space-y-4 text-lg text-white">
          <Link
            to="/dashboard/solicitante/"
            className="block p-3 rounded-lg hover:bg-blue-500/40"
          >
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </Link>

          <Link
            to="/dashboard/solicitante/pedidos"
            className="block p-3 rounded-lg hover:bg-blue-500/40"
          >
            <i className="fas fa-box mr-3 text-blue-500"></i>
            Meus Pedidos
          </Link>

          <Link
            to="/dashboard/solicitante/novo-pedido"
            className="block p-3 rounded-lg hover:bg-blue-500/40"
          >
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i>
            Criar Novo Pedido
          </Link>

          <Link
            to="/dashboard/solicitante/historico"
            className="block p-3 rounded-lg hover:bg-blue-500/40"
          >
            <i className="fas fa-history mr-3 text-blue-500"></i>
            Histórico
          </Link>

          <Link
            to="/dashboard/solicitante/configuracoes"
            className="block p-3 rounded-lg hover:bg-blue-500/40"
          >
            <i className="fas fa-gear mr-3 text-blue-500"></i>
            Configurações
          </Link>

          <button
            onClick={logout}
            className="w-full text-left block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i>
            Logout
          </button>
        </nav>
      </aside>

      {/* BACKDROP MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-9000"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
