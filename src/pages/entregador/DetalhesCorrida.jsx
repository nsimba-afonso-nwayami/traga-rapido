import { useState } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
// Importações ESSENCIAIS para o mapa Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Importação do CSS do Leaflet (necessário para o mapa funcionar)
import 'leaflet/dist/leaflet.css';
// Importação para corrigir ícones do Leaflet que quebram no React
import L from 'leaflet';

// Correção dos ícones padrão do Leaflet no Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Ícone Customizado para o Entregador (motocicleta)
// Para usar o ícone da motocicleta, precisaria de um arquivo SVG/PNG ou configurar o FontAwesome no Leaflet,
// mas para fins de layout, usaremos o marcador padrão com a cor do Entregador.
const EntregadorIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="%232563EB"%3E%3Cpath d="M544 192c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-256 0c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V64c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v128zm-32-96h-32c-17.67 0-32-14.33-32-32s14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32zM320 0c-35.35 0-64 28.65-64 64V320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64H320zm-64 32c0 17.67-14.33 32-32 32H64c-17.67 0-32-14.33-32-32s14.33-32 32-32h160c17.67 0 32 14.33 32 32zM64 48c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32s-14.33 32-32 32H96c-17.67 0-32-14.33-32-32zM576 448c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V352c0-35.35 28.65-64 64-64h448c35.35 0 64 28.65 64 64v96z"%3E%3C/path%3E%3C/svg%3E',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default function DetalhesCorrida() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dados Estáticos de Localização (Simulação de Luanda)
  const posicaoInicial = [-8.839988, 13.289415]; // Centro aproximado de Luanda
  const posicaoEntregador = [-8.845, 13.285]; // Posição atual do entregador (mock)
  const posicaoOrigem = [-8.84, 13.295]; // Posição de Coleta (mock)
  const posicaoDestino = [-8.85, 13.28]; // Posição de Entrega (mock)

  // Dados Estáticos da Corrida
  const corridaEstatica = {
    id: '1008',
    valor: 'AOA 1.800',
    origem: 'Rua do Comércio, 12 - Luanda',
    destino: 'Condomínio Sol Nascente, Apto 302',
    distanciaRestante: '2.1 km',
    tempoEstimado: '12 min',
  };
  
  // Função Placeholder para o botão de ação
  const handleAcao = () => {
      console.log("Ação do Entregador (Cheguei na Origem) acionada.");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {/* HEADER */}
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN AREA - DETALHES DA CORRIDA */}
        <main className="flex-1 flex flex-col p-0 overflow-hidden">
          
          {/* PAINEL DE INFORMAÇÃO SUPERIOR */}
          <div className="bg-white p-4 sm:p-6 shadow-lg border-b border-gray-200 z-10">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-gray-800">
                    <i className="fas fa-map-pin mr-2 text-red-500"></i> Rota para a ORIGEM (Coleta)
                </h3>
                <span className="text-2xl font-extrabold text-green-600">{corridaEstatica.valor}</span>
            </div>
            
            <p className="text-sm sm:text-lg text-gray-600 font-medium">
                {corridaEstatica.origem}
            </p>
            
            {/* Métricas da Rota */}
            <div className="mt-3 flex items-center space-x-6 text-gray-500 text-sm">
                <div className="flex items-center">
                    <i className="fas fa-road mr-2 text-base"></i>
                    <span>{corridaEstatica.distanciaRestante} Restantes</span>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-clock mr-2 text-base"></i>
                    <span>{corridaEstatica.tempoEstimado} de Viagem</span>
                </div>
            </div>
          </div>

          {/* ÁREA DO MAPA (Leaflet Real) */}
          <div className="flex-1 relative z-0">
            {/* O Mapa Container DEVE ter uma altura definida, e flex-1 faz isso aqui */}
            <MapContainer 
              center={posicaoInicial} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Marcador do Entregador (Motocicleta) - Mockado */}
              <Marker position={posicaoEntregador} icon={EntregadorIcon}>
                <Popup>
                  Sua posição atual (Atualização em Tempo Real)
                </Popup>
              </Marker>

              {/* Marcador da Origem (Ponto de Coleta) - Mockado */}
              <Marker position={posicaoOrigem}>
                <Popup>
                  <strong className="text-red-600">Ponto de Coleta (Origem)</strong>
                </Popup>
              </Marker>
              
              {/* Marcador do Destino (Ponto de Entrega) - Mockado */}
              {/* Este só seria visível após a coleta na lógica real */}
              <Marker position={posicaoDestino}>
                <Popup>
                  <strong className="text-blue-600">Ponto de Entrega (Destino)</strong>
                </Popup>
              </Marker>
              
              {/* Linhas da Rota - LÓGICA A SER ADICIONADA: Usar Polylines para desenhar o caminho */}

            </MapContainer>
          </div>

          {/* ÁREA DE CONTROLE DE AÇÃO (BOTTOM BAR) */}
          <div className="bg-white p-4 sm:p-6 shadow-2xl border-t border-gray-200 z-10">
            <button
                onClick={handleAcao}
                className={`w-full py-4 text-xl font-bold text-white rounded-lg shadow-lg transition-all duration-200 bg-yellow-500 hover:bg-yellow-600`}
            >
                <i className="fas fa-arrow-circle-right mr-3"></i> Cheguei na Origem
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}