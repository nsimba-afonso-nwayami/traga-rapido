import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  listarPedidosDisponiveis,
  aceitarPedido,
  marcarACaminho,
  marcarItemRetirado,
  marcarEmEntrega,
  marcarEntregue,
} from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitRoute({ positions }) {
  const map = useMap();
  useEffect(() => {
    const validPositions =
      positions?.filter((p) => p && p[0] != null && p[1] != null) || [];
    if (validPositions.length > 0) {
      const bounds = L.latLngBounds(validPositions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

const STATUS_FLOW = {
  PROPOSTA_ACEITA: {
    proximo: "ENTREGADOR_A_CAMINHO",
    label: "Iniciar Deslocamento",
    class: "bg-blue-600",
    msg: "Indo buscar o item!",
    action: marcarACaminho,
  },
  ENTREGADOR_A_CAMINHO: {
    proximo: "ITEM_RETIRADO",
    label: "Cheguei / Retirei o Item",
    class: "bg-yellow-500",
    msg: "Item em mãos!",
    action: marcarItemRetirado,
  },
  ITEM_RETIRADO: {
    proximo: "EM_ENTREGA",
    label: "Iniciar Rota de Entrega",
    class: "bg-purple-600",
    msg: "Saindo para entrega!",
    action: marcarEmEntrega,
  },
  EM_ENTREGA: {
    proximo: "ENTREGUE",
    label: "Confirmar Entrega Final",
    class: "bg-green-600",
    msg: "Corrida finalizada!",
    action: marcarEntregue,
  },
};

export default function ListaDePedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aceitandoId, setAceitandoId] = useState(null);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);
  const [rotaCaminho, setRotaCaminho] = useState([]);

  const calcularRota = useCallback(async (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return;
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`
      );
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const pontos = data.routes[0].geometry.coordinates.map((p) => [
          p[1],
          p[0],
        ]);
        setRotaCaminho(pontos);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Lógica de carregamento centralizada
  const carregarDados = useCallback(
    async (isFirstLoad = false) => {
      if (isFirstLoad) setLoading(true);
      try {
        const disponiveis = await listarPedidosDisponiveis();
        const logadoId = localStorage.getItem("userId");

        const emProgresso = disponiveis.find(
          (p) =>
            String(p.entregador) === String(logadoId) && p.status !== "ENTREGUE"
        );

        if (emProgresso) {
          // Só busca usuário se o pedido ativo mudou ou é novo
          if (
            !pedidoAtivo ||
            pedidoAtivo.id !== emProgresso.id ||
            pedidoAtivo.status !== emProgresso.status
          ) {
            const u = await getUsuario(emProgresso.solicitante);
            const completo = {
              ...emProgresso,
              usernameSolicitante: u.username,
              telefoneSolicitante: u.telefone,
            };
            setPedidoAtivo(completo);
            if (
              completo.origem_latitude != null &&
              completo.destino_latitude != null
            ) {
              calcularRota(
                completo.origem_latitude,
                completo.origem_longitude,
                completo.destino_latitude,
                completo.destino_longitude
              );
            }
          }
        } else {
          setPedidoAtivo(null);
          if (disponiveis.length > 0) {
            const p = disponiveis[0];
            // Se o primeiro da lista mudou, atualiza
            if (pedidos.length === 0 || pedidos[0].id !== p.id) {
              try {
                const u = await getUsuario(p.solicitante);
                setPedidos([
                  {
                    ...p,
                    usernameSolicitante: u.username,
                    telefoneSolicitante: u.telefone,
                  },
                ]);
              } catch {
                setPedidos([p]);
              }
            }
          } else {
            setPedidos([]);
          }
        }
      } catch (error) {
        if (isFirstLoad) toast.error("Erro ao carregar dados.");
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    },
    [pedidoAtivo, pedidos, calcularRota]
  );

  // Efeito de Refresh Automático (5 segundos)
  useEffect(() => {
    carregarDados(true); // Carga inicial
    const interval = setInterval(() => carregarDados(false), 5000);
    return () => clearInterval(interval);
  }, [carregarDados]);

  async function handleAceitar(pedido) {
    setAceitandoId(pedido.id);
    try {
      await aceitarPedido(pedido.id);
      toast.success("Corrida iniciada!");
      // Atualiza imediatamente após aceitar
      carregarDados(false);
    } catch (error) {
      toast.error("Erro ao aceitar.");
    } finally {
      setAceitandoId(null);
    }
  }

  async function handleAtualizarStatus() {
    const config = STATUS_FLOW[pedidoAtivo.status];
    if (!config) return;

    try {
      await config.action(pedidoAtivo.id);
      toast.success(config.msg);
      if (config.proximo === "ENTREGUE") {
        setPedidoAtivo(null);
        setRotaCaminho([]);
        carregarDados(true);
      } else {
        setPedidoAtivo({ ...pedidoAtivo, status: config.proximo });
      }
    } catch (error) {
      toast.error("Erro ao atualizar.");
    }
  }

  const pedidoParaMostrar = pedidoAtivo || pedidos[0];

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-4xl mx-auto pb-10">
            {pedidoParaMostrar ? (
              <div className="bg-white rounded-xl shadow-lg transition-shadow duration-300 overflow-hidden border-l-4 border-blue-600">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start border-b pb-3 mb-3">
                    <div>
                      <h4 className="text-xl font-extrabold text-gray-900">
                        {pedidoParaMostrar.titulo}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Pedido #{pedidoParaMostrar.id}
                      </p>
                      <p className="text-sm font-bold text-blue-700 mt-2">
                        Solicitante:{" "}
                        {pedidoParaMostrar.usernameSolicitante ||
                          "Carregando..."}
                      </p>
                      <div className="mt-2">
                        {pedidoParaMostrar.telefoneSolicitante && (
                          <a
                            href={`tel:${pedidoParaMostrar.telefoneSolicitante}`}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md shadow-sm"
                          >
                            <i className="fas fa-phone mr-2"></i> Ligar:{" "}
                            {pedidoParaMostrar.telefoneSolicitante}
                          </a>
                        )}
                      </div>
                      {pedidoParaMostrar.descricao && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {pedidoParaMostrar.descricao}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        AOA {pedidoParaMostrar.valor_sugerido}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        Valor Estimado
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <i className="fas fa-location-arrow mt-1 mr-3 text-blue-500"></i>
                      <div>
                        <p className="font-semibold text-gray-700">Origem:</p>
                        <p className="text-gray-600">
                          {pedidoParaMostrar.origem_endereco}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start text-sm">
                      <i className="fas fa-map-marker-alt mt-1 mr-3 text-red-500"></i>
                      <div>
                        <p className="font-semibold text-gray-700">Destino:</p>
                        <p className="text-gray-600">
                          {pedidoParaMostrar.destino_endereco}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm text-gray-500">
                    {pedidoParaMostrar.tipo_item && (
                      <p>
                        <span className="font-medium">Tipo:</span>{" "}
                        {pedidoParaMostrar.tipo_item}
                      </p>
                    )}
                    {pedidoParaMostrar.peso_kg && (
                      <p>
                        <span className="font-medium">Peso:</span>{" "}
                        {pedidoParaMostrar.peso_kg} kg
                      </p>
                    )}
                    {pedidoParaMostrar.tamanho && (
                      <p>
                        <span className="font-medium">Tamanho:</span>{" "}
                        {pedidoParaMostrar.tamanho}
                      </p>
                    )}
                    {pedidoParaMostrar.urgencia && (
                      <p className="text-orange-600 font-medium">
                        Urgência: {pedidoParaMostrar.urgencia}
                      </p>
                    )}
                  </div>

                  {pedidoAtivo && pedidoParaMostrar.origem_latitude != null && (
                    <div className="mt-4 w-full h-80 rounded-lg overflow-hidden border border-gray-200 relative z-10">
                      <MapContainer
                        center={[
                          pedidoParaMostrar.origem_latitude,
                          pedidoParaMostrar.origem_longitude,
                        ]}
                        zoom={13}
                        className="w-full h-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            pedidoParaMostrar.origem_latitude,
                            pedidoParaMostrar.origem_longitude,
                          ]}
                          icon={customIcon}
                        />
                        {pedidoParaMostrar.destino_latitude != null && (
                          <Marker
                            position={[
                              pedidoParaMostrar.destino_latitude,
                              pedidoParaMostrar.destino_longitude,
                            ]}
                            icon={customIcon}
                          />
                        )}
                        {rotaCaminho.length > 0 && (
                          <Polyline
                            positions={rotaCaminho}
                            color="#3b82f6"
                            weight={5}
                          />
                        )}
                        <FitRoute
                          positions={
                            rotaCaminho.length > 0
                              ? rotaCaminho
                              : [
                                  [
                                    pedidoParaMostrar.origem_latitude,
                                    pedidoParaMostrar.origem_longitude,
                                  ],
                                  [
                                    pedidoParaMostrar.destino_latitude,
                                    pedidoParaMostrar.destino_longitude,
                                  ],
                                ].filter((p) => p[0] != null)
                          }
                        />
                      </MapContainer>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    {!pedidoAtivo ? (
                      <button
                        onClick={() => handleAceitar(pedidoParaMostrar)}
                        className="px-8 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center"
                      >
                        <i
                          className={`fas ${
                            aceitandoId ? "fa-spinner fa-spin" : "fa-motorcycle"
                          } mr-2`}
                        ></i>
                        {aceitandoId ? "Aceitando..." : "Aceitar Corrida"}
                      </button>
                    ) : (
                      <button
                        onClick={handleAtualizarStatus}
                        className={`w-full cursor-pointer py-4 text-white font-bold rounded-lg shadow-md transition ${
                          STATUS_FLOW[pedidoAtivo.status]?.class
                        }`}
                      >
                        <i className="fas fa-sync-alt mr-2"></i>{" "}
                        {STATUS_FLOW[pedidoAtivo.status]?.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-200">
                  <p className="text-gray-600 text-lg">
                    Nenhum pedido disponível.
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
