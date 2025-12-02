import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function CriarNovoPedido() {
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

        {/* MAIN AREA - FORMULÁRIO SIMPLIFICADO */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-6 sm:p-8 space-y-8">
            <form className="space-y-6">
              {/* 1. TÍTULO DO PEDIDO */}
              <div className="space-y-1">
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título do Pedido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Ex: Documentos Urgentes, Pacote Pequeno"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 2. DESCRIÇÃO E INSTRUÇÕES */}
              <div className="space-y-1">
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição e Instruções Especiais{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descricao"
                  rows="4"
                  placeholder="Detalhe o conteúdo e as instruções de manuseio ou entrega (Ex: Frágil, Entregar no 3º andar, Somente para contato X)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <hr className="my-8 border-gray-200" />

              {/* 3. LOCAL DE ORIGEM (CAMPO SIMPLIFICADO) */}
              <div className="space-y-1">
                <label
                  htmlFor="origem"
                  className="block text-sm font-bold text-blue-700 items-center"
                >
                  <i className="fas fa-map-marker-alt mr-2"></i> Local de Origem{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="origem"
                  rows="3"
                  placeholder="Digite o endereço completo de origem (Rua, Número, Bairro, Cidade, CEP)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              {/* 4. LOCAL DE DESTINO (CAMPO SIMPLIFICADO) */}
              <div className="space-y-1">
                <label
                  htmlFor="destino"
                  className="block text-sm font-bold text-blue-700 items-center"
                >
                  <i className="fas fa-route mr-2"></i> Local de Destino{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  id="destino"
                  rows="3"
                  placeholder="Digite o endereço completo de destino (Rua, Número, Bairro, Cidade, CEP)."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              {/* BOTÃO DE SUBMISSÃO */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center"
                >
                  <i className="fas fa-check-circle mr-3 text-lg"></i> Enviar
                  Pedido
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
