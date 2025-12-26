import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import {
  listarPedidosPorSolicitante,
  eliminarPedido,
} from "../../services/pedidoService";

// Função utilitária para formatar o status com cor
const getStatusClasses = (status) => {
  switch (status) {
    case "Em Rota":
      return "bg-yellow-100 text-yellow-700";
    case "Concluído":
      return "bg-green-100 text-green-700";
    case "Cancelado":
      return "bg-red-100 text-red-700";
    case "Pendente":
    default:
      return "bg-blue-100 text-blue-700";
  }
};

export default function HistoricoPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useAuth();
  const SOLICITANTE_ID = user?.id;

  useEffect(() => {
    if (!SOLICITANTE_ID) return; // evita chamada se usuário não carregado

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

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja eliminar este pedido?")) return;

    try {
      await eliminarPedido(id);
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
      toast.success("Pedido eliminado com sucesso!");
    } catch (error) {
      console.error("Erro ao eliminar pedido:", error);
      toast.error("Não foi possível eliminar o pedido");
    }
  }

  // Filtrar e pesquisar pedidos
  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const busca = search.toLowerCase();
      const titulo = pedido.titulo?.toLowerCase() || "";
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
    <div className="min-h-screen flex bg-gray-100">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-8">
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os Status</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Rota">Em Rota</option>
              </select>
            </div>
          </div>

          {/* LISTA DE CARDS DE HISTÓRICO */}
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
              {pedidosFiltrados.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-mono text-blue-600 font-bold">
                          {pedido.id}
                        </span>
                        <h4 className="font-bold text-gray-800 truncate w-40">
                          {pedido.titulo}
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClasses(
                          pedido.status
                        )}`}
                      >
                        {pedido.status || "Pendente"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center">
                        <i className="fas fa-calendar-alt w-5 text-gray-400"></i>{" "}
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
                      <button className="flex-1 py-2 bg-gray-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                        <i className="fas fa-eye mr-1"></i> Detalhes
                      </button>
                      {pedido.status === "Concluído" && (
                        <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                          <i className="fas fa-receipt mr-1"></i> Recibo
                        </button>
                      )}
                      {pedido.status === "Pendente" && (
                        <button
                          className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                          onClick={() => handleDelete(pedido.id)}
                        >
                          <i className="fas fa-trash mr-1"></i> Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOTÃO VER MAIS */}
          {pedidosFiltrados.length > 0 && (
            <div className="pt-4">
              <button
                className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                onClick={() => toast("Carregando mais pedidos...")}
              >
                <i className="fas fa-plus-circle"></i>
                VER MAIS REGISTROS
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-gray-400 text-xs pb-10">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} registros.
          </footer>
        </main>
      </div>
    </div>
  );
}
