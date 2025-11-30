import { useState } from "react";

export default function ListaDePedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline] = useState(true); // Assumimos que o entregador está online nesta tela

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
      {/* ASIDE (SIDEBAR) */}
      <aside
        className={`
          bg-blue-800/90 backdrop-blur-sm border-r border-blue-700
          w-64 fixed top-0 left-0 h-screen p-6 shadow-xl
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
          md:translate-x-0
          z-9999
        `}
      >
        <button
          className="md:hidden absolute top-4 right-4 text-2xl text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>

        <h1 className="text-2xl font-bold mb-10 tracking-wide mt-6 md:mt-0 text-white">
          TRAGA<span className="text-blue-500">Rápido</span>
        </h1>

        <nav className="space-y-4 text-lg text-white">
          <a className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-tachometer-alt mr-3 text-blue-400"></i>
            Dashboard
          </a>
          
          {/* Item Ativo - Lista de Pedidos */}
          <a className="block p-3 rounded-lg bg-blue-600/60 font-bold cursor-pointer transition-colors">
            <i className="fas fa-list-ul mr-3 text-white"></i>
            Lista de Pedidos
          </a>

          <a className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-route mr-3 text-blue-400"></i>
            Detalhes da Corrida c/ Mapa
          </a>
          
          <hr className="border-blue-700 my-4" />

          <a className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-history mr-3 text-blue-400"></i>
            Histórico
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-gear mr-3 text-blue-400"></i>
            Configurações
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-sign-out-alt mr-3 text-blue-400"></i>
            Logout
          </a>
        </nav>
      </aside>

      {/* BACKDROP MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-9000"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="bg-blue-800/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            <i className="fas fa-list-ul mr-2 text-blue-400"></i> Pedidos Disponíveis
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* ÍCONE DE NOTIFICAÇÕES */}
            <Link to="/dashboard/entregador/notificacoes" className="relative text-xl sm:text-2xl text-blue-400 hover:text-blue-300 transition-all">
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    0
                </span>
            </Link>
            
            <div className={`p-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-300 hidden sm:block`}>
                <span className="text-xs font-bold text-white">
                    {isOnline ? "ONLINE" : "OFFLINE"}
                </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">Luiz (Entregador)</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

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