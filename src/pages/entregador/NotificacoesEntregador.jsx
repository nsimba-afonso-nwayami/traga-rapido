import { useState } from "react";
import { Link } from "react-router-dom";

export default function NotificacoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline] = useState(true);

  // Dados Mockados para Notificações
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: 'Novo Pedido',
      mensagem: 'Novo pedido disponível! Distância de 2.5 km e AOA 1.800 de ganho. Verifique a lista.',
      icone: 'fas fa-box-open',
      cor: 'bg-green-100 text-green-700',
      lida: false,
      tempo: '2 minutos atrás',
    },
    {
      id: 2,
      tipo: 'Repasse Confirmado',
      mensagem: 'O repasse de AOA 45.200 (referente à semana) foi creditado em sua conta bancária.',
      icone: 'fas fa-wallet',
      cor: 'bg-blue-100 text-blue-700',
      lida: false,
      tempo: '1 hora atrás',
    },
    {
      id: 3,
      tipo: 'Alerta',
      mensagem: 'A avaliação média caiu para 4.6. Lembre-se de ser cortês nas entregas.',
      icone: 'fas fa-exclamation-triangle',
      cor: 'bg-yellow-100 text-yellow-700',
      lida: true,
      tempo: 'Ontem',
    },
    {
      id: 4,
      tipo: 'Atualização',
      mensagem: 'Novos termos de serviço foram adicionados. Leia e aceite para continuar.',
      icone: 'fas fa-info-circle',
      cor: 'bg-gray-100 text-gray-700',
      lida: true,
      tempo: '3 dias atrás',
    },
  ]);

  const marcarComoLida = (id) => {
    setNotificacoes(notifs => 
      notifs.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const limparTodas = () => {
      if (window.confirm("Tem certeza que deseja limpar todas as notificações?")) {
          setNotificacoes([]);
      }
  }

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

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
          {/* Item Ativo - Dashboard */}
          <Link to="/dashboard/entregador/" className="block p-3 rounded-lg bg-blue-600/60 font-bold cursor-pointer transition-colors">
            <i className="fas fa-tachometer-alt mr-3 text-white"></i>
            Dashboard
          </Link>
          
          {/* Novos Itens de Fluxo de Entrega */}
          <Link to="/dashboard/entregador/lista-pedidos" className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-list-ul mr-3 text-blue-400"></i>
            Lista de Pedidos
          </Link>
          <Link to="/dashboard/entregador/detalhes-corrida" className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-route mr-3 text-blue-400"></i>
            Detalhes da Corrida c/ Mapa
          </Link>
          
          <hr className="border-blue-700 my-4" /> {/* Separador */}
      
          <Link to="/dashboard/entregador/historico" className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-history mr-3 text-blue-400"></i>
            Histórico
          </Link>
          <Link to="/dashboard/entregador/configuracoes" className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-gear mr-3 text-blue-400"></i>
            Configurações
          </Link>
          <Link className="block p-3 rounded-lg hover:bg-blue-600/40 cursor-pointer transition-colors">
            <i className="fas fa-sign-out-alt mr-3 text-blue-400"></i>
            Logout
          </Link>
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
            <i className="fas fa-bell mr-2 text-blue-400"></i> Central de Notificações
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* ÍCONE DE NOTIFICAÇÕES (Reflete o contador) */}
            <Link to="/dashboard/entregador/notificacoes" className="relative text-xl sm:text-2xl text-blue-400 hover:text-blue-300 transition-all">
                <i className="fas fa-bell"></i>
                {notificacoesNaoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {notificacoesNaoLidas}
                    </span>
                )}
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

        {/* MAIN AREA - NOTIFICAÇÕES */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Ações e Contagem */}
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <h3 className="text-xl font-bold text-gray-800">
                        Você tem <span className="text-blue-600">{notificacoesNaoLidas}</span> {notificacoesNaoLidas === 1 ? 'alerta' : 'alertas'} não lidos.
                    </h3>
                    
                    <button 
                        onClick={limparTodas}
                        className="px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-150 flex items-center"
                        disabled={notificacoes.length === 0}
                    >
                        <i className="fas fa-trash-alt mr-2"></i> Limpar Todas
                    </button>
                </div>

                {/* Lista de Notificações */}
                <div className="space-y-3">
                    {notificacoes.map(notif => (
                        <div 
                            key={notif.id}
                            className={`p-4 rounded-xl shadow-md border-l-4 transition-all duration-200 
                                ${notif.lida ? 'bg-white border-gray-200' : 'bg-white border-blue-500 hover:shadow-lg cursor-pointer'}
                            `}
                            onClick={() => !notif.lida && marcarComoLida(notif.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full mr-3 ${notif.cor}`}>
                                        <i className={`${notif.icone} text-lg`}></i>
                                    </div>
                                    <div>
                                        <p className={`text-base font-bold ${notif.lida ? 'text-gray-700' : 'text-blue-800'}`}>{notif.tipo}</p>
                                        <p className={`text-sm mt-0.5 ${notif.lida ? 'text-gray-500' : 'text-gray-600'}`}>{notif.mensagem}</p>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-xs text-gray-400 whitespace-nowrap">{notif.tempo}</p>
                                    {!notif.lida && (
                                        <span className="text-xs font-semibold text-blue-500 mt-1 block">
                                            Novo
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Caso não haja notificações */}
                    {notificacoes.length === 0 && (
                        <div className="bg-white p-10 rounded-xl text-center shadow-lg mt-6">
                            <i className="fas fa-bell-slash text-6xl text-gray-300 mb-4"></i>
                            <p className="text-xl font-semibold text-gray-700">Nenhuma notificação.</p>
                            <p className="text-gray-500 mt-2">Está tudo tranquilo por aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}