import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import {
  listarPedidosDisponiveis,
  aceitarPedido,
} from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService"; // Importando o service de usuário
import { useAuth } from "../../contexts/AuthContext";

export default function ListaDePedidos() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aceitandoId, setAceitandoId] = useState(null);

  const { user } = useAuth();
  const idEntregador = user?.id;

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const pedidosDisponiveis = await listarPedidosDisponiveis();

        // Buscando dados do solicitante para cada pedido
        const pedidosEnriquecidos = await Promise.all(
          pedidosDisponiveis.map(async (pedido) => {
            try {
              if (pedido.solicitante) {
                const dadosUser = await getUsuario(pedido.solicitante);
                return {
                  ...pedido,
                  usernameSolicitante: dadosUser.username,
                  telefoneSolicitante: dadosUser.telefone,
                };
              }
              return pedido;
            } catch (err) {
              return pedido;
            }
          })
        );

        setPedidos(pedidosEnriquecidos);
      } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        toast.error("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  async function handleAceitar(pedidoId) {
    const toastId = toast.loading("Aceitando pedido...");
    setAceitandoId(pedidoId);

    try {
      await aceitarPedido(pedidoId);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      toast.success("Pedido aceito com sucesso!", { id: toastId });
      navigate(`/dashboard/entregador/detalhes-corrida/${pedidoId}`);
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error);
      toast.error("Não foi possível aceitar o pedido.", { id: toastId });
    } finally {
      setAceitandoId(null);
    }
  }

  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
  );

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Container Principal */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* HEADER FIXO */}
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6 pb-10">
          <div className="h-20 w-full shrink-0"></div>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {loading && (
              <p className="text-center text-gray-500 py-10">
                Carregando pedidos...
              </p>
            )}

            {!loading &&
              pedidosOrdenados.length > 0 &&
              pedidosOrdenados.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-blue-600"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Informações do pedido */}
                    <div className="flex justify-between items-start border-b pb-3 mb-3">
                      <div>
                        <h4 className="text-xl font-extrabold text-gray-900">
                          {pedido.titulo}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Pedido #{pedido.id}
                        </p>

                        {/* EXIBIÇÃO DO SOLICITANTE */}
                        <p className="text-sm font-bold text-blue-700 mt-2">
                          Solicitante:{" "}
                          {pedido.usernameSolicitante || "Carregando..."}
                        </p>

                        {/* CONTATO ESTILIZADO COMO BOTÃO LINK */}
                        <div className="mt-2">
                          {pedido.telefoneSolicitante ? (
                            <a
                              href={`tel:${pedido.telefoneSolicitante}`}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700 transition-colors shadow-sm"
                            >
                              <i className="fas fa-phone mr-2"></i>
                              Ligar: {pedido.telefoneSolicitante}
                            </a>
                          ) : (
                            <p className="text-xs text-gray-600 font-medium">
                              Contato: N/A
                            </p>
                          )}
                        </div>

                        {pedido.descricao && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            {pedido.descricao}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {pedido.valor_sugerido
                            ? `AOA ${pedido.valor_sugerido}`
                            : "-"}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          Valor Estimado
                        </p>
                      </div>
                    </div>

                    {/* Endereços */}
                    <div className="space-y-3">
                      <div className="flex items-start text-sm">
                        <i className="fas fa-location-arrow mt-1 mr-3 text-blue-500"></i>
                        <div>
                          <p className="font-semibold text-gray-700">Origem:</p>
                          <p className="text-gray-600">
                            {pedido.origem_endereco}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <i className="fas fa-map-marker-alt mt-1 mr-3 text-red-500"></i>
                        <div>
                          <p className="font-semibold text-gray-700">
                            Destino:
                          </p>
                          <p className="text-gray-600">
                            {pedido.destino_endereco}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes adicionais */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm text-gray-500">
                      {pedido.tipo_item && (
                        <p>
                          <span className="font-medium">Tipo:</span>{" "}
                          {pedido.tipo_item}
                        </p>
                      )}
                      {pedido.peso_kg && (
                        <p>
                          <span className="font-medium">Peso:</span>{" "}
                          {pedido.peso_kg} kg
                        </p>
                      )}
                      {pedido.tamanho && (
                        <p>
                          <span className="font-medium">Tamanho:</span>{" "}
                          {pedido.tamanho}
                        </p>
                      )}
                      {pedido.urgencia !== null && (
                        <p className="text-orange-600 font-medium">
                          Urgência: {pedido.urgencia}
                        </p>
                      )}
                    </div>

                    {/* Botão aceitar */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        disabled={aceitandoId === pedido.id}
                        onClick={() => handleAceitar(pedido.id)}
                        className={`px-8 py-3 cursor-pointer font-bold rounded-lg shadow-md flex items-center transition active:scale-95
                          ${
                            aceitandoId === pedido.id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                      >
                        <i
                          className={`fas ${
                            aceitandoId === pedido.id
                              ? "fa-spinner fa-spin"
                              : "fa-motorcycle"
                          } mr-2`}
                        ></i>
                        {aceitandoId === pedido.id
                          ? "Aceitando..."
                          : "Aceitar Corrida"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {!loading && pedidosOrdenados.length === 0 && (
              <div className="bg-white p-10 rounded-xl text-center shadow-lg border-l-4 border-blue-600 mt-4">
                <i className="fas fa-box-open text-6xl text-gray-200 mb-4"></i>
                <p className="text-xl font-semibold text-gray-700">
                  Nenhum pedido disponível.
                </p>
                <p className="text-gray-500 mt-2">
                  Tente atualizar a página ou aguarde novas solicitações.
                </p>
              </div>
            )}

            {!loading && pedidosOrdenados.length > 0 && (
              <div className="pt-4 pb-10">
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
