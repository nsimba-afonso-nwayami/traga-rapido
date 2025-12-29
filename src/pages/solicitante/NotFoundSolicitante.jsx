import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function NotFoundSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* Header */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE CONTEÚDO COM SCROLL E ESPAÇAMENTO */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100 flex flex-col">
          
          {/* ESPAÇADOR PARA O HEADER FIXO (Fundamental para não colar) */}
          <div className="h-20 w-full shrink-0"></div>

          {/* CONTAINER CENTRALIZADO DENTRO DA ÁREA ÚTIL */}
          <div className="flex-1 flex items-center justify-center mb-10">
            <div className="text-center p-8 max-w-lg w-full bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col items-center">
              
              {/* Elemento Visual */}
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-exclamation-triangle text-red-500 text-4xl animate-bounce"></i>
              </div>

              <h1 className="text-8xl font-black text-gray-200 tracking-tighter mb-2">
                404
              </h1>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Ops! Caminho errado.
              </h2>

              <p className="text-gray-500 mb-8 leading-relaxed">
                A página que você procura não foi encontrada ou foi movida. 
                Utilize o menu lateral ou o botão abaixo para retornar à segurança.
              </p>

              {/* Ação de Retorno */}
              <Link
                to="/dashboard/solicitante"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95"
              >
                <i className="fas fa-home mr-3"></i>
                Ir para o Início
              </Link>

              <button 
                onClick={() => navigate(-1)}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                Tentar voltar à página anterior
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}