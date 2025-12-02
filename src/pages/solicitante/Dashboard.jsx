import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function DashboardSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {/* Header */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN AREA */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-8 sm:space-y-10">
          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* CARD 1 */}
            <div className="bg-white border border-gray-300 p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <i className="fas fa-box text-3xl sm:text-4xl text-blue-700 shrink-0"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  Título do Card
                </p>
                <h3 className="text-xl sm:text-2xl font-bold truncate">0</h3>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white border border-gray-300 p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <i className="fas fa-truck text-3xl sm:text-4xl text-blue-700 shrink-0"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  Título do Card
                </p>
                <h3 className="text-xl sm:text-2xl font-bold truncate">0</h3>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white border border-gray-300 p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <i className="fas fa-dollar-sign text-3xl sm:text-4xl text-blue-700 shrink-0"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  Título do Card
                </p>
                <h3 className="text-xl sm:text-2xl font-bold truncate">0</h3>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white border border-gray-300 p-4 rounded-xl shadow flex items-center gap-3 sm:gap-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
              <i className="fas fa-clock text-3xl sm:text-4xl text-blue-700 shrink-0"></i>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  Título do Card
                </p>
                <h3 className="text-xl sm:text-2xl font-bold truncate">0</h3>
              </div>
            </div>
          </div>

          {/* BARRA DE PESQUISA E FILTROS LAYOUT */}
          <div className="bg-white p-4 sm:p-6 border border-gray-300 rounded-xl shadow">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              {/* BARRA DE PESQUISA */}
              <div className="relative w-full sm:w-1/3 min-w-[200px] shrink-0">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  // Adicionar onChange e value aqui para conectar a lógica do React
                  placeholder="Buscar por Título ou Descrição..."
                  className="w-full p-2 pl-9 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* FILTROS (OPCIONAL) */}
              <select className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700">
                <option>Filtrar por Status</option>
                <option>Em andamento</option>
                <option>Pendente</option>
                <option>Concluído</option>
              </select>

              <button className="w-full sm:w-auto p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm">
                <i className="fas fa-filter mr-2"></i>
                Aplicar Filtro
              </button>
            </div>
          </div>
          {/* FIM BARRA DE PESQUISA */}

          {/* TABELA RESPONSIVA */}
          <div className="overflow-x-auto w-full border border-gray-300 rounded-xl shadow">
            <table className="min-w-[800px] w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300 text-sm">
                  <th className="p-3 text-left whitespace-nowrap">Título</th>
                  <th className="p-3 text-left whitespace-nowrap">Descrição</th>
                  <th className="p-3 text-left whitespace-nowrap">Origem</th>
                  <th className="p-3 text-left whitespace-nowrap">Destino</th>
                  <th className="p-3 text-left whitespace-nowrap">
                    Entregador
                  </th>
                  <th className="p-3 text-left whitespace-nowrap">Status</th>
                  <th className="p-3 text-center whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap">Pedido 1</td>
                  <td className="p-3 whitespace-nowrap">
                    Descrição do Pedido 1
                  </td>
                  <td className="p-3 whitespace-nowrap">Origem A</td>
                  <td className="p-3 whitespace-nowrap">Destino B</td>
                  <td className="p-3 whitespace-nowrap">Entregador 1</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-500/40 text-blue-800 rounded-full text-xs font-semibold">
                      Em andamento
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-400 text-base">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap">Pedido 2</td>
                  <td className="p-3 whitespace-nowrap">
                    Descrição do Pedido 2
                  </td>
                  <td className="p-3 whitespace-nowrap">Origem C</td>
                  <td className="p-3 whitespace-nowrap">Destino D</td>
                  <td className="p-3 whitespace-nowrap">Entregador 2</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-yellow-500/40 text-yellow-800 rounded-full text-xs font-semibold">
                      Pendente
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-400 text-base">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap">Pedido 3</td>
                  <td className="p-3 whitespace-nowrap">
                    Descrição do Pedido 3
                  </td>
                  <td className="p-3 whitespace-nowrap">Origem E</td>
                  <td className="p-3 whitespace-nowrap">Destino F</td>
                  <td className="p-3 whitespace-nowrap">Entregador 3</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-500/40 text-green-800 rounded-full text-xs font-semibold">
                      Concluído
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-blue-700 hover:text-blue-500 text-base">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-400 text-base">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 🔢 PAGINAÇÃO LAYOUT */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-300">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
              Mostrando 1 a 10 de 50 registros
            </p>
            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <button
                // Adicionar disabled={currentPage === 1} aqui para a lógica
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i> Anterior
              </button>
              {/* Botões de Página */}
              <button className="px-3 py-1 border rounded-lg text-sm bg-blue-600 text-white font-semibold">
                1
              </button>{" "}
              {/* Página Ativa */}
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
                3
              </button>
              {/* Botão Próximo */}
              <button
                // Adicionar disabled={currentPage === totalPages} aqui para a lógica
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
