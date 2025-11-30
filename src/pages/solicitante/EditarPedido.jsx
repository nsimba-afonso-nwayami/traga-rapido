import { useState } from "react";
import { Link } from "react-router-dom";

export default function EditarPedido() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
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
          <Link
            to="/dashboard/solicitante/"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </Link>
          <Link
            to="/dashboard/solicitante/pedidos"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-box mr-3 text-blue-500"></i>
            Meus Pedidos
          </Link>
          <Link
            to="/dashboard/solicitante/novo-pedido"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i>
            Criar Novo Pedido
          </Link>
          <Link
            to="/dashboard/solicitante/historico"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-history mr-3 text-blue-500"></i>
            Histórico
          </Link>
          <Link
            to="/dashboard/solicitante/configuracoes"
            className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer"
          >
            <i className="fas fa-gear mr-3 text-blue-500"></i>
            Configurações
          </Link>
          <Link className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i>
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
        <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            Editar Pedido
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative text-xl sm:text-2xl text-blue-500 hover:text-blue-400 transition-all">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">
                Usuário
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN AREA - FORMULÁRIO SIMPLIFICADO */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-6 sm:p-8 space-y-8">
            <form className="space-y-6">
              {/* 1. TÍTULO DO PEDIDO */}
              <div className="space-y-1">
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título do Pedido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Ex: Documentos Urgentes, Pacote Pequeno"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 2. DESCRIÇÃO E INSTRUÇÕES */}
              <div className="space-y-1">
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição e Instruções Especiais{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descricao"
                  rows="4"
                  placeholder="Detalhe o conteúdo e as instruções de manuseio ou entrega (Ex: Frágil, Entregar no 3º andar, Somente para contato X)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <hr className="my-8 border-gray-200" />

              {/* 3. LOCAL DE ORIGEM (CAMPO SIMPLIFICADO) */}
              <div className="space-y-1">
                <label
                  htmlFor="origem"
                  className="block text-sm font-bold text-blue-700 items-center"
                >
                  <i className="fas fa-map-marker-alt mr-2"></i> Local de Origem{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="origem"
                  rows="3"
                  placeholder="Digite o endereço completo de origem (Rua, Número, Bairro, Cidade, CEP)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              {/* 4. LOCAL DE DESTINO (CAMPO SIMPLIFICADO) */}
              <div className="space-y-1">
                <label
                  htmlFor="destino"
                  className="block text-sm font-bold text-blue-700 items-center"
                >
                  <i className="fas fa-route mr-2"></i> Local de Destino{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="destino"
                  rows="3"
                  placeholder="Digite o endereço completo de destino (Rua, Número, Bairro, Cidade, CEP)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              {/* BOTÃO DE SUBMISSÃO */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center"
                >
                  <i className="fas fa-check-circle mr-3 text-lg"></i> Enviar
                  Pedido
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
