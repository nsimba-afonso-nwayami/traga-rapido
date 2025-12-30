import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import { listarPedidosPorSolicitante } from "../../services/pedidoService";

// MAPEAMENTO DE STATUS REAIS
const STATUS_MAP = {
  AGUARDANDO_PROPOSTAS: {
    label: "Aguardando Propostas",
    class: "bg-blue-100 text-blue-700",
  },
  PROPOSTA_ACEITA: {
    label: "Proposta Aceita",
    class: "bg-indigo-100 text-indigo-700",
  },
  ENTREGADOR_A_CAMINHO: {
    label: "Entregador a Caminho",
    class: "bg-yellow-100 text-yellow-700",
  },
  ITEM_RETIRADO: {
    label: "Item Retirado",
    class: "bg-orange-100 text-orange-700",
  },
  EM_ENTREGA: { label: "Em Entrega", class: "bg-purple-100 text-purple-700" },
  ENTREGUE: { label: "Entregue", class: "bg-green-100 text-green-700" },
  CANCELADO: { label: "Cancelado", class: "bg-red-100 text-red-700" },
};

const getStatusData = (status) => {
  return (
    STATUS_MAP[status] || {
      label: status || "Pendente",
      class: "bg-gray-100 text-gray-700",
    }
  );
};

export default function HistoricoPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Lógica de Expansão e Scroll
  const [isExpanded, setIsExpanded] = useState(false);
  const topoListaRef = useRef(null);

  const { user } = useAuth();
  const SOLICITANTE_ID = user?.id;

  useEffect(() => {
    if (!SOLICITANTE_ID) return;

    async function carregarPedidos() {
      try {
        const meusPedidos = await listarPedidosPorSolicitante(SOLICITANTE_ID);
        meusPedidos.sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
        );
        setPedidos(meusPedidos);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        toast.error("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }
    carregarPedidos();
  }, [SOLICITANTE_ID]);

  // Filtragem
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const busca = search.toLowerCase();
    const matchesSearch =
      (pedido.titulo || "").toLowerCase().includes(busca) ||
      (pedido.id || "").toString().includes(busca) ||
      (pedido.destino_endereco || "").toLowerCase().includes(busca);

    const matchesStatus = statusFilter ? pedido.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Limite de 6 registros iniciais
  const registrosParaExibir = isExpanded
    ? pedidosFiltrados
    : pedidosFiltrados.slice(0, 6);

  function handleToggleVerMais() {
    if (isExpanded) {
      setIsExpanded(false);
      topoListaRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsExpanded(true);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-100">
          <div ref={topoListaRef} className="h-20 w-full shrink-0"></div>

          {/* BARRA DE PESQUISA E FILTROS */}
          <div className="bg-white p-4 sm:p-6 border border-gray-300 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar por ID, título ou destino..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setIsExpanded(false);
                  }}
                />
              </div>
              <select
                className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setIsExpanded(false);
                }}
              >
                <option value="">Todos os Status</option>
                {Object.keys(STATUS_MAP).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_MAP[key].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTA DE CARDS */}
          {loading ? (
            <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow">
              Carregando pedidos...
            </p>
          ) : pedidosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow">
              Nenhum pedido encontrado.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrosParaExibir.map((pedido) => {
                const statusInfo = getStatusData(pedido.status);
                return (
                  <div
                    key={pedido.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-mono text-blue-600 font-bold">
                            {pedido.id}
                          </span>
                          <h4
                            className="font-bold text-gray-800 truncate w-40"
                            title={pedido.titulo}
                          >
                            {pedido.titulo}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p className="flex items-center">
                          <i className="fas fa-calendar-alt w-5 text-gray-400"></i>
                          {pedido.criado_em
                            ? format(new Date(pedido.criado_em), "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "N/A"}
                        </p>
                        <p className="flex items-center">
                          <i className="fas fa-map-marker-alt w-5 text-red-400"></i>{" "}
                          {pedido.origem_endereco}
                        </p>
                        <p className="flex items-center">
                          <i className="fas fa-flag w-5 text-green-400"></i>{" "}
                          {pedido.destino_endereco}
                        </p>
                        <p className="flex items-center font-bold text-gray-800">
                          <i className="fas fa-coins w-5 text-yellow-500"></i>{" "}
                          {pedido.valor_sugerido || "AOA 0.00"}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Link
                          to={`/dashboard/solicitante/detalhes-pedido/${pedido.id}`}
                          className="flex-1 py-2 bg-gray-50 text-blue-700 rounded-lg text-center text-xs font-bold hover:bg-blue-50 transition-colors"
                        >
                          <i className="fas fa-eye mr-1"></i> Detalhes
                        </Link>
                        {pedido.status === "ENTREGUE" && (
                          <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            <i className="fas fa-receipt mr-1"></i> Recibo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOTÃO VER MAIS / VER MENOS */}
          {!loading && pedidosFiltrados.length > 6 && (
            <div className="pt-4">
              <button
                className={`w-full py-4 border-2 border-dashed font-bold rounded-xl transition-all flex items-center justify-center gap-2 
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
                {isExpanded ? "VER MENOS" : "VER MAIS REGISTROS"}
              </button>
            </div>
          )}

          <footer className="text-center text-gray-400 text-xs pb-10">
            Mostrando {registrosParaExibir.length} de {pedidosFiltrados.length}{" "}
            registros.
          </footer>
        </main>
      </div>
    </div>
  );
}
