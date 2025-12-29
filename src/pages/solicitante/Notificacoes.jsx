import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function NotificacoesSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Componente interno para itens de notificação
  const NotificationItem = ({ isUnread, icon, color, title, time }) => (
    <div
      className={`p-4 border-b border-gray-200 flex items-start gap-4 transition duration-150 ${
        isUnread
          ? "bg-blue-50/70 hover:bg-blue-100/70"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color} shadow-sm`}>
        <i className={`fas fa-${icon} text-white text-sm`}></i>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <i className="far fa-clock mr-1"></i> {time}
        </p>
      </div>

      <div className="flex flex-col items-center shrink-0 gap-2">
        {isUnread && (
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" title="Não Lida"></div>
        )}
        <button
          className="text-gray-400 hover:text-blue-600 transition duration-150 p-1"
          title="Marcar como lida"
        >
          <i className="far fa-circle-check text-lg"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE ROLAGEM INDEPENDENTE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              
              {/* CABEÇALHO DA LISTA */}
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Centro de Notificações
                  </h3>
                  <p className="text-xs text-gray-500">Acompanhe o status dos seus pedidos em tempo real</p>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-bold transition duration-150 flex items-center bg-blue-50 px-3 py-2 rounded-lg"
                  title="Marcar todas como lidas"
                >
                  <i className="fas fa-check-double mr-2"></i> 
                  <span className="hidden sm:inline">Marcar todas como lidas</span>
                </button>
              </div>

              {/* LISTA DE NOTIFICAÇÕES */}
              <div className="divide-y divide-gray-100">
                <NotificationItem
                  isUnread={true}
                  icon="box"
                  color="bg-blue-600"
                  title="Pedido #1009 Enviado para Cotação!"
                  time="5 minutos atrás"
                />

                <NotificationItem
                  isUnread={true}
                  icon="truck"
                  color="bg-indigo-600"
                  title="Entregador Pedro Silva Alocado ao Pedido #1007"
                  time="1 hora atrás"
                />

                <NotificationItem
                  isUnread={false}
                  icon="route"
                  color="bg-green-600"
                  title="Status Atualizado: Pedido #1005 em Rota de Entrega"
                  time="Ontem, 14:30"
                />

                <NotificationItem
                  isUnread={false}
                  icon="check-circle"
                  color="bg-gray-600"
                  title="Pedido #1003 Concluído com Sucesso."
                  time="2 dias atrás"
                />

                <NotificationItem
                  isUnread={false}
                  icon="exclamation-triangle"
                  color="bg-yellow-600"
                  title="Atenção: Atraso previsto no Pedido #1007"
                  time="2 dias atrás"
                />
              </div>

              {/* RODAPÉ / CARREGAR MAIS */}
              <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50">
                <button className="text-sm text-gray-500 hover:text-blue-600 font-bold py-2 px-4 transition duration-150 flex items-center gap-2">
                  <i className="fas fa-history text-xs"></i>
                  Ver notificações mais antigas
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}