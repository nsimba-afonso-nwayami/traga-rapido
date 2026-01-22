import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
// Import do seu service de rastreamento
import { enviarPosicao } from "../../services/rastreamentoService";

// --- UTILITÁRIOS ---

function calcularDistanciaMetros(pos1, pos2) {
  if (!pos1 || !pos2) return 0;
  const R = 6371e3;
  const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
  const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1[0] * Math.PI) / 180) *
      Math.cos((pos2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const tocarSom = (tipo) => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      tipo === "chegada" ? 440 : 880,
      context.currentTime,
    );
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
  } catch (e) {
    console.error("Erro de áudio", e);
  }
};

// --- CONFIGURAÇÃO DE ÍCONES ---
const iconOrigem = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconDestino = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/71/71422.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

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
    class: "bg-blue-600 hover:bg-blue-700",
    msg: "Indo buscar o item!",
    action: marcarACaminho,
  },
  ENTREGADOR_A_CAMINHO: {
    proximo: "ITEM_RETIRADO",
    label: "Cheguei / Retirei o Item",
    class: "bg-yellow-500 hover:bg-yellow-600",
    msg: "Item em mãos!",
    action: marcarItemRetirado,
  },
  ITEM_RETIRADO: {
    proximo: "EM_ENTREGA",
    label: "Iniciar Rota de Entrega",
    class: "bg-purple-600 hover:bg-purple-700",
    msg: "Saindo para entrega!",
    action: marcarEmEntrega,
  },
  EM_ENTREGA: {
    proximo: "ENTREGUE",
    label: "Confirmar Entrega Final",
    class: "bg-green-600 hover:bg-green-700",
    msg: "Corrida finalizada!",
    action: marcarEntregue,
  },
};

export default function ListaDePedidos() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aceitandoId, setAceitandoId] = useState(null);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);
  const [rotaCaminho, setRotaCaminho] = useState([]);
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [metricas, setMetricas] = useState({ distancia: "", tempo: "" });

  // --- ESTADOS DO CHAT ---
  const [showChat, setShowChat] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novoTexto, setNovoTexto] = useState("");
  const chatEndRef = useRef(null);

  const ultimaPosicaoRotaRef = useRef(null);
  const ultimaPosicaoEnviadaServidorRef = useRef(null); 
  const avisouChegadaRef = useRef(false);
  const ultimoEnvioRef = useRef(0);

  // Rolagem automática do chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) scrollToBottom();
  }, [mensagens, showChat]);

  // --- FUNÇÕES DO CHAT ---
  const buscarMensagens = useCallback(async () => {
    if (!pedidoAtivo) return;
    try {
      const response = await fetch(`https://traga-rapido.fimbatec.com/mensagem/pedidos/${pedidoAtivo.id}/mensagens/`);
      if (response.ok) {
        const data = await response.json();
        setMensagens(data.reverse()); // Inverter para mostrar as mais recentes embaixo
      }
    } catch (err) {
      console.error("Erro ao carregar mensagens", err);
    }
  }, [pedidoAtivo]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novoTexto.trim() || !pedidoAtivo) return;

    try {
      const response = await fetch(`https://traga-rapido.fimbatec.com/mensagem/pedidos/${pedidoAtivo.id}/mensagens/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: novoTexto,
          remetente: pedidoAtivo.entregador, // No entregador, o remetente é o ID dele
        }),
      });

      if (response.ok) {
        setNovoTexto("");
        buscarMensagens();
      }
    } catch (err) {
      toast.error("Erro ao enviar mensagem.");
    }
  };

  // --- FUNÇÃO DE SINCRONIZAÇÃO COM BACKEND ---
  const enviarPosicaoAoServidor = useCallback(async (lat, lng, pedido) => {
    if (!pedido || !pedido.id) return;

    const url = `https://traga-rapido.fimbatec.com/rastreamento/pedidos/${pedido.id}/posicoes/`;
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` })
        },
        body: JSON.stringify({ 
            latitude: lat, 
            longitude: lng 
        })
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      console.log("📍 Posição sincronizada.");
    } catch (error) {
      console.error("❌ Erro sincronismo:", error);
    }
  }, []);

  // --- GPS MONITORAMENTO ---
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const novaLat = pos.coords.latitude;
        const novaLng = pos.coords.longitude;
        const novaPos = [novaLat, novaLng];

        setMinhaPosicao(novaPos);

        if (pedidoAtivo && (pedidoAtivo.status === 'ENTREGADOR_A_CAMINHO' || pedidoAtivo.status === 'EM_ENTREGA')) {
          const distDesdeUltimoEnvio = calcularDistanciaMetros(novaPos, ultimaPosicaoEnviadaServidorRef.current);
          if (!ultimaPosicaoEnviadaServidorRef.current || distDesdeUltimoEnvio > 15) {
            enviarPosicaoAoServidor(novaLat, novaLng, pedidoAtivo);
            ultimaPosicaoEnviadaServidorRef.current = novaPos;
          }
        }
      },
      (err) => console.error("Erro GPS:", err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [pedidoAtivo, enviarPosicaoAoServidor]);

  const carregarDados = useCallback(
    async (isFirstLoad = false) => {
      if (isFirstLoad) setLoading(true);
      try {
        const disponiveis = await listarPedidosDisponiveis();
        const logadoId = localStorage.getItem("userId");
        const emProgresso = disponiveis.find(
          (p) =>
            String(p.entregador) === String(logadoId) &&
            p.status !== "ENTREGUE",
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
            avisouChegadaRef.current = false;
          }
          // Se o modal estiver aberto, atualiza as mensagens
          if (showChat) buscarMensagens();
        } else {
          setPedidoAtivo(null);
          setRotaCaminho([]);
          const abertos = disponiveis.filter((p) => !p.entregador);
          setPedidos(abertos.length > 0 ? [abertos[0]] : []);
        }
      } catch (error) {
        if (isFirstLoad) toast.error("Erro ao carregar.");
      } finally {
        if (isFirstLoad) setLoading(false);
      }
    },
    [pedidoAtivo, showChat, buscarMensagens]
  );

  useEffect(() => {
    carregarDados(true);
    const interval = setInterval(() => carregarDados(false), 5000);
    return () => clearInterval(interval);
  }, [carregarDados]);

  const calcularRotaDinamica = useCallback(async (latI, lonI, latF, lonF) => {
    if (!latI || !latF) return;
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lonI},${latI};${lonF},${latF}?overview=full&geometries=geojson`,
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
      console.error("Erro rota", err);
    }
  }, []);

  useEffect(() => {
    if (pedidoAtivo && minhaPosicao) {
      const {
        status,
        destino_latitude,
        destino_longitude,
        origem_latitude,
        origem_longitude,
      } = pedidoAtivo;
      const metaLat =
        status === "ITEM_RETIRADO" || status === "EM_ENTREGA"
          ? destino_latitude
          : origem_latitude;
      const metaLon =
        status === "ITEM_RETIRADO" || status === "EM_ENTREGA"
          ? destino_longitude
          : origem_longitude;

      const distMeta = calcularDistanciaMetros(minhaPosicao, [metaLat, metaLon]);
      const desvio = calcularDistanciaMetros(minhaPosicao, ultimaPosicaoRotaRef.current);

      if (distMeta < 100 && !avisouChegadaRef.current) {
        tocarSom("chegada");
        toast.success("Estás a menos de 100m do ponto!", { duration: 4000 });
        avisouChegadaRef.current = true;
      }

      if (!ultimaPosicaoRotaRef.current || desvio > 40) {
        calcularRotaDinamica(minhaPosicao[0], minhaPosicao[1], metaLat, metaLon);
        ultimaPosicaoRotaRef.current = minhaPosicao;
      }
    }
  }, [minhaPosicao, pedidoAtivo?.status, calcularRotaDinamica, pedidoAtivo]);

  const handleAceitar = async (pedido) => {
    setAceitandoId(pedido.id);
    try {
      await aceitarPedido(pedido.id);
      toast.success("Iniciado!");
      carregarDados(true);
    } catch (e) {
      toast.error("Erro.");
    } finally {
      setAceitandoId(null);
    }
  };

  const handleAtualizarStatus = async () => {
    const config = STATUS_FLOW[pedidoAtivo.status];
    if (!config) return;
    try {
      await config.action(pedidoAtivo.id);
      toast.success(config.msg);
      if (config.proximo === "ENTREGUE") {
        setPedidoAtivo(null);
        setRotaCaminho([]);
        ultimaPosicaoRotaRef.current = null;
        ultimaPosicaoEnviadaServidorRef.current = null;
        carregarDados(true);
      } else {
        setPedidoAtivo({ ...pedidoAtivo, status: config.proximo });
      }
    } catch (e) {
      toast.error("Erro ao atualizar.");
    }
  };

  const abrirNoMaps = (lat, lon) =>
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=motorcycle`, "_blank");

  const abrirWhatsApp = (tel, tit) =>
    window.open(`https://wa.me/${tel.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, sou o entregador do pedido "${tit}". Estou a caminho!`)}`, "_blank");

  const pedidoParaMostrar = pedidoAtivo || pedidos[0];

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderEntregador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="h-20 w-full shrink-0"></div>
          <div className="max-w-4xl mx-auto pb-10">
            {pedidoParaMostrar ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-600">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start border-b pb-3 mb-3">
                    <div>
                      <h4 className="text-xl font-extrabold text-gray-900">{pedidoParaMostrar.titulo}</h4>
                      {pedidoParaMostrar.descricao && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{pedidoParaMostrar.descricao}"</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Pedido #{pedidoParaMostrar.id.substring(0,8)}</p>
                      <p className="text-sm font-bold text-blue-700 mt-2">
                        Solicitante: {pedidoParaMostrar.usernameSolicitante || "Carregando..."}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {pedidoParaMostrar.telefoneSolicitante && (
                          <>
                            {pedidoAtivo && (
                              <button
                                onClick={() => { setShowChat(true); buscarMensagens(); }}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition"
                              >
                                <i className="fas fa-comments mr-2"></i> Abrir Chat
                              </button>
                            )}
                            <a href={`tel:${pedidoParaMostrar.telefoneSolicitante}`} className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700 transition">
                              <i className="fas fa-phone mr-2"></i> Ligar
                            </a>
                            <button onClick={() => abrirWhatsApp(pedidoParaMostrar.telefoneSolicitante, pedidoParaMostrar.titulo)} className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md hover:bg-emerald-600 transition">
                              <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">Kz {pedidoParaMostrar.valor_sugerido}</p>
                      <p className="text-xs text-gray-400 font-medium">Valor Estimado</p>
                    </div>
                  </div>

                  {pedidoAtivo && metricas.distancia && (
                    <div className="flex gap-4 mb-2">
                      <div className="bg-blue-50 p-2 rounded-lg flex-1 text-center border border-blue-100">
                        <p className="text-xs text-blue-600 font-bold uppercase">Faltam</p>
                        <p className="text-lg font-black text-blue-900">{metricas.distancia}</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg flex-1 text-center border border-green-100">
                        <p className="text-xs text-green-600 font-bold uppercase">Estimativa</p>
                        <p className="text-lg font-black text-green-900">{metricas.tempo}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div onClick={() => abrirNoMaps(pedidoParaMostrar.origem_latitude, pedidoParaMostrar.origem_longitude)} className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition shadow-sm">
                      <div className="flex items-start text-sm">
                        <i className="fas fa-location-arrow mt-1 mr-3 text-blue-600 text-lg"></i>
                        <div>
                          <p className="font-bold text-blue-800 uppercase text-xs">Origem (Coleta):</p>
                          <p className="text-gray-900 font-medium">{pedidoParaMostrar.origem_endereco}</p>
                        </div>
                      </div>
                      <i className="fas fa-directions text-blue-600 text-2xl ml-4"></i>
                    </div>

                    <div onClick={() => abrirNoMaps(pedidoParaMostrar.destino_latitude, pedidoParaMostrar.destino_longitude)} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition shadow-sm">
                      <div className="flex items-start text-sm">
                        <i className="fas fa-map-marker-alt mt-1 mr-3 text-red-600 text-lg"></i>
                        <div>
                          <p className="font-bold text-red-800 uppercase text-xs">Destino (Entrega):</p>
                          <p className="text-gray-900 font-medium">{pedidoParaMostrar.destino_endereco}</p>
                        </div>
                      </div>
                      <i className="fas fa-directions text-red-600 text-2xl ml-4"></i>
                    </div>
                  </div>

                  {pedidoAtivo && (
                    <div className="mt-4 w-full h-80 rounded-lg overflow-hidden border border-gray-200 relative z-10">
                      <MapContainer center={[pedidoAtivo.origem_latitude, pedidoAtivo.origem_longitude]} zoom={14} className="w-full h-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {minhaPosicao && <Marker position={minhaPosicao} icon={deliveryIcon} />}
                        <Marker position={[pedidoAtivo.origem_latitude, pedidoAtivo.origem_longitude]} icon={iconOrigem} />
                        <Marker position={[pedidoAtivo.destino_latitude, pedidoAtivo.destino_longitude]} icon={iconDestino} />
                        {rotaCaminho.length > 0 && <Polyline positions={rotaCaminho} color="#3b82f6" weight={5} opacity={0.7} />}
                        <FitRoute positions={[minhaPosicao, [pedidoAtivo.origem_latitude, pedidoAtivo.origem_longitude], [pedidoAtivo.destino_latitude, pedidoAtivo.destino_longitude]]} />
                      </MapContainer>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    {!pedidoAtivo ? (
                      <button onClick={() => handleAceitar(pedidoParaMostrar)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center transition">
                        <i className={`fas ${aceitandoId ? "fa-spinner fa-spin" : "fa-motorcycle"} mr-2`}></i>
                        {aceitandoId ? "Aceitando..." : "Aceitar Corrida"}
                      </button>
                    ) : (
                      <button onClick={handleAtualizarStatus} className={`w-full py-4 text-white font-bold rounded-lg shadow-md transition ${STATUS_FLOW[pedidoAtivo.status]?.class}`}>
                        <i className="fas fa-sync-alt mr-2"></i> {STATUS_FLOW[pedidoAtivo.status]?.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-gray-200">
                  <div className="mb-4 text-gray-300"><i className="fas fa-box-open text-6xl"></i></div>
                  <p className="text-gray-500 font-bold text-xl">Não há novos pedidos.</p>
                  <button onClick={() => carregarDados(true)} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition">
                    <i className="fas fa-sync-alt mr-2"></i> VERIFICAR NOVAMENTE
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* --- MODAL DO CHAT --- */}
      {showChat && (
        <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-[90vh] sm:h-[600px] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header Chat */}
            <div className="px-6 py-4 bg-blue-700 text-white flex justify-between items-center shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="font-bold leading-tight">{pedidoAtivo?.usernameSolicitante}</p>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Cliente do Pedido</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full transition">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin">
              {mensagens.map((msg, index) => {
                const isMe = String(msg.remetente) === String(pedidoAtivo?.entregador);
                return (
                  <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in zoom-in-95 duration-200`}>
                    <div className={`max-w-[85%] px-4 py-2 shadow-sm text-sm ${
                      isMe 
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none"
                    }`}>
                      <p className="leading-relaxed">{msg.texto}</p>
                      <p className={`text-[9px] mt-1 text-right opacity-60`}>
                        {new Date(msg.data_envio || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={enviarMensagem} className="p-4 bg-white border-t flex gap-2 items-center shrink-0">
              <input
                type="text"
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 transition"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition active:scale-95">
                <i className="fas fa-paper-plane text-lg"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}