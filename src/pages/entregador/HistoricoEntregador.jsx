import { useState, useEffect, useRef } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { listarHistoricoEntregador } from "../../services/pedidoService";
import { toast } from "react-hot-toast";

export default function HistoricoEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState("Semana");
  const [corridasHistorico, setCorridasHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o "Ver Mais"
  const [isExpanded, setIsExpanded] = useState(false);
  const topoListaRef = useRef(null);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setLoading(true);
        const dados = await listarHistoricoEntregador();

        const formatados = dados.map((p) => ({
          id: p.id,
          data: new Date(p.criado_em).toLocaleDateString("pt-BR"),
          hora: new Date(p.criado_em).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: p.status === "ENTREGUE" ? "Concluído" : "Cancelado",
          valorGanho:
            p.status === "ENTREGUE" ? `AOA ${p.valor_sugerido}` : "AOA 0",
          origem: p.origem_endereco,
          destino: p.destino_endereco,
        }));

        setCorridasHistorico(formatados);
      } catch (error) {
        toast.error("Erro ao carregar histórico");
      } finally {
        setLoading(false);
      }
    }
    carregarHistorico();
  }, []);

  // Lógica de Expansão
  const registrosParaExibir = isExpanded
    ? corridasHistorico
    : corridasHistorico.slice(0, 6);

  function handleToggleVerMais() {
    if (isExpanded) {
      setIsExpanded(false);
      topoListaRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsExpanded(true);
    }
  }

  const resumoGanhos = {
    Semana: {
      total: `AOA ${corridasHistorico
        .filter((c) => c.status === "Concluído")
        .reduce(
          (acc, curr) =>
            acc +
            parseFloat(curr.valorGanho.replace("AOA ", "").replace(".", "")),
          0
        )}`,
      corridas: corridasHistorico.length,
    },
    Mês: { total: "AOA --", corridas: "--" },
    Total: { total: "AOA --", corridas: "--" },
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Referência para o Scroll ao "Ver Menos" */}
          <div
            ref={topoListaRef}
            className="h-16 w-full shrink-0 md:h-20"
          ></div>

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

            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Carregando histórico...
              </div>
            ) : (
              <>
                {registrosParaExibir.map((corrida) => (
                  <div
                    key={corrida.id}
                    className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 gap-4 transition-all hover:shadow-lg"
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
                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                      <p className="text-xl font-bold text-gray-900">
                        {corrida.valorGanho}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pedido #{corrida.id}
                      </p>
                    </div>
                  </div>
                ))}

                {/* BOTÃO VER MAIS / VER MENOS */}
                {corridasHistorico.length > 6 && (
                  <div className="pt-4">
                    <button
                      className={`w-full cursor-pointer py-4 border-2 border-dashed font-bold rounded-xl transition-all flex items-center justify-center gap-2 
                        ${
                          isExpanded
                            ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500"
                        }`}
                      onClick={handleToggleVerMais}
                    >
                      <i
                        className={`fas ${
                          isExpanded ? "fa-minus-circle" : "fa-plus-circle"
                        }`}
                      ></i>
                      {isExpanded ? "VER MENOS" : "VER MAIS HISTÓRICO"}
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && corridasHistorico.length === 0 && (
              <div className="bg-white p-10 rounded-xl text-center shadow-lg border-2 border-dashed border-gray-200">
                <i className="fas fa-history text-6xl text-gray-200 mb-4"></i>
                <p className="text-xl font-semibold text-gray-700">
                  Sem histórico disponível.
                </p>
              </div>
            )}

            {/* Contador de Registros */}
            {!loading && corridasHistorico.length > 0 && (
              <div className="flex justify-end pt-4 border-t border-gray-300">
                <p className="text-gray-600 text-sm">
                  Mostrando {registrosParaExibir.length} de{" "}
                  {corridasHistorico.length} corridas.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
