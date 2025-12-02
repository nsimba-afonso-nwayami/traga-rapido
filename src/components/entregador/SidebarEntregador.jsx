import { Link } from "react-router-dom";

export default function SidebarEntregador({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <aside
        className={`
          bg-blue-800/90 backdrop-blur-sm border-r border-blue-700
          w-64 fixed top-0 left-0 h-screen p-6 shadow-xl
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-9999
        `}
      >
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
            to="/dashboard/entregador/"
            className="block p-3 rounded-lg bg-blue-600/60 font-bold cursor-pointer transition-colors"
          >
            <i className="fas fa-tachometer-alt mr-3 text-white"></i>
            Dashboard
          </Link>

          <Link
            to="/dashboard/entregador/lista-pedidos"
            className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors"
          >
            <i className="fas fa-list-ul mr-3 text-blue-400"></i>
            Lista de Pedidos
          </Link>

          <Link
            to="/dashboard/entregador/detalhes-corrida"
            className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors"
          >
            <i className="fas fa-route mr-3 text-blue-400"></i>
            Detalhes da Corrida
          </Link>

          <hr className="border-blue-700 my-4" />

          <Link
            to="/dashboard/entregador/historico"
            className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors"
          >
            <i className="fas fa-history mr-3 text-blue-400"></i>
            Histórico
          </Link>

          <Link
            to="/dashboard/entregador/configuracoes"
            className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors"
          >
            <i className="fas fa-gear mr-3 text-blue-400"></i>
            Configurações
          </Link>

          <Link className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-sign-out-alt mr-3 text-blue-400"></i>
            Logout
          </Link>
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
