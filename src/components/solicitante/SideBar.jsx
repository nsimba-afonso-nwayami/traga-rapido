import { Link } from "react-router-dom";

export default function SideBar() {
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
          <a
            href="/dashboard/solicitante/"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </a>
          <a
            href="/dashboard/solicitante/pedidos"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-box mr-3 text-blue-500"></i>
            Meus Pedidos
          </a>
          <a
            href="/dashboard/solicitante/novo-pedido"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i>
            Criar Novo Pedido
          </a>
          <a
            href="/dashboard/solicitante/historico"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-history mr-3 text-blue-500"></i>
            Histórico
          </a>
          <a
            href="/dashboard/solicitante/configuracoes"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-gear mr-3 text-blue-500"></i>
            Configurações
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i>
            Logout
          </a>
        </nav>
      </aside>
    </>
  );
}
