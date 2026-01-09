import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import {
  MapContainer,
  TileLayer,
  Marker,
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

// --- CONFIGURAÇÃO DE ÍCONES ---
const iconOrigem = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconDestino = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/71/71422.png", // Ícone de Moto
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

// Componente para ajustar o zoom automaticamente entre os 3 pontos
function FitRoute({ positions }) {
  const map = useMap();
  useEffect(() => {
    const validPositions =
      positions?.filter((p) => p && p[0] != null && p[1] != null) || [];
    if (validPositions.length > 1) {
      const bounds = L.latLngBounds(validPositions);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
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
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [metricas, setMetricas] = useState({ distancia: "", tempo: "" });

  // Monitoramento do GPS em tempo real
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setMinhaPosicao([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Erro GPS:", err),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const abrirNoMaps = (lat, lon) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=motorcycle`,
      "_blank"
    );
  };

  const abrirWhatsApp = (telefone, titulo) => {
    const msg = encodeURIComponent(
      `Olá, sou o entregador do seu pedido "${titulo}". Já estou a caminho!`
    );
    window.open(
      `https://wa.me/${telefone.replace(/\D/g, "")}?text=${msg}`,
      "_blank"
    );
  };

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
          if (
            !pedidoAtivo ||
            pedidoAtivo.id !== emProgresso.id ||
            pedidoAtivo.status !== emProgresso.status
          ) {
            const u = await getUsuario(emProgresso.solicitante);
            setPedidoAtivo({
              ...emProgresso,
              usernameSolicitante: u.username,
              telefoneSolicitante: u.telefone,
            });
          }
        } else {
          setPedidoAtivo(null);
          setRotaCaminho([]);
          const abertos = disponiveis.filter((p) => !p.entregador);
          setPedidos(abertos.length > 0 ? [abertos[0]] : []);
        }
      } catch (error) {
        if (isFirstLoad) toast.error("Erro ao carregar dados.");
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    },
    [pedidoAtivo]
  );

  useEffect(() => {
    carregarDados(true);
    const interval = setInterval(() => carregarDados(false), 5000);
    return () => clearInterval(interval);
  }, [carregarDados]);

  // Cálculo de rota dinâmica (sempre da posição atual até o próximo ponto)
  const calcularRotaDinamica = useCallback(async (latI, lonI, latF, lonF) => {
    if (!latI || !latF) return;
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lonI},${latI};${lonF},${latF}?overview=full&geometries=geojson`
      );
      const data = await resp.json();
      if (data.routes?.length > 0) {
        const route = data.routes[0];
        setRotaCaminho(route.geometry.coordinates.map((p) => [p[1], p[0]]));
        setMetricas({
          distancia: `${(route.distance / 1000).toFixed(1)} km`,
          tempo: `${Math.round(route.duration / 60)} min`,
        });
      }
    } catch (err) {
      console.error("Erro na rota:", err);
    }
  }, []);

  useEffect(() => {
    if (pedidoAtivo && minhaPosicao) {
      const status = pedidoAtivo.status;
      // Se já retirou o item, a meta é o destino. Caso contrário, a meta é a origem.
      const metaLat =
        status === "ITEM_RETIRADO" || status === "EM_ENTREGA"
          ? pedidoAtivo.destino_latitude
          : pedidoAtivo.origem_latitude;
      const metaLon =
        status === "ITEM_RETIRADO" || status === "EM_ENTREGA"
          ? pedidoAtivo.destino_longitude
          : pedidoAtivo.origem_longitude;

      calcularRotaDinamica(minhaPosicao[0], minhaPosicao[1], metaLat, metaLon);
    }
  }, [minhaPosicao, pedidoAtivo?.status, calcularRotaDinamica]);

  async function handleAceitar(pedido) {
    setAceitandoId(pedido.id);
    try {
      await aceitarPedido(pedido.id);
      toast.success("Corrida iniciada!");
      carregarDados(true);
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-600">
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Cabeçalho do Card */}
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
                      <div className="mt-2 flex gap-2">
                        {pedidoParaMostrar.telefoneSolicitante && (
                          <>
                            <a
                              href={`tel:${pedidoParaMostrar.telefoneSolicitante}`}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md shadow-sm"
                            >
                              <i className="fas fa-phone mr-2"></i> Ligar:{" "}
                              {pedidoParaMostrar.telefoneSolicitante}
                            </a>
                            <button
                              onClick={() =>
                                abrirWhatsApp(
                                  pedidoParaMostrar.telefoneSolicitante,
                                  pedidoParaMostrar.titulo
                                )
                              }
                              className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md shadow-sm"
                            >
                              <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                            </button>
                          </>
                        )}
                      </div>
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

                  {/* Métricas Dinâmicas */}
                  {pedidoAtivo && metricas.distancia && (
                    <div className="flex gap-4 mb-2">
                      <div className="bg-blue-50 p-2 rounded-lg flex-1 text-center border border-blue-100">
                        <p className="text-xs text-blue-600 font-bold uppercase">
                          Faltam
                        </p>
                        <p className="text-lg font-black text-blue-900">
                          {metricas.distancia}
                        </p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg flex-1 text-center border border-green-100">
                        <p className="text-xs text-green-600 font-bold uppercase">
                          Estimativa
                        </p>
                        <p className="text-lg font-black text-green-900">
                          {metricas.tempo}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Endereços */}
                  <div className="space-y-4">
                    <div
                      onClick={() =>
                        abrirNoMaps(
                          pedidoParaMostrar.origem_latitude,
                          pedidoParaMostrar.origem_longitude
                        )
                      }
                      className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      <div className="flex items-start text-sm">
                        <i className="fas fa-location-arrow mt-1 mr-3 text-blue-600 text-lg"></i>
                        <div>
                          <p className="font-bold text-blue-800 uppercase text-xs">
                            Origem (Coleta):
                          </p>
                          <p className="text-gray-900 font-medium">
                            {pedidoParaMostrar.origem_endereco}
                          </p>
                        </div>
                      </div>
                      <i className="fas fa-directions text-blue-600 text-2xl ml-4"></i>
                    </div>

                    <div
                      onClick={() =>
                        abrirNoMaps(
                          pedidoParaMostrar.destino_latitude,
                          pedidoParaMostrar.destino_longitude
                        )
                      }
                      className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors shadow-sm"
                    >
                      <div className="flex items-start text-sm">
                        <i className="fas fa-map-marker-alt mt-1 mr-3 text-red-600 text-lg"></i>
                        <div>
                          <p className="font-bold text-red-800 uppercase text-xs">
                            Destino (Entrega):
                          </p>
                          <p className="text-gray-900 font-medium">
                            {pedidoParaMostrar.destino_endereco}
                          </p>
                        </div>
                      </div>
                      <i className="fas fa-directions text-red-600 text-2xl ml-4"></i>
                    </div>
                  </div>

                  {/* Detalhes Técnicos (Layout Mantido) */}
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

                  {/* Mapa Dinâmico com 3 Ícones */}
                  {pedidoAtivo && (
                    <div className="mt-4 w-full h-80 rounded-lg overflow-hidden border border-gray-200 relative z-10">
                      <MapContainer
                        center={[
                          pedidoAtivo.origem_latitude,
                          pedidoAtivo.origem_longitude,
                        ]}
                        zoom={14}
                        className="w-full h-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* 1. Ícone do Entregador (Sempre na posição GPS) */}
                        {minhaPosicao && (
                          <Marker position={minhaPosicao} icon={deliveryIcon} />
                        )}

                        {/* 2. Ícone de Origem (Verde) */}
                        <Marker
                          position={[
                            pedidoAtivo.origem_latitude,
                            pedidoAtivo.origem_longitude,
                          ]}
                          icon={iconOrigem}
                        />

                        {/* 3. Ícone de Destino (Vermelho) */}
                        <Marker
                          position={[
                            pedidoAtivo.destino_latitude,
                            pedidoAtivo.destino_longitude,
                          ]}
                          icon={iconDestino}
                        />

                        {/* Rota Ativa */}
                        {rotaCaminho.length > 0 && (
                          <Polyline
                            positions={rotaCaminho}
                            color="#3b82f6"
                            weight={5}
                            opacity={0.7}
                          />
                        )}

                        {/* Foca nos 3 pontos dinamicamente */}
                        <FitRoute
                          positions={[
                            minhaPosicao,
                            [
                              pedidoAtivo.origem_latitude,
                              pedidoAtivo.origem_longitude,
                            ],
                            [
                              pedidoAtivo.destino_latitude,
                              pedidoAtivo.destino_longitude,
                            ],
                          ]}
                        />
                      </MapContainer>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    {!pedidoAtivo ? (
                      <button
                        onClick={() => handleAceitar(pedidoParaMostrar)}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center"
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
                        className={`w-full py-4 text-white font-bold rounded-lg shadow-md transition ${
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
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-gray-200">
                  <div className="mb-4 text-gray-300">
                    <i className="fas fa-box-open text-6xl"></i>
                  </div>
                  <p className="text-gray-500 font-bold text-xl">
                    Não há novos pedidos para ser aceite.
                  </p>
                  <button
                    onClick={() => carregarDados(true)}
                    className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-black"
                  >
                    <i className="fas fa-sync-alt mr-2"></i> VERIFICAR NOVAMENTE
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
