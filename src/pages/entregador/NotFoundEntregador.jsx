import { useState } from "react";
import { Link } from "react-router-dom";

export default function NotFoundEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline] = useState(false); // Mantém o status mockado para o header

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ASIDE (SIDEBAR) */}
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
          {/* Item Ativo - Dashboard */}
          <Link
            to="/dashboard/entregador/"
            className="block p-3 rounded-lg bg-blue-600/60 font-bold cursor-pointer transition-colors"
          >
            <i className="fas fa-tachometer-alt mr-3 text-white"></i>
            Dashboard
          </Link>
          {/* Novos Itens de Fluxo de Entrega */}
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
            Detalhes da Corrida c/ Mapa
          </Link>
          <hr className="border-blue-700 my-4" /> {/* Separador */}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {/* HEADER */}
        <header className="bg-blue-800/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            <i className="fas fa-exclamation-triangle mr-2 text-red-400"></i>{" "}
            Erro 404: Página Não Encontrada
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/dashboard/entregador/notificacoes"
              className="relative text-xl sm:text-2xl text-blue-400 hover:text-blue-300 transition-all"
            >
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            <div
              className={`p-1.5 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              } transition-colors duration-300 hidden sm:block`}
            >
              <span className="text-xs font-bold text-white">
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">
                Luiz (Entregador)
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN AREA - 404 CONTENT */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="text-center max-w-lg bg-white p-10 rounded-xl shadow-2xl">
            {/* Ícone e Título de Erro */}
            <div className="relative mb-6">
              <i className="fas fa-motorcycle text-8xl text-blue-500 opacity-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -z-10"></i>
              <h1 className="text-8xl font-extrabold text-gray-900 tracking-wider">
                404
              </h1>
            </div>

            {/* Mensagem Principal */}
            <p className="text-2xl font-bold tracking-tight mb-4 text-gray-800">
              Página Não Encontrada
            </p>

            <p className="text-md text-gray-600 mb-8">
              A rota que você tentou acessar não existe. Por favor, volte ao
              painel principal para continuar suas entregas.
            </p>

            {/* Botão de Navegação */}
            <a
              href="/dashboard/entregador" // Link para o Dashboard
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 transition duration-150 transform hover:scale-[1.02]"
            >
              <i className="fas fa-arrow-left mr-3"></i>
              Voltar para o Dashboard
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
