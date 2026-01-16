import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function MensagensEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limiteExibicao, setLimiteExibicao] = useState(6);

  // Mock de dados para o layout do Entregador
  const [conversas] = useState([
    {
      id: 1,
      nome: "Carlos Andrade (Solicitante)",
      ultimaMensagem: "Pode deixar na portaria, por favor.",
      horario: "10:15",
      naoLidas: 1,
      online: true,
    },
    {
      id: 2,
      nome: "Ana Beatriz (Solicitante)",
      ultimaMensagem: "Obrigado pela entrega rápida!",
      horario: "Ontem",
      naoLidas: 0,
      online: false,
    },
  ]);

  const conversasVisiveis = conversas.slice(0, limiteExibicao);

  const carregarMais = () => {
    setLimiteExibicao((prev) => prev + 6);
  };

  const ChatItem = ({ chat }) => (
    <Link
      to={`/dashboard/entregador/mensagens/chat/${chat.id}`}
      className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 group"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {chat.nome.charAt(0)}
        </div>
        {chat.online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {chat.nome}
          </h4>
          <span className="text-xs text-gray-500">{chat.horario}</span>
        </div>
        <p className="text-sm text-gray-600 truncate flex items-center">
          {chat.naoLidas === 0 && (
            <i className="fas fa-check-double text-blue-400 text-xs mr-1"></i>
          )}
          {chat.ultimaMensagem}
        </p>
      </div>

      {/* Badge de Mensagens */}
      {chat.naoLidas > 0 && (
        <div className="shrink-0">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full min-w-5 text-center block">
            {chat.naoLidas}
          </span>
        </div>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6 pb-10">
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-4xl mx-auto">
            {/* Título */}
            <div className="mb-6 px-1">
              <h2 className="text-2xl font-bold text-gray-800">Mensagens</h2>
              <p className="text-sm text-gray-500">
                Comunique-se com os solicitantes dos seus pedidos
              </p>
            </div>

            {/* Container Principal */}
            <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Filtro/Busca */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="relative w-full max-w-xs">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Lista */}
              <div className="divide-y divide-gray-100">
                {conversas.length > 0 ? (
                  conversasVisiveis.map((chat) => (
                    <ChatItem key={chat.id} chat={chat} />
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <i className="fas fa-comments text-2xl text-gray-300"></i>
                    </div>
                    <p className="text-gray-500 font-medium">
                      Nenhuma conversa no momento.
                    </p>
                  </div>
                )}
              </div>

              {/* Botão Ver Mais */}
              {conversas.length > limiteExibicao && (
                <div className="p-4 flex justify-center border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={carregarMais}
                    className="text-sm text-gray-500 hover:text-blue-600 font-bold py-2 px-4 transition duration-150 flex items-center gap-2"
                  >
                    <i className="fas fa-history text-xs"></i>
                    Ver conversas anteriores
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
