import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
// Importações ESSENCIAIS para o mapa Leaflet
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIGURAÇÃO LEAFLET ---
// Correção dos ícones padrão do Leaflet no Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Ícone Customizado para o Solicitante (Verde/Ponto de Entrega)
const SolicitanteIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="%2310B981"%3E%3Cpath d="M416 0H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32zM128 448H64V256h64v192zm128 0h-64V64h64v384zm128 0h-64V128h64v320z"%3E%3C/path%3E%3C/svg%3E',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- DADOS MOCKADOS (SIMULAÇÃO) ---
const mockStats = [
  { title: "Pedidos Totais", value: "25", icon: "fas fa-box", color: "text-blue-600" },
  { title: "Pedidos Pendentes", value: "3", icon: "fas fa-clock", color: "text-yellow-600" },
  { title: "Pedidos Concluídos", value: "18", icon: "fas fa-check-circle", color: "text-green-600" },
  { title: "Gasto Total (Mês)", value: "AOA 15.500", icon: "fas fa-wallet", color: "text-indigo-600" },
];

const centroServico = [-8.839988, 13.289415]; // Centro aproximado de Luanda
const raioServicoMetros = 10000; // Raio de serviço de 10km (Simulação)
// --- FIM DADOS MOCKADOS ---

export default function DashboardSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Simulação de estado de carregamento

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {/* Header */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN AREA - DASHBOARD */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-8 sm:space-y-10">

          {/* 1. CARDS DE ESTATÍSTICAS (KPIs) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {mockStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-b-4 border-blue-600 hover:shadow-xl transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.color} opacity-80 shrink-0`}>
                  <i className={stat.icon}></i>
                </div>
              </div>
            ))}
          </section>

          {/* 2. MAPA DE SERVIÇO E BOTÃO DE AÇÃO PRIMÁRIA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 2A. PAINEL DE AÇÃO (COLUNA MENOR) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Inicie seu Pedido
                </h3>
                <p className="text-gray-600 mb-6">
                    Pronto para enviar algo? Comece a nova solicitação de entrega agora.
                </p>

                {/* BOTÃO PARA SOLICITAR PEDIDO (Ação Principal) */}
                <Link
                    to="/dashboard/solicitante/novo-pedido"
                    className={`w-full px-6 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg transition duration-150 flex items-center justify-center 
                       ${
                        loading 
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-blue-700 shadow-md"
                       }
                    `}
                >
                    <i className="fas fa-motorcycle mr-3"></i>
                    Solicitar Novo Pedido
                </Link>

                <p className="text-xs text-gray-400 mt-4 text-center">
                    Verifique o mapa ao lado para garantir que o ponto de coleta está na área de cobertura.
                </p>
            </div>

            {/* 2B. MAPA DE COBERTURA (COLUNA MAIOR) */}
            <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <i className="fas fa-map-marked-alt mr-2 text-blue-600"></i> Área de Cobertura de Serviço
                </h3>
                
                <div className="h-96 w-full rounded-lg overflow-hidden relative">
                    
                    {/* MapContainer do Leaflet */}
                    <MapContainer 
                        center={centroServico} 
                        zoom={12} 
                        scrollWheelZoom={false} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Marcador Central (Sua localização Simulada) */}
                        <Marker position={centroServico} icon={SolicitanteIcon}>
                            <Popup>
                                Seu Ponto de Coleta/Endereço Base
                            </Popup>
                        </Marker>
                        
                        {/* Círculo de Cobertura (10km de raio) */}
                        <Circle 
                            center={centroServico} 
                            radius={raioServicoMetros} 
                            pathOptions={{ 
                                color: '#3B82F6', 
                                fillColor: '#93C5FD', 
                                fillOpacity: 0.1,
                                weight: 2
                            }} 
                        >
                            <Popup>
                                Área de Cobertura de Entrega (10 km)
                            </Popup>
                        </Circle>
                        
                    </MapContainer>
                     
                </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}