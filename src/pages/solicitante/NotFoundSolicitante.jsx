import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function NotFoundSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
     {/* Sidebar */}
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {/* Header */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN AREA - NOT FOUND (404) */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center p-8 max-w-lg w-full bg-white border border-gray-300 rounded-xl shadow-xl">
            <i className="fas fa-exclamation-circle text-red-500 text-6xl mb-4 animate-pulse"></i>

            <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest mt-4 mb-2">
              404
            </h1>

            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Página Não Encontrada
            </h2>

            <p className="text-gray-500 mb-8">
              Parece que você tentou acessar uma rota que não existe no painel
              do solicitante. Verifique o endereço ou volte para o Dashboard.
            </p>

            {/* Botão de Navegação para o Dashboard */}
            <Link
              to="/dashboard/solicitante"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.02]"
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Voltar para o Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
