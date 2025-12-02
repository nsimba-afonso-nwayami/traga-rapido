import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function HistoricoPedidos() {
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
                <option>Concluído</option>
                <option>Cancelado</option>
              </select>

              <button className="w-full sm:w-auto p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm">
                <i className="fas fa-filter mr-2"></i>
                Aplicar Filtro
              </button>
            </div>
          </div>

          {/* TABELA DE HISTÓRICO LAYOUT */}
          <div className="overflow-x-auto w-full border border-gray-300 rounded-xl shadow">
            <table className="min-w-[800px] w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300 text-sm">
                  <th className="p-3 text-left whitespace-nowrap">ID</th>
                  <th className="p-3 text-left whitespace-nowrap">Título</th>
                  <th className="p-3 text-left whitespace-nowrap">Origem</th>
                  <th className="p-3 text-left whitespace-nowrap">Destino</th>
                  <th className="p-3 text-left whitespace-nowrap">
                    Data Conclusão
                  </th>
                  <th className="p-3 text-left whitespace-nowrap">
                    Valor Final
                  </th>
                  <th className="p-3 text-left whitespace-nowrap">Status</th>
                  <th className="p-3 text-center whitespace-nowrap">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Linha de Exemplo 1 (Concluído) */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-700">
                    #1007
                  </td>
                  <td className="p-3 whitespace-nowrap font-semibold">
                    Entrega de Documentos
                  </td>
                  <td className="p-3 whitespace-nowrap">São Paulo/SP</td>
                  <td className="p-3 whitespace-nowrap">Rio de Janeiro/RJ</td>
                  <td className="p-3 whitespace-nowrap">2025-11-20</td>
                  <td className="p-3 whitespace-nowrap text-green-700 font-semibold">
                    R$ 55.00
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/40 text-green-800">
                      Concluído
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button
                      className="text-blue-700 hover:text-blue-500 text-base"
                      title="Ver Detalhes"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-base"
                      title="Gerar Recibo"
                    >
                      <i className="fas fa-receipt"></i>
                    </button>
                  </td>
                </tr>
                {/* Linha de Exemplo 2 (Cancelado) */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 whitespace-nowrap font-medium text-gray-700">
                    #1008
                  </td>
                  <td className="p-3 whitespace-nowrap font-semibold">
                    Entrega Cancelada
                  </td>
                  <td className="p-3 whitespace-nowrap">Salvador/BA</td>
                  <td className="p-3 whitespace-nowrap">Recife/PE</td>
                  <td className="p-3 whitespace-nowrap">2025-11-15</td>
                  <td className="p-3 whitespace-nowrap text-gray-500">
                    R$ 0.00
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/40 text-red-800">
                      Cancelado
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap flex justify-center gap-2">
                    <button
                      className="text-blue-700 hover:text-blue-500 text-base"
                      title="Ver Detalhes"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="text-gray-400 text-base cursor-not-allowed"
                      disabled
                      title="Recibo indisponível"
                    >
                      <i className="fas fa-receipt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO LAYOUT */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-300">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0">
              Mostrando 1 a 10 de X registros
            </p>
            <div className="flex items-center gap-2">
              {/* Botão Anterior */}
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50">
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
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50">
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
