import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Importações dos serviços
import {
  listarPedidosDisponiveis,
  listarHistoricoEntregador,
} from "../../services/pedidoService";
import { getUsuario } from "../../services/usuarioService";
import { listarAvaliacoes } from "../../services/avaliacaoService";

// --- CONFIGURAÇÃO LEAFLET ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const EntregadorIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="%232563EB"%3E%3Cpath d="M544 192c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-256 0c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-32-96h-32c-17.67 0-32-14.33-32-32s14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32zM320 0c-35.35 0-64 28.65-64 64V320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64H320zm-64 32c0 17.67-14.33 32-32 32H64c-17.67 0-32-14.33-32-32s14.33-32 32-32h160c17.67 0 32 14.33 32 32zM64 48c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32H96c-17.67 0-32-14.33-32-32zM576 448c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V352c0-35.35 28.65-64 64-64h448c35.35 0 64 28.65 64 64v96z"%3E%3C/path%3E%3C/svg%3E',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
});

export default function DashboardEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [ultimoPedido, setUltimoPedido] = useState(null);

  // Estado para armazenar os cálculos reais
  const [dadosCards, setDadosCards] = useState({
    ganhosHoje: 0,
    corridasHoje: 0,
    avaliacaoMedia: 0,
  });

  const audioNotificacao = useRef(
    new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"
    )
  );

  const posicaoEntregador = [-8.839988, 13.289415];
  const raioAtuacaoMetros = 5000;

  const carregarDadosDashboard = async () => {
    try {
      // 1. Carregar Pedido Mais Recente para Alerta
      const pedidos = await listarPedidosDisponiveis();
      if (pedidos.length > 0) {
        const p = pedidos[0];
        if (!ultimoPedido || ultimoPedido.id !== p.id) {
          const u = await getUsuario(p.solicitante);
          setUltimoPedido({ ...p, usernameSolicitante: u.username });
          audioNotificacao.current.play().catch(() => {});
        }
      } else {
        setUltimoPedido(null);
      }

      // 2. Buscar Histórico para calcular Ganhos e Corridas de HOJE
      const historico = await listarHistoricoEntregador();
      const hojeStr = new Date().toLocaleDateString("pt-BR");

      const concluidosHoje = historico.filter((p) => {
        const dataPedido = new Date(p.criado_em).toLocaleDateString("pt-BR");
        return p.status === "ENTREGUE" && dataPedido === hojeStr;
      });

      const totalGanhosHoje = concluidosHoje.reduce(
        (acc, curr) => acc + parseFloat(curr.valor_sugerido || 0),
        0
      );

      // 3. Buscar Avaliações para calcular a Média Real
      const avaliacoes = await listarAvaliacoes();
      // Filtra avaliações que pertencem aos pedidos do histórico deste entregador
      const minhasAvaliacoes = avaliacoes.filter((av) =>
        historico.some((h) => h.id === av.pedido)
      );

      const media =
        minhasAvaliacoes.length > 0
          ? minhasAvaliacoes.reduce((acc, curr) => acc + curr.estrelas, 0) /
            minhasAvaliacoes.length
          : 0;

      // Atualiza o estado consolidado
      setDadosCards({
        ganhosHoje: totalGanhosHoje,
        corridasHoje: concluidosHoje.length,
        avaliacaoMedia: media.toFixed(1),
      });
    } catch (error) {
      console.error("Erro ao atualizar dados do dashboard:", error);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
    const intervalo = setInterval(carregarDadosDashboard, 5000);
    return () => clearInterval(intervalo);
  }, [ultimoPedido]);

  // Estrutura dos cards consumindo o estado dinâmico
  const stats = [
    {
      title: "Ganhos Hoje",
      value: `AOA ${dadosCards.ganhosHoje.toLocaleString("pt-BR")}`,
      icon: "fas fa-wallet",
      color: "text-green-500",
    },
    {
      title: "Corridas Finalizadas",
      value: dadosCards.corridasHoje.toString(),
      icon: "fas fa-check-circle",
      color: "text-blue-500",
    },
    {
      title: "Média de Avaliação",
      value: `${dadosCards.avaliacaoMedia}/5.0`,
      icon: "fas fa-star",
      color: "text-yellow-500",
    },
  ];

  const handleToggleOnline = () => setIsOnline(!isOnline);

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
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />

        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6 space-y-8 pb-10">
          <div className="h-20 w-full shrink-0"></div>

          {/* 1. STATUS */}
          <section
            className="bg-white p-6 rounded-xl shadow-lg border-t-4"
            style={{ borderColor: isOnline ? "#10B981" : "#EF4444" }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-between">
              Status de Disponibilidade
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isOnline ? "Em Serviço" : "Descansando"}
              </span>
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {isOnline
                  ? "Você está online e pronto para receber novas corridas."
                  : "Você está offline. Mude o status para receber pedidos."}
              </p>
              <div
                onClick={handleToggleOnline}
                className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                  isOnline
                    ? "bg-green-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <div className="bg-white w-6 h-6 rounded-full shadow-md"></div>
              </div>
            </div>
          </section>

          {/* 2. STATS DINÂMICOS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-blue-500"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`text-4xl ${stat.color} opacity-80`}>
                  <i className={stat.icon}></i>
                </div>
              </div>
            ))}
          </section>

          {/* 3. PEDIDO MAIS RECENTE */}
          {ultimoPedido && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-bolt mr-2 text-yellow-500 animate-bounce"></i>{" "}
                Novo pedido disponível!
              </h3>
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600 p-5 sm:p-6 ring-2 ring-blue-500 ring-opacity-50">
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-gray-900">
                      {ultimoPedido.titulo}
                    </h4>
                    <p className="text-sm text-blue-600 font-semibold">
                      Solicitante: {ultimoPedido.usernameSolicitante}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      AOA {ultimoPedido.valor_sugerido}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p className="flex items-center">
                    <i className="fas fa-location-arrow text-blue-500 mr-2"></i>{" "}
                    {ultimoPedido.origem_endereco}
                  </p>
                  <p className="flex items-center">
                    <i className="fas fa-flag-checkered text-red-500 mr-2"></i>{" "}
                    {ultimoPedido.destino_endereco}
                  </p>
                </div>
                <Link
                  to="/dashboard/entregador/lista-pedidos"
                  className="w-full flex items-center justify-center py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Ver Detalhes e Aceitar
                </Link>
              </div>
            </section>
          )}

          {/* 4. MAPA */}
          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <i className="fas fa-map-marked-alt mr-2 text-blue-500"></i> Sua
              Área de Atuação
            </h3>
            <div className="h-[450px] w-full rounded-lg overflow-hidden relative border border-gray-100 z-0">
              {!isOnline && (
                <div className="absolute inset-0 z-1000 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-center">
                  <i className="fas fa-lock text-5xl text-white mb-3"></i>
                  <p className="text-xl font-bold text-white">
                    Mapa Desativado
                  </p>
                  <button
                    onClick={handleToggleOnline}
                    className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg"
                  >
                    Ficar Online Agora
                  </button>
                </div>
              )}
              <MapContainer
                center={posicaoEntregador}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                className={isOnline ? "grayscale-0" : "grayscale"}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={posicaoEntregador} icon={EntregadorIcon} />
                <Circle
                  center={posicaoEntregador}
                  radius={raioAtuacaoMetros}
                  pathOptions={{
                    color: "#3B82F6",
                    fillColor: "#93C5FD",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
              </MapContainer>
            </div>
          </section>

          <div className="h-10 w-full shrink-0"></div>
        </main>
      </div>
    </div>
  );
}
