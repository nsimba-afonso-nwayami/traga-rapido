import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import { listarPedidosPorSolicitante } from "../../services/pedidoService";

// Função utilitária para formatar o status com cor
const getStatusClasses = (status) => {
  switch (status) {
    case "Em Rota":
      return "bg-yellow-500/20 text-yellow-800";
    case "Concluído":
      return "bg-green-500/20 text-green-800";
    case "Cancelado":
      return "bg-red-500/20 text-red-800";
    case "Pendente":
    default:
      return "bg-blue-500/20 text-blue-800";
  }
};

export default function MeusPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useAuth(); //
  const SOLICITANTE_ID = user?.id;

  // Simula um estado para controlar se há mais a carregar (para fins de UI)
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!SOLICITANTE_ID) return; // evita chamada se usuário ainda não estiver carregado

    async function carregarPedidos() {
      try {
        const meusPedidos = await listarPedidosPorSolicitante(SOLICITANTE_ID);
        meusPedidos.sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
        );
        setPedidos(meusPedidos);
        setHasMore(meusPedidos.length >= 2);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        toast.error("Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }

    carregarPedidos();
  }, [SOLICITANTE_ID]);

  // Função fictícia para simular o clique do "Ver Mais"
  function handleVerMais() {
    toast.success("Simulando o carregamento de mais pedidos...");
    // Aqui viria a lógica real para buscar a próxima página de pedidos
    // Por exemplo: loadNextPageOfPedidos(SOLICITANTE_ID, currentPage + 1);
  }

  // Filtrar e pesquisar pedidos
  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const busca = search.toLowerCase();
      const titulo = pedido.titulo.toLowerCase();
      const origem = (pedido.origem_endereco || "").toLowerCase();
      const destino = (pedido.destino_endereco || "").toLowerCase();
      const entregador = (pedido.entregador || "").toLowerCase();

      const matchesSearch =
        titulo.includes(busca) ||
        origem.includes(busca) ||
        destino.includes(busca) ||
        entregador.includes(busca);

      const matchesStatus = statusFilter
        ? (pedido.status || "Pendente") === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

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

        {/* ÁREA DE CONTEÚDO COM ROLAGEM INDEPENDENTE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-100">
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-20 w-full shrink-0"></div>

          {/* Barra de pesquisa e filtros */}
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
                  placeholder="Buscar por Título, Cidade ou Entregador..."
                  className="w-full p-2 pl-9 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <select
                className="w-full md:w-auto p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status (Todos)</option>
                <option value="Em Rota">Em Rota</option>
                <option value="Pendente">Pendente</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <Link
                to="/dashboard/solicitante/novo-pedido"
                className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition duration-150 text-sm flex items-center justify-center 
                  ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }
                `}
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Novo Pedido
              </Link>
            </div>
          </div>

          {/* Lista de Cards de Pedidos */}
          <div className="space-y-4">
            {loading && (
              <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow">
                Carregando seus pedidos de entrega...
              </p>
            )}

            {!loading && pedidosFiltrados.length === 0 && (
              <p className="text-center text-gray-500 p-8 bg-white rounded-xl shadow">
                Nenhum pedido de entrega encontrado com os filtros aplicados.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pedidosFiltrados.map((pedido) => (
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
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusClasses(
                          pedido.status || "Pendente"
                        )}`}
                      >
                        {pedido.status || "Pendente"}
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
                        {pedido.entregador || "Aguardando"}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
                    <p className="text-xs text-gray-400">
                      Criado em:{" "}
                      {pedido.criado_em
                        ? format(new Date(pedido.criado_em), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        : "N/A"}
                    </p>
                    <Link
                      to={`/dashboard/solicitante/detalhes-pedido/${pedido.id}`}
                      className="text-blue-700 hover:text-blue-500 text-base"
                      title="Ver Detalhes do Pedido"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {!loading && pedidosFiltrados.length > 0 && hasMore && (
              <div className="pt-4">
                <button
                  className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                  onClick={handleVerMais}
                >
                  <i className="fas fa-plus-circle"></i>
                  VER MAIS PEDIDOS
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-300 mb-6">
            <p className="text-gray-600 text-sm">
              Mostrando {pedidosFiltrados.length} pedidos.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
