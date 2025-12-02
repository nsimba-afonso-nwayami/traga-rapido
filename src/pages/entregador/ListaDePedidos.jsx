import { useState } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function ListaDePedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Dados Mockados de Pedidos Disponíveis
  const pedidosDisponiveis = [
    {
      id: '1008',
      titulo: 'Pacote de Refeição',
      origem: 'Rua do Comércio, 12 - Luanda',
      destino: 'Condomínio Sol Nascente, Apto 302',
      distancia: '2.5 km',
      valor: 'AOA 1.800',
      tempoEstimado: '15 min',
      cor: 'bg-yellow-500', // Indicador visual para tipo/prioridade
    },
    {
      id: '1009',
      titulo: 'Documentos Contábeis',
      origem: 'Av. Deolinda Rodrigues, 500',
      destino: 'Escritório Central, Centro',
      distancia: '6.8 km',
      valor: 'AOA 3.500',
      tempoEstimado: '25 min',
      cor: 'bg-red-500',
    },
    {
      id: '1010',
      titulo: 'Chaves Esquecidas',
      origem: 'Rua Principal, 45',
      destino: 'Hotel Miramar, Suíte 10',
      distancia: '1.2 km',
      valor: 'AOA 1.200',
      tempoEstimado: '8 min',
      cor: 'bg-green-500',
    },
  ];

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
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />

        {/* MAIN AREA - LISTA DE PEDIDOS */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {pedidosDisponiveis.length} Pedidos Próximos
          </h3>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            
            {pedidosDisponiveis.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4" style={{borderColor: pedido.cor}}>
                
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* TÍTULO E ID */}
                  <div className="flex justify-between items-start border-b pb-3 mb-3">
                    <div>
                      <h4 className="text-xl font-extrabold text-gray-900">{pedido.titulo}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Pedido #{pedido.id}</p>
                    </div>
                    
                    {/* VALOR DA CORRIDA */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{pedido.valor}</p>
                      <p className="text-xs text-gray-400">Valor Estimado</p>
                    </div>
                  </div>

                  {/* ROTA E DISTÂNCIA */}
                  <div className="space-y-3">
                    
                    {/* ORIGEM */}
                    <div className="flex items-center text-sm">
                      <i className="fas fa-location-arrow mr-3 text-blue-500 text-base"></i>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700">Origem:</p>
                        <p className="text-gray-600">{pedido.origem}</p>
                      </div>
                    </div>

                    {/* DESTINO */}
                    <div className="flex items-center text-sm">
                      <i className="fas fa-map-marker-alt mr-3 text-red-500 text-base"></i>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700">Destino:</p>
                        <p className="text-gray-600">{pedido.destino}</p>
                      </div>
                    </div>
                  </div>

                  {/* INFORMAÇÕES ADICIONAIS E AÇÃO */}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    
                    {/* DISTÂNCIA E TEMPO */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <i className="fas fa-road mr-2 text-sm text-gray-400"></i>
                        <span>{pedido.distancia}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2 text-sm text-gray-400"></i>
                        <span>{pedido.tempoEstimado}</span>
                      </div>
                    </div>
                    
                    {/* BOTÃO ACEITAR */}
                    <button 
                      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center"
                      // AQUI ENTRARIA A LÓGICA DE ACEITAR O PEDIDO
                      onClick={() => console.log(`Pedido ${pedido.id} aceito!`)}
                    >
                      <i className="fas fa-motorcycle mr-2"></i> Aceitar Corrida
                    </button>
                  </div>

                </div>
              </div>
            ))}
            
            {/* Caso não haja pedidos */}
            {pedidosDisponiveis.length === 0 && (
                <div className="bg-white p-10 rounded-xl text-center shadow-lg">
                    <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                    <p className="text-xl font-semibold text-gray-700">Nenhum pedido disponível no momento.</p>
                    <p className="text-gray-500 mt-2">Mantenha-se online e verifique novamente em breve.</p>
                </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}