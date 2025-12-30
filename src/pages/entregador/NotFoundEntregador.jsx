import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotFoundEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <SidebarEntregador
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* HEADER */}
        <HeaderEntregador
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE CONTEÚDO COM SCROLL E ESPAÇAMENTO */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100 flex flex-col">
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-20 w-full shrink-0"></div>

          {/* CONTAINER CENTRALIZADO DENTRO DA ÁREA ÚTIL */}
          <div className="flex-1 flex items-center justify-center mb-10">
            <div className="text-center p-8 max-w-lg w-full bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col items-center">
              {/* Elemento Visual - Ícone de Alerta para o Entregador */}
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-map-marked-alt text-orange-500 text-4xl animate-bounce"></i>
              </div>

              <h1 className="text-8xl font-black text-gray-200 tracking-tighter mb-2">
                404
              </h1>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Rota não encontrada!
              </h2>

              <p className="text-gray-500 mb-8 leading-relaxed">
                Parece que você pegou um atalho para um lugar que não existe. A
                página solicitada pode ter sido removida ou o endereço está
                incorreto.
              </p>

              {/* Ação de Retorno - Cores do Entregador (Verde/Azul) */}
              <Link
                to="/dashboard/entregador"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all transform active:scale-95"
              >
                <i className="fas fa-home mr-3"></i>
                Ir para o Dashboard
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                Voltar à tela anterior
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
