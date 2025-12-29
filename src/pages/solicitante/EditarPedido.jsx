import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function EditarPedido() {
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

        {/* ÁREA DE ROLAGEM INDEPENDENTE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-4xl mx-auto mb-10">
            {/* Botão Voltar */}
            <button 
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i> Voltar para detalhes
            </button>

            <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              {/* Header do Card */}
              <div className="bg-amber-500 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <i className="fas fa-edit mr-3"></i>
                  Editar Detalhes do Pedido
                </h2>
                <p className="text-amber-50 text-sm mt-1">
                  Você pode alterar as informações enquanto o pedido ainda não foi coletado.
                </p>
              </div>

              <form className="p-6 sm:p-8 space-y-6">
                {/* 1. TÍTULO DO PEDIDO */}
                <div className="space-y-1">
                  <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700">
                    Título do Pedido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    placeholder="Ex: Documentos Urgentes, Pacote Pequeno"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    required
                  />
                </div>

                {/* 2. DESCRIÇÃO E INSTRUÇÕES */}
                <div className="space-y-1">
                  <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700">
                    Descrição e Instruções Especiais <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    rows="4"
                    placeholder="Detalhe o conteúdo e as instruções de manuseio ou entrega..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none transition-all"
                    required
                  ></textarea>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-semibold">Localização</span></div>
                </div>

                {/* 3. LOCAL DE ORIGEM */}
                <div className="space-y-1">
                  <label htmlFor="origem" className="block text-sm font-bold text-blue-700">
                    <i className="fas fa-map-marker-alt mr-2 text-red-500"></i> Local de Origem <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="origem"
                    rows="2"
                    placeholder="Digite o endereço completo de origem..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    required
                  ></textarea>
                </div>

                {/* 4. LOCAL DE DESTINO */}
                <div className="space-y-1">
                  <label htmlFor="destino" className="block text-sm font-bold text-blue-700">
                    <i className="fas fa-flag-checkered mr-2 text-green-500"></i> Local de Destino <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="destino"
                    rows="2"
                    placeholder="Digite o endereço completo de destino..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    required
                  ></textarea>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Descartar Alterações
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <i className="fas fa-save mr-2 text-lg"></i> Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}