import { useState } from "react";

export default function NotFoundSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR (Mantida) */}
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
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-box mr-3 text-blue-500"></i>
            Meus Pedidos
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i>
            Criar Novo Pedido
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-history mr-3 text-blue-500"></i>
            Histórico
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-gear mr-3 text-blue-500"></i>
            Configurações
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i>
            Logout
          </a>
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
        
        {/* HEADER (Mantido) */}
        <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            Página Não Encontrada (404)
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
             <button className="relative text-xl sm:text-2xl text-blue-500 hover:text-blue-400 transition-all">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">Usuário</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN AREA - NOT FOUND (404) */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center p-8 max-w-lg w-full bg-white border border-gray-300 rounded-xl shadow-xl">
            
            <i className="fas fa-exclamation-circle text-red-500 text-6xl mb-4 animate-pulse"></i>
            
            <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest mt-4 mb-2">
              404
            </h1>
            
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Página Não Encontrada
            </h2>
            
            <p className="text-gray-500 mb-8">
              Parece que você tentou acessar uma rota que não existe no painel do solicitante.
              Verifique o endereço ou volte para o Dashboard.
            </p>
            
            {/* Botão de Navegação para o Dashboard */}
            <a 
              href="/solicitante/dashboard" // Usar a rota real do dashboard aqui
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02]"
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Voltar para o Dashboard
            </a>
            
          </div>
        </main>
      </div>
    </div>
  );
}