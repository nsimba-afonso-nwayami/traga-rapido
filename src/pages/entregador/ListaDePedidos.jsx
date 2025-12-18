import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { listarPedidos, aceitarPedido } from "../../services/pedidoService";
import { useAuth } from "../../contexts/AuthContext";

export default function ListaDePedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aceitandoId, setAceitandoId] = useState(null);

  // Pegando o usuário logado do AuthContext
  const { user } = useAuth();
  const idEntregador = user?.id;

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const response = await listarPedidos();
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        toast.error("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    }

    if (idEntregador) fetchPedidos();
  }, [idEntregador]);

  async function handleAceitar(pedidoId) {
    if (!idEntregador) {
      toast.error("ID do entregador não definido.");
      return;
    }

    const toastId = toast.loading("Aceitando pedido...");
    setAceitandoId(pedidoId);

    try {
      await aceitarPedido(pedidoId, idEntregador);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      toast.success("Pedido aceito com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error);
      toast.error("Não foi possível aceitar o pedido.", { id: toastId });
    } finally {
      setAceitandoId(null);
    }
  }

  // Ordena os pedidos do mais recente para o mais antigo
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarEntregador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {loading && <p className="text-center text-gray-500">Carregando pedidos...</p>}

            {!loading && pedidosOrdenados.length > 0 &&
              pedidosOrdenados.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-blue-600"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Informações do pedido */}
                    <div className="flex justify-between items-start border-b pb-3 mb-3">
                      <div>
                        <h4 className="text-xl font-extrabold text-gray-900">{pedido.titulo}</h4>
                        <p className="text-xs text-gray-500">Pedido #{pedido.id}</p>
                        {pedido.descricao && <p className="text-sm text-gray-600 mt-1">{pedido.descricao}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {pedido.valor_sugerido ? `AOA ${pedido.valor_sugerido}` : "-"}
                        </p>
                        <p className="text-xs text-gray-400">Valor Estimado</p>
                      </div>
                    </div>

                    {/* Endereços */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <i className="fas fa-location-arrow mr-3 text-blue-500"></i>
                        <div>
                          <p className="font-semibold text-gray-700">Origem:</p>
                          <p className="text-gray-600">{pedido.origem_endereco}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="fas fa-map-marker-alt mr-3 text-red-500"></i>
                        <div>
                          <p className="font-semibold text-gray-700">Destino:</p>
                          <p className="text-gray-600">{pedido.destino_endereco}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes adicionais */}
                    <div className="pt-3 border-t border-gray-100 text-sm text-gray-500 space-y-1">
                      {pedido.tipo_item && <p>Tipo: {pedido.tipo_item}</p>}
                      {pedido.peso_kg && <p>Peso: {pedido.peso_kg} kg</p>}
                      {pedido.tamanho && <p>Tamanho: {pedido.tamanho}</p>}
                      {pedido.urgencia !== null && <p>Urgência: {pedido.urgencia}</p>}
                    </div>

                    {/* Botão aceitar */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        disabled={aceitandoId === pedido.id}
                        onClick={() => handleAceitar(pedido.id)}
                        className={`px-6 py-2 font-bold rounded-lg shadow-md flex items-center transition
                          ${aceitandoId === pedido.id ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                      >
                        <i className="fas fa-motorcycle mr-2"></i>
                        {aceitandoId === pedido.id ? "Aceitando..." : "Aceitar Corrida"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {!loading && pedidosOrdenados.length === 0 && (
              <div className="bg-white p-10 rounded-xl text-center shadow-lg border-l-4 border-blue-600">
                <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                <p className="text-xl font-semibold text-gray-700">
                  Nenhum pedido disponível no momento.
                </p>
                <p className="text-gray-500 mt-2">
                  Mantenha-se online e verifique novamente em breve.
                </p>
              </div>
            )}

            {/* BOTÃO VER MAIS REGISTROS */}
            {!loading && pedidosOrdenados.length > 0 && (
              <div className="pt-4">
                <button
                  className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                  onClick={() => toast("Carregando mais pedidos...")}
                >
                  <i className="fas fa-plus-circle"></i>
                  VER MAIS PEDIDOS
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
