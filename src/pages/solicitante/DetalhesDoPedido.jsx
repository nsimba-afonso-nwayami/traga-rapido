import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
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
import { obterPedidoPorId, cancelarPedido } from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService";
import { criarAvaliacao } from "../../services/avaliacaoService";

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
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

export default function DetalhesDoPedido() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [entregadorInfo, setEntregadorInfo] = useState(null);
  const [rotaCaminho, setRotaCaminho] = useState([]);

  // Estados para Avaliação
  const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const carregarPedido = useCallback(
    async (isAutoRefresh = false) => {
      if (isAutoRefresh && showAvaliacaoForm) return;

      try {
        const data = await obterPedidoPorId(id);
        if (isAutoRefresh && data.status !== pedido?.status) {
          toast.success("Status atualizado", { id: "refresh-toast" });
        }
        setPedido(data);

        if (data.entregador && !entregadorInfo) {
          try {
            const user = await getUsuario(data.entregador);
            setEntregadorInfo(user);
          } catch (err) {
            console.error("Erro ao buscar entregador", err);
          }
        }

        if (
          data.origem_latitude &&
          data.destino_latitude &&
          rotaCaminho.length === 0
        ) {
          calcularRota(
            data.origem_latitude,
            data.origem_longitude,
            data.destino_latitude,
            data.destino_longitude
          );
        }
      } catch (err) {
        if (!isAutoRefresh) toast.error("Erro ao carregar pedido");
      }
    },
    [id, showAvaliacaoForm, pedido?.status, entregadorInfo, rotaCaminho.length]
  );

  useEffect(() => {
    carregarPedido(false);
    const interval = setInterval(() => {
      carregarPedido(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [carregarPedido]);

  const calcularRota = async (lat1, lon1, lat2, lon2) => {
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
      console.error("Erro ao traçar rota:", err);
    }
  };

  const handleCancelarPedido = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;
    try {
      await cancelarPedido(pedido.id);
      toast.success("Pedido cancelado com sucesso");
      carregarPedido(false);
    } catch (error) {
      toast.error("Não foi possível cancelar o pedido");
    }
  };

  const handleEnviarAvaliacao = async (e) => {
    e.preventDefault();

    // CORREÇÃO: Usamos o ID como string (UUID), sem Number()
    const pedidoIdParaEnviar = id || pedido?.id;

    if (!pedidoIdParaEnviar) {
      toast.error("ID do pedido não localizado.");
      return;
    }

    setEnviandoAvaliacao(true);
    try {
      await criarAvaliacao({
        estrelas: estrelas,
        comentario: comentario,
        pedido: pedidoIdParaEnviar, // Enviando como UUID (String)
      });
      toast.success("Avaliação enviada com sucesso!");
      setShowAvaliacaoForm(false);
      setComentario("");
      carregarPedido(false);
    } catch (error) {
      const apiData = error.response?.data;
      let erroMsg = "Erro ao enviar avaliação";

      // Verifica se a API retornou erro específico no campo pedido
      if (apiData?.pedido) {
        erroMsg = `Pedido: ${apiData.pedido[0]}`;
      } else if (apiData?.detail) {
        erroMsg = apiData.detail;
      }

      toast.error(erroMsg);
      console.error("Erro detalhado da API:", apiData);
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const DetalheItem = ({ label, value, icon, children }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <i className={`fas fa-${icon} text-blue-600 text-lg shrink-0`}></i>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {children ? (
          children
        ) : (
          <p className="text-sm font-semibold text-gray-800 wrap-break-word">
            {value}
          </p>
        )}
      </div>
    </div>
  );

  if (!pedido)
    return (
      <p className="text-center mt-10 font-bold text-gray-500">
        Carregando detalhes...
      </p>
    );

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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* CARD SUPERIOR */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {pedido.titulo}{" "}
                  <span className="text-blue-600 font-mono text-lg">
                    #{pedido.id.toString().substring(0, 8)}...
                  </span>
                </h1>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <i className="far fa-calendar-alt mr-2"></i>
                  Criado em:{" "}
                  {new Date(pedido.criado_em).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-4 py-1.5 text-sm font-bold rounded-full border ${
                    pedido.status === "ENTREGUE"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  Status: {pedido.status}
                </span>

                {pedido.status === "ENTREGUE" ? (
                  <button
                    onClick={() => setShowAvaliacaoForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition flex items-center shadow-md cursor-pointer"
                  >
                    <i className="fas fa-star mr-2"></i> Avaliar Serviço
                  </button>
                ) : (
                  pedido.status !== "CANCELADO" && (
                    <button
                      onClick={handleCancelarPedido}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 transition flex items-center shadow-md cursor-pointer"
                    >
                      <i className="fas fa-ban mr-2"></i> Cancelar Pedido
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b flex items-center">
                    <i className="fas fa-info-circle mr-2 text-blue-600"></i>{" "}
                    Dados do Item
                  </h3>
                  <div className="space-y-3">
                    <DetalheItem
                      label="Peso Estimado"
                      value={`${pedido.peso_kg} kg`}
                      icon="weight-hanging"
                    />
                    <DetalheItem
                      label="Entregador Alocado"
                      value={entregadorInfo?.username || "Aguardando propostas"}
                      icon="user-circle"
                    />
                    {entregadorInfo?.telefone && (
                      <DetalheItem label="Contato" icon="phone">
                        <a
                          href={`tel:${entregadorInfo.telefone}`}
                          className="mt-1 inline-flex items-center justify-center w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md transition duration-150 shadow-sm gap-2"
                        >
                          <i className="fas fa-phone"></i> LIGAR:{" "}
                          {entregadorInfo.telefone}
                        </a>
                      </DetalheItem>
                    )}
                    <DetalheItem
                      label="Valor do Serviço"
                      value={`Kz ${
                        pedido.valor_final ?? pedido.valor_sugerido
                      }`}
                      icon="dollar-sign"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4 pb-2 border-b flex items-center">
                    <i className="fas fa-file-alt mr-2 text-blue-600"></i>{" "}
                    Descrição
                  </h3>
                  <p className="text-sm text-gray-600 italic bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                    {pedido.descricao || "Sem descrição adicional."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
                    <i className="fas fa-map-marked-alt mr-3"></i> Localização e
                    Rota
                  </h3>
                  <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 z-10 relative">
                    <MapContainer
                      center={[
                        pedido.origem_latitude || -8.8399,
                        pedido.origem_longitude || 13.2894,
                      ]}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="w-full h-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {pedido.origem_latitude && (
                        <Marker
                          position={[
                            pedido.origem_latitude,
                            pedido.origem_longitude,
                          ]}
                          icon={customIcon}
                        >
                          <Popup>
                            <b>Origem:</b>
                            <br />
                            {pedido.origem_endereco}
                          </Popup>
                        </Marker>
                      )}
                      {pedido.destino_latitude && (
                        <Marker
                          position={[
                            pedido.destino_latitude,
                            pedido.destino_longitude,
                          ]}
                          icon={customIcon}
                        >
                          <Popup>
                            <b>Destino:</b>
                            <br />
                            {pedido.destino_endereco}
                          </Popup>
                        </Marker>
                      )}
                      {rotaCaminho.length > 0 && (
                        <Polyline
                          positions={rotaCaminho}
                          color="#3b82f6"
                          weight={5}
                          opacity={0.7}
                        />
                      )}
                      <FitRoute
                        positions={
                          rotaCaminho.length > 0
                            ? rotaCaminho
                            : [
                                [
                                  pedido.origem_latitude,
                                  pedido.origem_longitude,
                                ],
                                [
                                  pedido.destino_latitude,
                                  pedido.destino_longitude,
                                ],
                              ]
                        }
                      />
                    </MapContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl shadow border-l-4 border-l-green-500 border-gray-300">
                    <h4 className="font-bold text-sm text-green-700 flex items-center mb-2 uppercase tracking-wider">
                      <i className="fas fa-location-arrow mr-2"></i> Ponto de
                      Recolha
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                      {pedido.origem_endereco}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow border-l-4 border-l-red-500 border-gray-300">
                    <h4 className="font-bold text-sm text-red-700 flex items-center mb-2 uppercase tracking-wider">
                      <i className="fas fa-flag-checkered mr-2"></i> Ponto de
                      Entrega
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                      {pedido.destino_endereco}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE AVALIAÇÃO - AZUL - Z-INDEX 50 PARA NÃO COBRIR O TOAST */}
      {showAvaliacaoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Avaliar Serviço</h3>
              <button
                onClick={() => setShowAvaliacaoForm(false)}
                className="hover:scale-110 transition-transform cursor-pointer"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleEnviarAvaliacao} className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-gray-600 mb-3 text-sm">
                  Sua nota para{" "}
                  <strong className="text-blue-600">
                    {entregadorInfo?.username || "o entregador"}
                  </strong>
                  :
                </p>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEstrelas(num)}
                      className="text-4xl focus:outline-none transition-all hover:scale-110 cursor-pointer"
                    >
                      <i
                        className={`${
                          estrelas >= num
                            ? "fas text-blue-600"
                            : "far text-gray-300"
                        } fa-star`}
                      ></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Seu comentário
                </label>
                <textarea
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px] text-sm text-gray-700"
                  placeholder="Ex: Entrega rápida e produto bem cuidado."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAvaliacaoForm(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition cursor-pointer text-sm"
                >
                  FECHAR
                </button>
                <button
                  type="submit"
                  disabled={enviandoAvaliacao}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer text-sm"
                >
                  {enviandoAvaliacao ? "ENVIANDO..." : "AVALIAR AGORA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
