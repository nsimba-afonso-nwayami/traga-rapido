import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { obterPedidoPorId, cancelarPedido } from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService";
import { criarAvaliacao } from "../../services/avaliacaoService";

// --- CONFIGURAÇÃO DE ÍCONES ---
const iconPonto = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/71/71422.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// --- COMPONENTE DE CONTROLE DO MAPA ---
function MapController({ positions, forceUpdate }) {
  const map = useMap();
  const hasFitInitial = useRef(false);

  const handleFit = useCallback(() => {
    const validPositions = positions?.filter((p) => p && p[0] != null && p[1] != null) || [];
    if (validPositions.length >= 2) {
      const bounds = L.latLngBounds(validPositions);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [positions, map]);

  useEffect(() => {
    if (!hasFitInitial.current && positions.length >= 2) {
      handleFit();
      hasFitInitial.current = true;
    }
  }, [positions, handleFit]);

  useEffect(() => {
    if (forceUpdate > 0) handleFit();
  }, [forceUpdate, handleFit]);

  return null;
}

export default function DetalhesDoPedido() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [entregadorInfo, setEntregadorInfo] = useState(null);
  const [rotaCaminho, setRotaCaminho] = useState([]);
  const [posicaoEntregador, setPosicaoEntregador] = useState(null);
  const [forceMapUpdate, setForceMapUpdate] = useState(0);

  // Estados Avaliação
  const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  // --- ESTADOS DO CHAT ---
  const [showChat, setShowChat] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [novoTexto, setNovoTexto] = useState("");
  const [temNovaMensagem, setTemNovaMensagem] = useState(false);
  const [totalMensagensAntigo, setTotalMensagensAntigo] = useState(0);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
      setTemNovaMensagem(false); // Limpa notificação ao abrir
    }
  }, [mensagens, showChat]);

  // Fecha chat se pedido for finalizado
  useEffect(() => {
    if (pedido && ["ENTREGUE", "CANCELADO"].includes(pedido.status)) {
      setShowChat(false);
    }
  }, [pedido?.status]);

  // --- LÓGICA DE MENSAGENS ---
  const buscarMensagens = useCallback(async () => {
    try {
      const url = `https://traga-rapido.fimbatec.com/mensagem/pedidos/${id}/mensagens/`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        
        // Lógica de Notificação: Se aumentou o número de msgs e o chat está fechado
        if (data.length > totalMensagensAntigo && !showChat && totalMensagensAntigo !== 0) {
          setTemNovaMensagem(true);
        }
        
        setTotalMensagensAntigo(data.length);
        setMensagens([...data].reverse());
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  }, [id, showChat, totalMensagensAntigo]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novoTexto.trim() || !pedido) return;

    try {
      const url = `https://traga-rapido.fimbatec.com/mensagem/pedidos/${id}/mensagens/`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          texto: novoTexto,
          remetente: pedido.solicitante 
        }),
      });

      if (resp.ok) {
        setNovoTexto("");
        buscarMensagens();
      } else {
        toast.error("Erro ao enviar mensagem");
      }
    } catch (err) {
      toast.error("Erro na conexão");
    }
  };

  // --- BUSCA DE DADOS DO PEDIDO ---
  const buscarPosicaoRealTime = useCallback(async (pedidoId) => {
    if (!pedidoId) return;
    try {
      const url = `https://traga-rapido.fimbatec.com/rastreamento/pedidos/${pedidoId}/posicoes/`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          const ultimaPos = data[0];
          setPosicaoEntregador([parseFloat(ultimaPos.latitude), parseFloat(ultimaPos.longitude)]);
        }
      }
    } catch (err) { console.error(err); }
  }, []);

  const carregarPedido = useCallback(async (isAutoRefresh = false) => {
    try {
      const data = await obterPedidoPorId(id);
      setPedido(data);
      
      if (["ENTREGADOR_A_CAMINHO", "ITEM_RETIRADO", "EM_ENTREGA"].includes(data.status)) {
        buscarPosicaoRealTime(id);
      }
      
      // Polling de mensagens se o chat não estiver bloqueado pelo status
      if (!["ENTREGUE", "CANCELADO"].includes(data.status)) {
        buscarMensagens();
      }

      if (data.entregador && !entregadorInfo) {
        const user = await getUsuario(data.entregador);
        setEntregadorInfo(user);
      }
      if (data.origem_latitude && rotaCaminho.length === 0) {
        calcularRota(data.origem_latitude, data.origem_longitude, data.destino_latitude, data.destino_longitude);
      }
    } catch (err) {
      if (!isAutoRefresh) toast.error("Erro ao carregar");
    }
  }, [id, buscarPosicaoRealTime, buscarMensagens, entregadorInfo, rotaCaminho.length]);

  useEffect(() => {
    carregarPedido(false);
    const interval = setInterval(() => carregarPedido(true), 5000);
    return () => clearInterval(interval);
  }, [carregarPedido]);

  const calcularRota = async (lat1, lon1, lat2, lon2) => {
    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`);
      const data = await resp.json();
      if (data.routes?.length > 0) {
        setRotaCaminho(data.routes[0].geometry.coordinates.map((p) => [p[1], p[0]]));
      }
    } catch (err) { console.error(err); }
  };

  const handleCancelarPedido = async () => {
    if (!window.confirm("Deseja cancelar?")) return;
    try {
      await cancelarPedido(pedido.id);
      toast.success("Cancelado");
      carregarPedido(false);
    } catch (error) { toast.error("Erro"); }
  };

  const handleEnviarAvaliacao = async (e) => {
    e.preventDefault();
    setEnviandoAvaliacao(true);
    try {
      await criarAvaliacao({ estrelas, comentario, pedido: id });
      toast.success("Avaliado!");
      setShowAvaliacaoForm(false);
    } catch (error) { toast.error("Erro"); }
    finally { setEnviandoAvaliacao(false); }
  };

  const DetalheItem = ({ label, value, icon, children }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <i className={`fas fa-${icon} text-blue-600 text-lg shrink-0`}></i>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {children || <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>}
      </div>
    </div>
  );

  if (!pedido) return <div className="p-10 text-center font-bold text-blue-600"><i className="fas fa-spinner fa-spin mr-2"></i>Carregando Pedido...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarSolicitante sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="h-20 w-full"></div>
          <div className="max-w-6xl mx-auto space-y-6 pb-10">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-800 uppercase">
                  {pedido.titulo} <span className="text-blue-600 text-sm">#{pedido.id.substring(0,8)}</span>
                </h1>
                <span className="mt-2 inline-block px-4 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                  {pedido.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                {/* BOTÃO CHAT COM NOTIFICAÇÃO E TRAVA DE STATUS */}
                {pedido.entregador && !["ENTREGUE", "CANCELADO"].includes(pedido.status) && (
                  <button 
                    onClick={() => { setShowChat(true); buscarMensagens(); }} 
                    className="relative flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-comments"></i> CHAT
                    {temNovaMensagem && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                      </span>
                    )}
                  </button>
                )}
                
                {pedido.status === "ENTREGUE" ? (
                  <button onClick={() => setShowAvaliacaoForm(true)} className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                    AVALIAR
                  </button>
                ) : (pedido.status !== "CANCELADO" && (
                  <button onClick={handleCancelarPedido} className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition">
                    CANCELAR
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-black text-gray-400 text-xs uppercase mb-4 tracking-widest">Informações</h3>
                  <div className="space-y-3">
                    <DetalheItem label="Entregador" value={entregadorInfo?.username || "Aguardando..."} icon="motorcycle" />
                    {entregadorInfo?.telefone && (
                      <DetalheItem label="Contato" icon="phone-alt">
                        <a href={`tel:${entregadorInfo.telefone}`} className="text-blue-600 font-bold">{entregadorInfo.telefone}</a>
                      </DetalheItem>
                    )}
                    <DetalheItem label="Valor" value={`Kz ${pedido.valor_final || pedido.valor_sugerido}`} icon="wallet" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                  <div className="p-3 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700"><i className="fas fa-map-marked-alt mr-2 text-blue-600"></i>Rastreamento</h3>
                  </div>
                  <div className="w-full h-[450px] rounded-lg overflow-hidden relative z-10">
                    <button onClick={() => setForceMapUpdate(v => v+1)} className="absolute top-4 right-4 z-1000 bg-white p-2 rounded shadow-lg text-blue-600 font-bold text-xs">
                      CENTRALIZAR
                    </button>
                    <MapContainer center={[pedido.origem_latitude, pedido.origem_longitude]} zoom={14} className="w-full h-full">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[pedido.origem_latitude, pedido.origem_longitude]} icon={iconPonto} />
                      <Marker position={[pedido.destino_latitude, pedido.destino_longitude]} icon={iconPonto} />
                      {posicaoEntregador && pedido.status !== "ENTREGUE" && (
                        <Marker position={posicaoEntregador} icon={deliveryIcon} />
                      )}
                      {rotaCaminho.length > 0 && <Polyline positions={rotaCaminho} color="#2563eb" weight={3} opacity={0.4} dashArray="5, 10" />}
                      <MapController positions={[[pedido.origem_latitude, pedido.origem_longitude], [pedido.destino_latitude, pedido.destino_longitude], posicaoEntregador]} forceUpdate={forceMapUpdate} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL DE CHAT --- */}
      {showChat && (
        <div className="fixed inset-0 z-150 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-[90vh] sm:h-[600px] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 bg-blue-700 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h3 className="font-bold leading-tight">{entregadorInfo?.username || 'Entregador'}</h3>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Chat Ativo</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-black/10 rounded-full transition">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin">
              {mensagens.map((msg, idx) => {
                // Identifica se a mensagem foi enviada pelo solicitante
                const isMe = String(msg.remetente) === String(pedido.solicitante);
                
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-200`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.texto}</p>
                      <span className={`text-[9px] block mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.data_envio || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={enviarMensagem} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                placeholder="Diga algo ao entregador..."
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              <button type="submit" disabled={!novoTexto.trim()} className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 active:scale-95">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE AVALIAÇÃO */}
      {showAvaliacaoForm && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">Como foi o serviço?</h3>
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setEstrelas(n)} className="text-3xl transition transform hover:scale-110">
                  <i className={`${estrelas >= n ? 'fas text-yellow-400' : 'far text-gray-300'} fa-star`}></i>
                </button>
              ))}
            </div>
            <textarea 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
              className="w-full border border-gray-200 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" 
              placeholder="Conte-nos mais sobre o serviço..." 
            />
            <div className="flex gap-2">
              <button onClick={() => setShowAvaliacaoForm(false)} className="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600 transition">CANCELAR</button>
              <button onClick={handleEnviarAvaliacao} disabled={enviandoAvaliacao} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-50">
                {enviandoAvaliacao ? <i className="fas fa-circle-notch fa-spin"></i> : "ENVIAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}