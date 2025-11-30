import { useState } from "react"; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importa o CSS do Leaflet para os estilos do mapa
import L from 'leaflet'; // Necessário para criar ícones customizados

// Define um ícone customizado para o marcador (CORRIGE o ícone padrão quebrado do Leaflet)
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function DetalhesDoPedido() {
  // ADIÇÃO DO STATE para controle do menu lateral
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Componente de Bloco de Detalhes para Reutilização
  // Mantido como função pura para estruturar o layout
  const DetalheItem = ({ label, value, icon }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <i className={`fas fa-${icon} text-blue-600 text-lg shrink-0`}></i>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800 wrap-break-word">{value}</p> {/* Alterado para break-words para compatibilidade Tailwind moderna */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`
          bg-blue-700/90 backdrop-blur-xl border-r border-blue-700
          w-64 fixed top-0 left-0 h-screen p-6 shadow-xl
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-9999
        `}
      >
        {/* BOTÃO DE FECHAR (MOBILE) */}
        <button
          className="md:hidden absolute top-4 right-4 text-2xl text-white"
          onClick={() => setSidebarOpen(false)} // Adiciona onClick para fechar o menu
        >
          <i className="fas fa-times"></i>
        </button>

        <h1 className="text-2xl font-bold mb-10 tracking-wide mt-6 md:mt-0 text-white">
          TRAGA<span className="text-blue-500">Rápido</span>
        </h1>

        <nav className="space-y-4 text-lg text-white">
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i> Dashboard
          </a>
          {/* Link Ativo (para exemplificar) */}
          <a className="block p-3 rounded-lg bg-blue-500/40 font-bold cursor-pointer">
            <i className="fas fa-box mr-3 text-white"></i> Meus Pedidos
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i> Criar Novo Pedido
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-history mr-3 text-blue-500"></i> Histórico
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-gear mr-3 text-blue-500"></i> Configurações
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i> Logout
          </a>
        </nav>
      </aside>

      {/* BACKDROP MOBILE (Adiciona o backdrop para fechar ao clicar fora) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-9000"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          {/* BOTÃO DE ABRIR (MOBILE) */}
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)} // Adiciona onClick para alternar o estado (abrir/fechar)
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            Detalhes do Pedido #1007
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
             <button className="relative text-xl sm:text-2xl text-blue-500 hover:text-blue-400 transition-all">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">Usuário</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN AREA - DETALHES DO PEDIDO */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* 1. HEADER DO PEDIDO E AÇÕES */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Documentos Urgentes (Pedido #1007)
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Criado em: 20/Nov/2025 às 10:30
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <span className="px-3 py-1 text-sm font-bold rounded-full bg-blue-500/40 text-blue-800 border border-blue-500">
                  Status: Em Rota
                </span>
                <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 transition">
                  <i className="fas fa-ban mr-2"></i> Cancelar Pedido
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition">
                  <i className="fas fa-receipt mr-2"></i> Ver Fatura
                </button>
              </div>
            </div>

            {/* 2. INFORMAÇÕES GERAIS E RASTREAMENTO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* BLOCO ESQUERDO: INFORMAÇÕES GERAIS */}
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow border border-gray-300 space-y-4">
                <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">
                  <i className="fas fa-info-circle mr-2 text-blue-600"></i> Dados do Item
                </h3>
                <div className="space-y-3">
                  <DetalheItem label="Peso Estimado" value="0.5 kg" icon="weight-hanging" />
                  <DetalheItem label="Entregador Alocado" value="Pedro Silva" icon="user-circle" />
                  <DetalheItem label="Valor Final (Cotação)" value="R$ 45.00" icon="dollar-sign" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-700 mt-6 mb-4 pb-2 border-b">
                  <i className="fas fa-file-alt mr-2 text-blue-600"></i> Descrição
                </h3>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                  Documentos importantes. Entregar diretamente ao Sr. Carlos na recepção. O pacote é frágil, manusear com cuidado.
                </p>
              </div>

              {/* BLOCO CENTRAL E DIREITO: MAPA, RASTREAMENTO E ENDEREÇOS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 🗺️ BLOCO DO MAPA COM LEAFLET (OpenStreetMap) */}
                <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    <i className="fas fa-location-crosshairs mr-3"></i> Acompanhamento Leaflet (Luanda)
                  </h3>
                  
                  {/* MapContainer do Leaflet */}
                  <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-300 z-0">
                      <MapContainer 
                          // Coordenadas de Luanda (Rua 13 de Janeiro - Exemplo)
                          center={[-8.8188, 13.2384]} 
                          zoom={13} 
                          scrollWheelZoom={false}
                          className="w-full h-full"
                      >
                          {/* Camada do OpenStreetMap */}
                          <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          {/* Marcador do Entregador (posicionamento estático para exemplo) */}
                          <Marker position={[-8.8188, 13.2384]} icon={customIcon}>
                              <Popup>
                                  Entregador: Pedro Silva<br/>
                                  Em: Rua 13 de Janeiro.
                              </Popup>
                          </Marker>
                      </MapContainer>
                  </div>
                </div>

                {/* RASTREAMENTO (Timeline/Histórico) */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                  <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center">
                    <i className="fas fa-map-marked-alt mr-3"></i> Rastreamento e Linha do Tempo
                  </h3>
                  
                  {/* Timeline Placeholder */}
                  <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                    {/* Evento Ativo/Atual */}
                    <div className="relative">
                      <div className="absolute -left-[1.35rem] top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                        <i className="fas fa-truck text-white text-xs"></i>
                      </div>
                      <p className="text-sm font-bold text-blue-700">Entregador a caminho do Destino</p>
                      <p className="text-xs text-gray-500">20/Nov/2025 - 15:45 | Status: Em Rota</p>
                    </div>
                    
                    {/* Evento Passado */}
                    <div className="relative mt-6">
                      <div className="absolute -left-[1.35rem] top-0 w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Item Coletado pelo Entregador</p>
                      <p className="text-xs text-gray-500">20/Nov/2025 - 14:10 | Origem: São Paulo/SP</p>
                    </div>

                    {/* Evento Passado */}
                    <div className="relative mt-6">
                      <div className="absolute -left-[1.35rem] top-0 w-6 h-6 bg-gray-400 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                        <i className="fas fa-clipboard-list text-white text-xs"></i>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Pedido Confirmado e Aguardando Coleta</p>
                      <p className="text-xs text-gray-500">20/Nov/2025 - 11:00</p>
                    </div>
                  </div>
                </div>

                {/* ENDEREÇOS DE ORIGEM E DESTINO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* ORIGEM */}
                    <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                        <h4 className="font-bold text-md text-green-700 flex items-center mb-2">
                            <i className="fas fa-location-arrow mr-2"></i> Origem
                        </h4>
                        <p className="text-sm text-gray-700">
                            Av. Paulista, 1000 - Bela Vista<br />
                            São Paulo/SP - CEP: 01310-100
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Ponto de Contato: Solicitante (Você)</p>
                    </div>

                    {/* DESTINO */}
                    <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                        <h4 className="font-bold text-md text-red-700 flex items-center mb-2">
                            <i className="fas fa-flag-checkered mr-2"></i> Destino
                        </h4>
                        <p className="text-sm text-gray-700">
                            Rua Primeiro de Março, 20<br />
                            Centro, Rio de Janeiro/RJ - CEP: 20010-000
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Receptor: Carlos Pereira</p>
                    </div>
                </div>

              </div>
              
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}