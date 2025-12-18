import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function NotFoundEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        {/* MAIN AREA - 404 CONTENT */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center">
          <div className="text-center max-w-lg bg-white p-10 rounded-xl shadow-2xl">
            {/* Ícone e Título de Erro */}
            <div className="relative mb-6">
              <i className="fas fa-motorcycle text-8xl text-blue-500 opacity-20 absolute -top-4 left-1/2 transform -translate-x-1/2 -z-10"></i>
              <h1 className="text-8xl font-extrabold text-gray-900 tracking-wider">
                404
              </h1>
            </div>

            {/* Mensagem Principal */}
            <p className="text-2xl font-bold tracking-tight mb-4 text-gray-800">
              Página Não Encontrada
            </p>

            <p className="text-md text-gray-600 mb-8">
              A rota que você tentou acessar não existe. Por favor, volte ao
              painel principal para continuar suas entregas.
            </p>

            {/* Botão de Navegação */}
            <a
              href="/dashboard/entregador" // Link para o Dashboard
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 transition duration-150 transform hover:scale-[1.02]"
            >
              <i className="fas fa-arrow-left mr-3"></i>
              Voltar para o Dashboard
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
