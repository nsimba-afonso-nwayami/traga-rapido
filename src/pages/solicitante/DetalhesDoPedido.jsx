import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { obterPedidoPorId, cancelarPedido } from "../../services/pedidoService";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DetalhesDoPedido() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    async function carregarPedido() {
      try {
        const data = await obterPedidoPorId(id);
        setPedido(data);
      } catch {
        toast.error("Erro ao carregar pedido");
      }
    }
    carregarPedido();
  }, [id]);

  const handleCancelarPedido = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      await cancelarPedido(pedido.id);
      toast.success("Pedido cancelado com sucesso");

      // Atualiza a página toda com o novo estado
      const data = await obterPedidoPorId(pedido.id);
      setPedido(data);
    } catch (error) {
      toast.error("Não foi possível cancelar o pedido");
    }
  };

  const DetalheItem = ({ label, value, icon }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <i className={`fas fa-${icon} text-blue-600 text-lg shrink-0`}></i>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800 wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );

  if (!pedido) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {pedido.titulo} (Pedido #{pedido.id})
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Criado em: {new Date(pedido.criado_em).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <span className="px-3 py-1 text-sm font-bold rounded-full bg-blue-500/40 text-blue-800 border border-blue-500">
                  Status: {pedido.status}
                </span>
              </div>

              <button
                onClick={handleCancelarPedido}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 transition"
              >
                <i className="fas fa-ban mr-2"></i> Cancelar Pedido
              </button>
            </div>

            {/* CONTEÚDO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* DADOS */}
              <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow border border-gray-300 space-y-4">
                <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">
                  <i className="fas fa-info-circle mr-2 text-blue-600"></i>
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
                    value={
                      pedido.entregador
                        ? pedido.entregador.nome
                        : "Aguardando propostas"
                    }
                    icon="user-circle"
                  />
                  <DetalheItem
                    label="Valor"
                    value={`Kz ${pedido.valor_final ?? pedido.valor_sugerido}`}
                    icon="dollar-sign"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-700 mt-6 mb-4 pb-2 border-b">
                  <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                  Descrição
                </h3>

                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                  {pedido.descricao}
                </p>
              </div>

              {/* MAPA E ENDEREÇOS */}
              <div className="lg:col-span-2 space-y-6">
                {/* MAPA */}
                <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    <i className="fas fa-location-crosshairs mr-3"></i>
                    Acompanhamento Leaflet
                  </h3>

                  <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-300 z-0">
                    <MapContainer
                      center={
                        pedido.origem_latitude && pedido.origem_longitude
                          ? [pedido.origem_latitude, pedido.origem_longitude]
                          : [-8.8188, 13.2384]
                      }
                      zoom={13}
                      scrollWheelZoom={false}
                      className="w-full h-full"
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {pedido.origem_latitude && pedido.origem_longitude && (
                        <Marker
                          position={[
                            pedido.origem_latitude,
                            pedido.origem_longitude,
                          ]}
                          icon={customIcon}
                        >
                          <Popup>Origem: {pedido.origem_endereco}</Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </div>

                {/* ENDEREÇOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                    <h4 className="font-bold text-md text-green-700 flex items-center mb-2">
                      <i className="fas fa-location-arrow mr-2"></i> Origem
                    </h4>
                    <p className="text-sm text-gray-700">
                      {pedido.origem_endereco}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow border border-gray-300">
                    <h4 className="font-bold text-md text-red-700 flex items-center mb-2">
                      <i className="fas fa-flag-checkered mr-2"></i> Destino
                    </h4>
                    <p className="text-sm text-gray-700">
                      {pedido.destino_endereco}
                    </p>
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
