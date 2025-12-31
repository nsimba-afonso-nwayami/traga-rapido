import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import { listarPedidosPorSolicitante } from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService"; // Importado para buscar o nome

// MAPEAMENTO DE STATUS: Cores e Nomes amigáveis
const STATUS_MAP = {
  AGUARDANDO_PROPOSTAS: {
    label: "Aguardando Propostas",
    class: "bg-blue-500/20 text-blue-800",
  },
  PROPOSTA_ACEITA: {
    label: "Proposta Aceita",
    class: "bg-indigo-500/20 text-indigo-800",
  },
  ENTREGADOR_A_CAMINHO: {
    label: "Entregador a Caminho",
    class: "bg-yellow-500/20 text-yellow-800",
  },
  ITEM_RETIRADO: {
    label: "Item Retirado",
    class: "bg-orange-500/20 text-orange-800",
  },
  EM_ENTREGA: {
    label: "Em Rota de Entrega",
    class: "bg-purple-500/20 text-purple-800",
  },
  ENTREGUE: { label: "Entregue", class: "bg-green-500/20 text-green-800" },
  CANCELADO: { label: "Cancelado", class: "bg-red-500/20 text-red-800" },
};

const getStatusData = (status) => {
  return (
    STATUS_MAP[status] || {
      label: status,
      class: "bg-gray-500/20 text-gray-800",
    }
  );
};

export default function MeusPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);
  const topoListaRef = useRef(null);

  const { user } = useAuth();
  const SOLICITANTE_ID = user?.id;

  useEffect(() => {
    if (!SOLICITANTE_ID) return;

    async function carregarPedidos() {
      try {
        const meusPedidos = await listarPedidosPorSolicitante(SOLICITANTE_ID);

        // Enriquecer pedidos com o nome do entregador
        const pedidosComNomes = await Promise.all(
          meusPedidos.map(async (pedido) => {
            if (pedido.entregador && typeof pedido.entregador === "number") {
              try {
                const dadosEntregador = await getUsuario(pedido.entregador);
                return { ...pedido, nomeEntregador: dadosEntregador.username };
              } catch {
                return pedido;
              }
            }
            return pedido;
          })
        );

        pedidosComNomes.sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
        );
        setPedidos(pedidosComNomes);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        toast.error("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }
    carregarPedidos();
  }, [SOLICITANTE_ID]);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const busca = search.toLowerCase();
    const matchesSearch =
      (pedido.titulo || "").toLowerCase().includes(busca) ||
      (pedido.origem_endereco || "").toLowerCase().includes(busca) ||
      (pedido.destino_endereco || "").toLowerCase().includes(busca);

    const matchesStatus = statusFilter ? pedido.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

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

          {/* Filtros */}
          <div className="bg-white p-4 sm:p-6 border border-gray-300 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Filtrar Pedidos
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="relative w-full md:w-1/3 min-w-[200px] shrink-0">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por Título, Cidade ou Endereço..."
                  className="w-full p-2 pl-9 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <select
                className="w-full md:w-auto p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status (Todos)</option>
                {Object.keys(STATUS_MAP).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_MAP[key].label}
                  </option>
                ))}
              </select>

              <Link
                to="/dashboard/solicitante/novo-pedido"
                className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition duration-150 text-sm flex items-center justify-center 
                  ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
              >
                <i className="fas fa-plus-circle mr-2"></i> Novo Pedido
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow">
                Carregando...
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
                      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4
                            className="text-lg font-bold text-gray-800 truncate pr-2"
                            title={pedido.titulo}
                          >
                            {pedido.titulo}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${statusInfo.class}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 space-y-1 border-t pt-3">
                          <div className="flex items-center">
                            <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                            <span className="font-medium text-gray-700 mr-1">
                              Origem:
                            </span>{" "}
                            {pedido.origem_endereco}
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-map-marked-alt text-green-500 mr-2"></i>
                            <span className="font-medium text-gray-700 mr-1">
                              Destino:
                            </span>{" "}
                            {pedido.destino_endereco}
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-motorcycle text-blue-500 mr-2"></i>
                            <span className="font-medium text-gray-700 mr-1">
                              Entregador:
                            </span>{" "}
                            {/* EXIBIÇÃO DO NOME DO ENTREGADOR AQUI */}
                            <span
                              className={
                                pedido.nomeEntregador
                                  ? "text-blue-700 font-bold"
                                  : ""
                              }
                            >
                              {pedido.nomeEntregador || "Aguardando"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
                        <p className="text-xs text-gray-400">
                          {pedido.criado_em
                            ? format(new Date(pedido.criado_em), "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "N/A"}
                        </p>
                        <Link
                          to={`/dashboard/solicitante/detalhes-pedido/${pedido.id}`}
                          className="text-blue-700 hover:text-blue-500 text-base"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && pedidosFiltrados.length > 6 && (
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
                  {isExpanded ? "VER MENOS" : "VER MAIS PEDIDOS"}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-300 mb-6">
            <p className="text-gray-600 text-sm">
              Mostrando {registrosParaExibir.length} de{" "}
              {pedidosFiltrados.length} pedidos.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
