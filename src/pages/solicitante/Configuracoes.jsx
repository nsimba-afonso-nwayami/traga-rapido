import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Estado para gerenciar qual aba está ativa: 'perfil' ou 'seguranca'
  const [activeTab, setActiveTab] = useState("perfil");

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

        {/* MAIN AREA - CONFIGURAÇÕES */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-6 sm:p-8">
            {/* ABAS DE NAVEGAÇÃO */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("perfil")}
                  className={`
                    py-2 px-4 text-lg font-semibold border-b-2 transition duration-200
                    ${
                      activeTab === "perfil"
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
                    }
                  `}
                >
                  <i className="fas fa-user-circle mr-2"></i> Perfil
                </button>
                <button
                  onClick={() => setActiveTab("seguranca")}
                  className={`
                    py-2 px-4 text-lg font-semibold border-b-2 transition duration-200
                    ${
                      activeTab === "seguranca"
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
                    }
                  `}
                >
                  <i className="fas fa-shield-alt mr-2"></i> Segurança
                </button>
              </nav>
            </div>

            {/* CONTEÚDO DA ABA ATIVA */}
            <div className="py-4">
              {/* ABA 1: PERFIL */}
              {activeTab === "perfil" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                    Atualizar Informações Pessoais
                  </h3>

                  <form className="space-y-4">
                    {/* Avatar / Foto de Perfil (Opcional) */}
                    <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        J
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Foto de Perfil
                        </p>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <i className="fas fa-upload mr-1"></i> Alterar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="nome"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          id="nome"
                          defaultValue="João Silva"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue="joao.silva@empresa.com"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="telefone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Telefone
                        </label>
                        <input
                          type="text"
                          id="telefone"
                          defaultValue="(11) 98765-4321"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="empresa"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Empresa/CNPJ
                        </label>
                        <input
                          type="text"
                          id="empresa"
                          defaultValue="Logistica Rápida LTDA"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
                      >
                        <i className="fas fa-save mr-2"></i> Salvar Alterações
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ABA 2: SEGURANÇA */}
              {activeTab === "seguranca" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                    Alterar Senha de Acesso
                  </h3>

                  <form className="space-y-4 max-w-md">
                    <div className="space-y-1">
                      <label
                        htmlFor="senha_atual"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        id="senha_atual"
                        placeholder="********"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="nova_senha"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        id="nova_senha"
                        placeholder="********"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="confirma_senha"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        id="confirma_senha"
                        placeholder="********"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150"
                      >
                        <i className="fas fa-lock mr-2"></i> Alterar Senha
                      </button>
                    </div>
                  </form>

                  <hr className="my-8" />

                  {/* Ação de Segurança Adicional (Exemplo) */}
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                    <p className="font-bold">
                      Autenticação de Dois Fatores (2FA)
                    </p>
                    <p className="text-sm">
                      Recomendado para segurança extra. Ative o 2FA para
                      proteger sua conta.
                    </p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold">
                      Configurar 2FA{" "}
                      <i className="fas fa-chevron-right ml-1"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
