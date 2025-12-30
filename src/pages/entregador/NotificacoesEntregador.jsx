import { useState, useEffect, useRef } from "react";
import { listarNotificacoes } from "../../services/notificacaoService";
import { toast } from "react-hot-toast";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotificacoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lógica de Expansão
  const [isExpanded, setIsExpanded] = useState(false);
  const topoListaRef = useRef(null);

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const response = await listarNotificacoes();
        // Inverte a array para mostrar da última (mais recente) para a primeira
        const listaInvertida = [...response.data].reverse();
        setNotificacoes(listaInvertida);
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
    if (
      window.confirm("Tem certeza que deseja limpar todas as notificações?")
    ) {
      setNotificacoes([]);
    }
  };

  function handleToggleVerMais() {
    if (isExpanded) {
      setIsExpanded(false);
      topoListaRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsExpanded(true);
    }
  }

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

  // Limite de 6 registros iniciais
  const registrosParaExibir = isExpanded
    ? notificacoes
    : notificacoes.slice(0, 6);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative overflow-hidden">
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Âncora para o scroll e espaçador */}
          <div
            ref={topoListaRef}
            className="h-16 w-full shrink-0 md:h-20"
          ></div>

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
                className="px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-150 flex items-center disabled:opacity-50"
                disabled={notificacoes.length === 0}
              >
                <i className="fas fa-trash-alt mr-2"></i> Limpar Todas
              </button>
            </div>

            {loading && (
              <div className="text-center py-10 text-gray-500">
                Carregando notificações...
              </div>
            )}

            {!loading && (
              <div className="space-y-3">
                {registrosParaExibir.map((notif) => (
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
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700 shrink-0">
                          <i className="fas fa-bell text-lg"></i>
                        </div>

                        <div>
                          <p
                            className={`text-base font-bold leading-tight ${
                              notif.lida ? "text-gray-700" : "text-blue-800"
                            }`}
                          >
                            {notif.titulo}
                          </p>

                          <p
                            className={`text-sm mt-1 ${
                              notif.lida ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            {notif.mensagem}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right ml-0 sm:ml-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(notif.created_at).toLocaleString("pt-PT")}
                        </p>

                        {!notif.lida && (
                          <span className="inline-block text-xs font-semibold text-blue-500 mt-1">
                            Novo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

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

                {/* BOTÃO DINÂMICO VER MAIS / VER MENOS */}
                {!loading && notificacoes.length > 6 && (
                  <div className="pt-4">
                    <button
                      className={`w-full py-4 border-2 border-dashed font-bold rounded-xl transition-all flex items-center justify-center gap-2 
                        ${
                          isExpanded
                            ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500"
                        }`}
                      onClick={handleToggleVerMais}
                    >
                      <i
                        className={`fas ${
                          isExpanded ? "fa-minus-circle" : "fa-plus-circle"
                        }`}
                      ></i>
                      {isExpanded ? "MOSTRAR MENOS" : "VER MAIS NOTIFICAÇÕES"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-10 w-full"></div>
        </main>
      </div>
    </div>
  );
}
