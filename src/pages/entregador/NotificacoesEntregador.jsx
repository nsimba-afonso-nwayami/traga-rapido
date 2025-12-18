import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotificacoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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