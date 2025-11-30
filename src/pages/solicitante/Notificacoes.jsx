import { useState } from "react";

export default function NotificacoesSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Exemplo de um item de notificação no layout para repetição
  const NotificationItem = ({ isUnread, icon, color, title, time }) => (
    <div
      className={`p-4 border-b border-gray-200 flex items-start gap-4 transition duration-150 ${
        isUnread
          ? "bg-blue-50/70 hover:bg-blue-100/70"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Ícone */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}
      >
        <i className={`fas fa-${icon} text-white text-sm`}></i>
      </div>

      {/* Conteúdo */}
      <div className="flex-1">
        <p
          className={`font-semibold ${
            isUnread ? "text-gray-900" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>

      {/* Status (Bola azul para não lido) */}
      <div className="flex flex-col items-center shrink-0">
        {isUnread && (
          <div
            className="w-2 h-2 bg-blue-500 rounded-full mb-1"
            title="Não Lida"
          ></div>
        )}
        <button
          className="text-xs text-gray-400 hover:text-blue-600 transition duration-150"
          title="Marcar como lida"
        >
          <i className="far fa-circle-check"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR (Mantida) */}
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
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-tachometer-alt mr-3 text-blue-500"></i>
            Dashboard
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-box mr-3 text-blue-500"></i>
            Meus Pedidos
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-plus-circle mr-3 text-blue-500"></i>
            Criar Novo Pedido
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-history mr-3 text-blue-500"></i>
            Histórico
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-gear mr-3 text-blue-500"></i>
            Configurações
          </a>
          <a className="block p-3 rounded-lg hover:bg-blue-500/40 cursor-pointer">
            <i className="fas fa-sign-out-alt mr-3 text-blue-500"></i>
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
        <header className="bg-blue-700/90 border-b border-blue-700 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
            Central de Notificações
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            {/* O ícone do sino na notificação está sempre presente no header */}
            <button className="relative text-xl sm:text-2xl text-blue-500 hover:text-blue-400 transition-all">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80 hidden sm:block text-white">
                Usuário
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-base"></i>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN AREA - NOTIFICAÇÕES */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl shadow">
            {/* CABEÇALHO DA LISTA E AÇÕES */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-800">
                Suas Notificações Recentes
              </h3>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150 flex items-center"
                title="Marcar todas as notificações como lidas"
              >
                <i className="fas fa-check-double mr-2"></i> Marcar todas como
                lidas
              </button>
            </div>

            {/* LISTA DE NOTIFICAÇÕES */}
            <div className="divide-y divide-gray-200">
              {/* NOTIFICAÇÃO 1: NÃO LIDA (PEDIDO NOVO) */}
              <NotificationItem
                isUnread={true}
                icon="box"
                color="bg-blue-600"
                title="Pedido #1009 Enviado para Cotação!"
                time="5 minutos atrás"
              />

              {/* NOTIFICAÇÃO 2: NÃO LIDA (ENTREGADOR ALOCADO) */}
              <NotificationItem
                isUnread={true}
                icon="truck"
                color="bg-indigo-600"
                title="Entregador Pedro Silva Alocado ao Pedido #1007"
                time="1 hora atrás"
              />

              {/* NOTIFICAÇÃO 3: LIDA (STATUS MUDOU) */}
              <NotificationItem
                isUnread={false}
                icon="route"
                color="bg-green-600"
                title="Status Atualizado: Pedido #1005 em Rota de Entrega"
                time="Ontem, 14:30"
              />

              {/* NOTIFICAÇÃO 4: LIDA (CONCLUÍDO) */}
              <NotificationItem
                isUnread={false}
                icon="check-circle"
                color="bg-gray-600"
                title="Pedido #1003 Concluído com Sucesso."
                time="2 dias atrás"
              />

              {/* NOTIFICAÇÃO 5: LIDA (ALERTA) */}
              <NotificationItem
                isUnread={false}
                icon="exclamation-triangle"
                color="bg-yellow-600"
                title="Atenção: Atraso previsto no Pedido #1007"
                time="2 dias atrás"
              />
            </div>

            {/* RODAPÉ E PAGINAÇÃO SIMPLES */}
            <div className="p-4 sm:p-5 flex justify-center border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition duration-150">
                Carregar Notificações Antigas{" "}
                <i className="fas fa-arrow-down ml-2"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
