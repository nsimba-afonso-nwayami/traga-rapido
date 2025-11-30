import { useState } from "react";

export default function MeusPedidos() {
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
          <a href="/dashboard/solicitante" className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </a>
          {/* Item Ativo - Meus Pedidos */}
          <a href="/dashboard/solicitante/pedidos" className="block p-3 rounded-lg bg-blue-500/40 font-bold cursor-pointer"> 
            <i className="fas fa-box mr-3 text-white"></i>
            Meus Pedidos
          </a>
          <a href="/dashboard/solicitante/novo-pedido" className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
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
        
        {/* HEADER */}
        <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            Meus Pedidos
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

        {/* MAIN AREA */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-8 sm:space-y-10">
          
          {/* BARRA DE PESQUISA E FILTROS LAYOUT */}
          <div className="bg-white p-4 sm:p-6 border border-gray-300 rounded-xl shadow">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                {/* BARRA DE PESQUISA */}
                <div className="relative w-full sm:w-1/3 min-w-[200px] shrink-0">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Buscar por Título ou Cidade..."
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* FILTROS (OPCIONAL) */}
                <select className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700">
                    <option>Filtrar por Status</option>
                    <option>Em Rota</option>
                    <option>Pendente</option>
                    <option>Concluído</option>
                </select>

                <button className="w-full sm:w-auto p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm">
                    <i className="fas fa-filter mr-2"></i>
                    Aplicar Filtro
                </button>
            </div>
          </div>

          {/* TABELA DE PEDIDOS LAYOUT */}
          <div className="overflow-x-auto w-full border border-gray-300 rounded-xl shadow">
            <table className="min-w-[800px] w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300 text-sm">
                  <th className="p-3 text-left whitespace-nowrap">ID</th>
                  <th className="p-3 text-left whitespace-nowrap">Título</th>
                  <th className="p-3 text-left whitespace-nowrap">Origem</th>
                  <th className="p-3 text-left whitespace-nowrap">Destino</th>
                  <th className="p-3 text-left whitespace-nowrap">Entregador</th>
                  <th className="p-3 text-left whitespace-nowrap">Status</th>
                  <th className="p-3 text-center whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Linha de Exemplo 1 (Em Andamento/Em Rota) */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-700">#1001</td>
                  <td className="p-3 whitespace-nowrap font-semibold">Documentos de Venda</td>
                  <td className="p-3 whitespace-nowrap">São Paulo/SP</td>
                  <td className="p-3 whitespace-nowrap">Rio de Janeiro/RJ</td>
                  <td className="p-3 whitespace-nowrap text-gray-600">Entregador Exemplo 1</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/40 text-blue-800">
                      Em Rota
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base" title="Ver Detalhes">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-base" title="Rastrear">
                      <i className="fas fa-map-marker-alt"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-400 text-base" title="Cancelar Pedido">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                {/* Linha de Exemplo 2 (Pendente) */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-700">#1002</td>
                  <td className="p-3 whitespace-nowrap font-semibold">Peça de Reposição Urgente</td>
                  <td className="p-3 whitespace-nowrap">Belo Horizonte/MG</td>
                  <td className="p-3 whitespace-nowrap">Curitiba/PR</td>
                  <td className="p-3 whitespace-nowrap text-gray-600">Aguardando</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/40 text-yellow-800">
                      Pendente
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base" title="Ver Detalhes">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-gray-400 text-base cursor-not-allowed" disabled title="Rastrear (Não disponível)">
                      <i className="fas fa-map-marker-alt"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-400 text-base" title="Cancelar Pedido">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                {/* Linha de Exemplo 3 (Concluído) */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-700">#1003</td>
                  <td className="p-3 whitespace-nowrap font-semibold">Entrega de Equipamento</td>
                  <td className="p-3 whitespace-nowrap">Campinas/SP</td>
                  <td className="p-3 whitespace-nowrap">Porto Alegre/RS</td>
                  <td className="p-3 whitespace-nowrap text-gray-600">Entregador Exemplo 2</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/40 text-green-800">
                      Concluído
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base" title="Ver Detalhes">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-base" title="Rastrear">
                      <i className="fas fa-map-marker-alt"></i>
                    </button>
                    <button className="text-gray-400 text-base cursor-not-allowed" disabled title="Cancelamento (Não permitido)">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* PAGINAÇÃO LAYOUT */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-300">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
                Mostrando 1 a 3 de X registros
            </p>
            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <button 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i> Anterior
              </button>
              
              {/* Botões de Página */}
              <button className="px-3 py-1 border rounded-lg text-sm bg-blue-600 text-white font-semibold">1</button> {/* Página Ativa */}
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200">3</button>
              
              {/* Botão Próximo */}
              <button 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                Próximo <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          {/* FIM PAGINAÇÃO */}

        </main>
      </div>
    </div>
  );
}