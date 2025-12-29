import { useState, useEffect } from "react";
import { listarNotificacoes } from "../../services/notificacaoService";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotificacoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const response = await listarNotificacoes();
        setNotificacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        toast.error("Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    }

    carregarNotificacoes();
  }, []);

  const marcarComoLida = (id) => {
    setNotificacoes((notifs) =>
      notifs.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const limparTodas = () => {
    if (window.confirm("Tem certeza que deseja limpar todas as notificações?")) {
      setNotificacoes([]);
    }
  };

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

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
                Você tem{" "}
                <span className="text-blue-600">{notificacoesNaoLidas}</span>{" "}
                {notificacoesNaoLidas === 1 ? "alerta" : "alertas"} não lidos.
              </h3>

              <button
                onClick={limparTodas}
                className="px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-150 flex items-center"
                disabled={notificacoes.length === 0}
              >
                <i className="fas fa-trash-alt mr-2"></i> Limpar Todas
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-10 text-gray-500">
                Carregando notificações...
              </div>
            )}

            {/* Lista de Notificações */}
            {!loading && (
              <div className="space-y-3">
                {notificacoes.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl shadow-md border-l-4 transition-all duration-200 
                      ${
                        notif.lida
                          ? "bg-white border-gray-200"
                          : "bg-white border-blue-500 hover:shadow-lg cursor-pointer"
                      }
                    `}
                    onClick={() => !notif.lida && marcarComoLida(notif.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700">
                          <i className="fas fa-bell text-lg"></i>
                        </div>

                        <div>
                          <p
                            className={`text-base font-bold ${
                              notif.lida
                                ? "text-gray-700"
                                : "text-blue-800"
                            }`}
                          >
                            {notif.titulo}
                          </p>

                          <p
                            className={`text-sm mt-0.5 ${
                              notif.lida
                                ? "text-gray-500"
                                : "text-gray-600"
                            }`}
                          >
                            {notif.mensagem}
                          </p>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(notif.created_at).toLocaleString("pt-PT")}
                        </p>

                        {!notif.lida && (
                          <span className="text-xs font-semibold text-blue-500 mt-1 block">
                            Novo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Estado vazio */}
                {notificacoes.length === 0 && (
                  <div className="bg-white p-10 rounded-xl text-center shadow-lg mt-6">
                    <i className="fas fa-bell-slash text-6xl text-gray-300 mb-4"></i>
                    <p className="text-xl font-semibold text-gray-700">
                      Nenhuma notificação.
                    </p>
                    <p className="text-gray-500 mt-2">
                      Está tudo tranquilo por aqui.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
