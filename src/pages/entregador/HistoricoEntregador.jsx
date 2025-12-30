import { useState } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function HistoricoEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState("Semana");

  const corridasHistorico = [
    {
      id: "998",
      data: "2025-11-29",
      hora: "15:30",
      status: "Concluído",
      valorGanho: "AOA 1.500",
      origem: "Av. Brasil, 45",
      destino: "Rua do Porto, 102",
    },
    {
      id: "997",
      data: "2025-11-28",
      hora: "11:05",
      status: "Concluído",
      valorGanho: "AOA 2.100",
      origem: "Largo da Sé, 1",
      destino: "Condomínio Kimbango, Bloco C",
    },
    {
      id: "996",
      data: "2025-11-28",
      hora: "09:20",
      status: "Concluído",
      valorGanho: "AOA 1.250",
      origem: "Mercado Central",
      destino: "Bairro Novo, Casa 22",
    },
    {
      id: "995",
      data: "2025-11-27",
      hora: "20:45",
      status: "Cancelado (Origem)",
      valorGanho: "AOA 0",
      origem: "Zona Industrial",
      destino: "Centro da Cidade",
    },
  ];

  const resumoGanhos = {
    Semana: { total: "AOA 7.800", corridas: 12 },
    Mês: { total: "AOA 45.200", corridas: 75 },
    Total: { total: "AOA 150.900", corridas: 250 },
  };

  const ganhosAtuais = resumoGanhos[filtroPeriodo] || resumoGanhos["Semana"];

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative overflow-hidden">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Ajuste de Scroll e preenchimento para não ser cortado pelo Header */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ESPAÇADOR MANUAL PARA O HEADER */}
          <div className="h-16 w-full shrink-0 md:h-20"></div>

          {/* 1. FILTRO E RESUMO */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-800">
                Resumo de Ganhos
              </h3>

              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                {["Semana", "Mês", "Total"].map((periodo) => (
                  <button
                    key={periodo}
                    onClick={() => setFiltroPeriodo(periodo)}
                    className={`flex-1 sm:flex-none px-3 py-1 text-sm font-semibold rounded-md transition-all ${
                      filtroPeriodo === periodo
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {periodo}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  Ganhos de {filtroPeriodo}
                </p>
                <p className="text-3xl font-extrabold text-green-800 mt-1">
                  {ganhosAtuais.total}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  Corridas {filtroPeriodo}
                </p>
                <p className="text-3xl font-extrabold text-blue-800 mt-1">
                  {ganhosAtuais.corridas}
                </p>
              </div>
            </div>
          </section>

          {/* 2. LISTA DE CORRIDAS DETALHADA */}
          <section className="space-y-4 pb-10">
            <h3 className="text-xl font-bold text-gray-800">
              <i className="fas fa-list-alt mr-2 text-gray-500"></i> Detalhes
              das Corridas
            </h3>

            {corridasHistorico.map((corrida) => (
              <div
                key={corrida.id}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 gap-4"
                style={{
                  borderColor:
                    corrida.status === "Concluído" ? "#10B981" : "#EF4444",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center text-sm font-semibold flex-wrap gap-2">
                    <span className="text-gray-500">
                      {corrida.data} | {corrida.hora}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        corrida.status === "Concluído"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {corrida.status}
                    </span>
                  </div>

                  <p className="mt-2 text-base text-gray-700 wrap-break-word">
                    <i className="fas fa-map-marker-alt mr-1 text-xs text-blue-500"></i>{" "}
                    {corrida.origem}
                    <i className="fas fa-long-arrow-alt-right mx-2 text-gray-400"></i>{" "}
                    {corrida.destino}
                  </p>
                </div>

                {/* Valor Ganho - Ajustado para empilhar e alinhar à esquerda no mobile */}
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                  <p className="text-xl font-bold text-gray-900">
                    {corrida.valorGanho}
                  </p>
                  <p className="text-xs text-gray-500">Pedido #{corrida.id}</p>
                </div>
              </div>
            ))}

            {corridasHistorico.length === 0 && (
              <div className="bg-white p-10 rounded-xl text-center shadow-lg border-2 border-dashed border-gray-200">
                <i className="fas fa-history text-6xl text-gray-200 mb-4"></i>
                <p className="text-xl font-semibold text-gray-700">
                  Sem histórico disponível.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
