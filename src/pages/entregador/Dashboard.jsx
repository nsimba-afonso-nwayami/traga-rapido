import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
// Importações ESSENCIAIS para o mapa Leaflet
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- CONFIGURAÇÃO LEAFLET ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícone Customizado para o Entregador (Azul)
const EntregadorIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="%232563EB"%3E%3Cpath d="M544 192c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-256 0c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-32-96h-32c-17.67 0-32-14.33-32-32s14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32zM320 0c-35.35 0-64 28.65-64 64V320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64H320zm-64 32c0 17.67-14.33 32-32 32H64c-17.67 0-32-14.33-32-32s14.33-32 32-32h160c17.67 0 32 14.33 32 32zM64 48c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32H96c-17.67 0-32-14.33-32-32zM576 448c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V352c0-35.35 28.65-64 64-64h448c35.35 0 64 28.65 64 64v96z"%3E%3C/path%3E%3C/svg%3E',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DashboardEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Dados Mockados de Localização (Simulação de Luanda)
  const posicaoEntregador = [-8.839988, 13.289415];
  const raioAtuacaoMetros = 5000;

  // Dados Mockados para o Dashboard
  const stats = [
    {
      title: "Ganhos Hoje",
      value: "AOA 5.250",
      icon: "fas fa-wallet",
      color: "text-green-500",
    },
    {
      title: "Corridas Finalizadas",
      value: "3",
      icon: "fas fa-check-circle",
      color: "text-blue-500",
    },
    {
      title: "Média de Avaliação",
      value: "4.8/5.0",
      icon: "fas fa-star",
      color: "text-yellow-500",
    },
  ];

  const handleToggleOnline = () => setIsOnline(!isOnline);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* HEADER FIXO */}
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />

        {/* ÁREA DE CONTEÚDO COM ROLAGEM PRÓPRIA */}
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6 space-y-8">
          {/* ESPAÇADOR MANUAL: Garante que o conteúdo comece DEPOIS do header fixo */}
          <div className="h-20 w-full shrink-0"></div>

          {/* 1. CONTROLE DE STATUS ONLINE */}
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
                } transition-colors duration-300`}
              >
                {isOnline ? "Em Serviço" : "Descansando"}
              </span>
            </h3>

            <div className="flex items-center justify-between sm:justify-start sm:gap-6">
              <p className="text-gray-600 text-sm sm:text-base">
                {isOnline
                  ? "Você está online e pronto para receber novas corridas."
                  : "Você está offline. Mude o status para receber pedidos."}
              </p>
              <div
                onClick={handleToggleOnline}
                className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 shadow-inner ${
                  isOnline
                    ? "bg-green-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <div className="bg-white w-6 h-6 rounded-full shadow-md"></div>
              </div>
            </div>
          </section>

          {/* 2. CARTÕES DE DESEMPENHO */}
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

          {/* 3. MAPA DE ATUAÇÃO (Leaflet) */}
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
                  <p className="text-sm text-gray-200 mt-1 text-center">
                    Fique online para que possamos rastrear sua posição e enviar
                    pedidos.
                  </p>
                  <button
                    onClick={handleToggleOnline}
                    className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
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
                {isOnline && (
                  <Marker position={[-8.83, 13.295]}>
                    <Popup>
                      <strong>Nova Corrida Próxima!</strong>
                      <br />
                      AOA 1.800 | 1.5 km
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </section>

          {/* ESPAÇADOR INFERIOR (Opcional, para respiro) */}
          <div className="h-10 w-full shrink-0"></div>
        </main>
      </div>
    </div>
  );
}
