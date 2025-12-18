import { useState } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";

export default function ConfiguracoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Abas atualizadas: 'pessoal', 'veiculo', 'pagamento', 'seguranca'
  const [activeTab, setActiveTab] = useState('pessoal'); 

  // Dados Estáticos de Simulação (Mantidos por brevidade)
  const entregadorData = {
    nome: "Luiz Miguel",
    email: "luiz.miguel@tragarapido.com",
    telefone: "+244 912 345 678",
    cidade: "Luanda",
    bi: "1234567LA045",
  };
  
  const veiculoData = {
    tipo: "Moto (Cilindrada 150cc)",
    modelo: "Honda CG Fan",
    placa: "LD-55-90-AA",
    cor: "Preta",
  };

  const pagamentoData = {
    banco: "Banco Angolano de Investimentos (BAI)",
    nib: "0040.0000.1234.5678.901",
    nomeTitular: "Luiz K. Miguel",
  };

  // Função Placeholder para submissão
  const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`Dados da aba ${activeTab} salvos.`);
      // Lógica de envio para o Backend
      if (activeTab === 'seguranca') {
          alert('Senha alterada com sucesso (simulado)!');
      } else {
          alert(`Configurações de ${activeTab} salvas.`);
      }
  };

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


        {/* MAIN AREA - CONFIGURAÇÕES */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            
            {/* Abas de Navegação */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap">
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'pessoal' 
                    ? 'border-b-4 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('pessoal')}
              >
                <i className="fas fa-user-circle mr-2"></i> Pessoal
              </button>
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'veiculo' 
                    ? 'border-b-4 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('veiculo')}
              >
                <i className="fas fa-motorcycle mr-2"></i> Veículo
              </button>
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'pagamento' 
                    ? 'border-b-4 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('pagamento')}
              >
                <i className="fas fa-credit-card mr-2"></i> Pagamento
              </button>
              {/* NOVA ABA: SEGURANÇA */}
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'seguranca' 
                    ? 'border-b-4 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('seguranca')}
              >
                <i className="fas fa-shield-alt mr-2"></i> Segurança
              </button>
            </div>
            
            {/* CONTEÚDO DAS ABAS */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ABA PESSOAL (Mantido) */}
              {activeTab === 'pessoal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" id="nome" defaultValue={entregadorData.nome} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" defaultValue={entregadorData.email} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input type="text" id="telefone" defaultValue={entregadorData.telefone} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade de Atuação</label>
                        <input type="text" id="cidade" defaultValue={entregadorData.cidade} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label htmlFor="bi" className="block text-sm font-medium text-gray-700">Nº do B.I. / Documento de Identificação</label>
                        <input type="text" id="bi" defaultValue={entregadorData.bi} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
              )}
              
              {/* ABA VEÍCULO (Mantido) */}
              {activeTab === 'veiculo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 md:col-span-2">
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Veículo</label>
                        <input type="text" id="tipo" defaultValue={veiculoData.tipo} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
                        <input type="text" id="modelo" defaultValue={veiculoData.modelo} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa / Matrícula</label>
                        <input type="text" id="placa" defaultValue={veiculoData.placa} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor</label>
                        <input type="text" id="cor" defaultValue={veiculoData.cor} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
              )}

              {/* ABA PAGAMENTO (Mantido) */}
              {activeTab === 'pagamento' && (
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg text-sm">
                        <p className="font-bold">Atenção:</p>
                        <p>O NIB/IBAN é crucial para o repasse semanal ou quinzenal dos seus ganhos.</p>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="banco" className="block text-sm font-medium text-gray-700">Nome do Banco</label>
                        <input type="text" id="banco" defaultValue={pagamentoData.banco} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="nib" className="block text-sm font-medium text-gray-700">NIB / IBAN</label>
                        <input type="text" id="nib" defaultValue={pagamentoData.nib} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="titular" className="block text-sm font-medium text-gray-700">Nome do Titular da Conta</label>
                        <input type="text" id="titular" defaultValue={pagamentoData.nomeTitular} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
              )}

              {/* NOVO: ABA SEGURANÇA */}
              {activeTab === 'seguranca' && (
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Alterar Senha</h4>
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg text-sm">
                        <p className="font-bold">Importante:</p>
                        <p>A nova senha deve ter no mínimo 8 caracteres, incluindo letras e números.</p>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="senha_atual" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                        <input type="password" id="senha_atual" placeholder="Digite sua senha atual" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="nova_senha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input type="password" id="nova_senha" placeholder="Digite a nova senha" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <input type="password" id="confirmar_senha" placeholder="Confirme a nova senha" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                </div>
              )}

              {/* Botão de Submissão */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex items-center"
                >
                  <i className="fas fa-save mr-3 text-lg"></i> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}