import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
// Importações ESSENCIAIS para o mapa Leaflet
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- CONFIGURAÇÃO LEAFLET ---
// Correção dos ícones padrão do Leaflet no Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícone Customizado para o Solicitante (Verde/Ponto de Entrega)
const SolicitanteIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="%2310B981"%3E%3Cpath d="M416 0H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32zM128 448H64V256h64v192zm128 0h-64V64h64v384zm128 0h-64V128h64v320z"%3E%3C/path%3E%3C/svg%3E',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const centroServico = [-8.839988, 13.289415]; // Centro aproximado de Luanda
const raioServicoMetros = 10000; // Raio de serviço de 10km (Simulação)
// --- FIM DADOS MOCKADOS ---

export default function DashboardSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Simulação de estado de carregamento

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {" "}
      {/* overflow-hidden evita scroll duplo na página toda */}
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* HEADER FIXO */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE CONTEÚDO COM ROLAGEM PRÓPRIA */}
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6">
          {/* ESPAÇADOR MANUAL: Isso garante que o conteúdo comece DEPOIS do header */}
          <div className="h-20 w-full"></div>

          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <i className="fas fa-map-marked-alt mr-2 text-blue-600"></i>
              Área de Cobertura de Serviço
            </h3>

            {/* MAPA */}
            <div className="h-[450px] w-full rounded-lg overflow-hidden relative border border-gray-100 z-0">
              <MapContainer
                center={centroServico}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={centroServico} icon={SolicitanteIcon} />
                <Circle
                  center={centroServico}
                  radius={raioServicoMetros}
                  pathOptions={{
                    color: "#3B82F6",
                    fillColor: "#93C5FD",
                    fillOpacity: 0.1,
                  }}
                />
              </MapContainer>
            </div>

            <p className="text-sm text-gray-500 mt-4 italic">
              * Certifique-se de que o destino da entrega está dentro do raio
              azul.
            </p>
          </section>

          {/* ESPAÇADOR INFERIOR: Garante que o texto acima não fique atrás do botão azul */}
          <div className="h-32 w-full"></div>
        </main>

        {/* BOTÃO FIXO INFERIOR */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-1001 flex justify-center">
          <div className="max-w-5xl w-full">
            <Link
              to="/dashboard/solicitante/novo-pedido"
              className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95"
            >
              <i className="fas fa-motorcycle mr-3 text-xl"></i>
              SOLICITAR NOVO PEDIDO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
