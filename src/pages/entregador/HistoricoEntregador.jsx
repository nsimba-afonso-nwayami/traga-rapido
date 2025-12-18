import { useState } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function HistoricoEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState('Semana'); // Estado para o filtro

  // Dados Mockados para o Histórico
  const corridasHistorico = [
    {
      id: '998',
      data: '2025-11-29',
      hora: '15:30',
      status: 'Concluído',
      valorGanho: 'AOA 1.500',
      origem: 'Av. Brasil, 45',
      destino: 'Rua do Porto, 102',
    },
    {
      id: '997',
      data: '2025-11-28',
      hora: '11:05',
      status: 'Concluído',
      valorGanho: 'AOA 2.100',
      origem: 'Largo da Sé, 1',
      destino: 'Condomínio Kimbango, Bloco C',
    },
    {
      id: '996',
      data: '2025-11-28',
      hora: '09:20',
      status: 'Concluído',
      valorGanho: 'AOA 1.250',
      origem: 'Mercado Central',
      destino: 'Bairro Novo, Casa 22',
    },
    {
      id: '995',
      data: '2025-11-27',
      hora: '20:45',
      status: 'Cancelado (Origem)',
      valorGanho: 'AOA 0', // Corrida cancelada não gera ganho
      origem: 'Zona Industrial',
      destino: 'Centro da Cidade',
    },
  ];

  // Dados Mockados de Resumo de Ganhos
  const resumoGanhos = {
    Semana: { total: 'AOA 7.800', corridas: 12 },
    Mês: { total: 'AOA 45.200', corridas: 75 },
    Total: { total: 'AOA 150.900', corridas: 250 },
  };
  
  const ganhosAtuais = resumoGanhos[filtroPeriodo] || resumoGanhos['Semana'];


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

        {/* MAIN AREA - HISTÓRICO */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. FILTRO E RESUMO */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-xl font-bold text-gray-800">
                Resumo de Ganhos por Período
              </h3>
              
              {/* Controles de Filtro */}
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                {['Semana', 'Mês', 'Total'].map((periodo) => (
                  <button
                    key={periodo}
                    onClick={() => setFiltroPeriodo(periodo)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-150 ${
                      filtroPeriodo === periodo 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {periodo}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Cartões de Resumo */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Ganhos de {filtroPeriodo}</p>
                <p className="text-3xl font-extrabold text-green-800 mt-1">{ganhosAtuais.total}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Corridas {filtroPeriodo}</p>
                <p className="text-3xl font-extrabold text-blue-800 mt-1">{ganhosAtuais.corridas}</p>
              </div>
            </div>
          </section>

          {/* 2. LISTA DE CORRIDAS DETALHADA */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              <i className="fas fa-list-alt mr-2 text-gray-500"></i> Detalhes das Corridas
            </h3>

            {corridasHistorico.map((corrida) => (
              <div 
                key={corrida.id} 
                className="bg-white p-4 sm:p-5 rounded-xl shadow-md flex justify-between items-center border-l-4"
                style={{borderColor: corrida.status === 'Concluído' ? '#10B981' : '#EF4444'}}
              >
                {/* Detalhes da Corrida */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center text-sm font-semibold">
                    <span className="text-gray-500 mr-2">{corrida.data} | {corrida.hora}</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${corrida.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {corrida.status}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-base text-gray-700 truncate">
                      <i className="fas fa-arrow-right mr-1 text-xs text-blue-500"></i> {corrida.origem} <span className="text-gray-400 mx-1">para</span> {corrida.destino}
                  </p>
                </div>

                {/* Valor Ganho */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{corrida.valorGanho}</p>
                  <p className="text-xs text-gray-500">Pedido #{corrida.id}</p>
                </div>
              </div>
            ))}
            
            {/* Mensagem de Histórico Vazio */}
            {corridasHistorico.length === 0 && (
                <div className="bg-white p-10 rounded-xl text-center shadow-lg">
                    <i className="fas fa-book-open text-6xl text-gray-300 mb-4"></i>
                    <p className="text-xl font-semibold text-gray-700">Seu histórico está vazio.</p>
                    <p className="text-gray-500 mt-2">Aceite sua primeira corrida no painel principal!</p>
                </div>
            )}
            
          </section>

        </main>
      </div>
    </div>
  );
}