import { useState, useEffect } from "react";
import SidebarEntregador from "../../components/entregador/SidebarEntregador";
import HeaderEntregador from "../../components/entregador/HeaderEntregador";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { usuarioUpdateSchema } from "../../validations/usuarioUpdateSchema";
import { usuarioSenhaUpdateSchema } from "../../validations/usuarioSenhaUpdateSchema";
import { getUsuario, updateUsuario, updateSenhaUsuario } from "../../services/usuarioService";
import { useAuth } from "../../contexts/AuthContext";

export default function ConfiguracoesEntregador() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pessoal"); 
  const { user } = useAuth();

  // Forms
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(usuarioUpdateSchema),
  });

  const {
    register: registerSenha,
    handleSubmit: handleSubmitSenha,
    reset: resetSenha,
    formState: { errors: errorsSenha },
  } = useForm({
    resolver: yupResolver(usuarioSenhaUpdateSchema),
  });

  // Dados do entregador
  useEffect(() => {
    if (user?.userId || user?.id) {
      getUsuario(user.userId || user.id)
        .then((data) => {
          setValue("nome", data.username || "");
          setValue("email", data.email || "");
          setValue("telefone", data.telefone || "");
        })
        .catch(() => toast.error("Não foi possível carregar os dados do usuário."));
    }
  }, [user, setValue]);

  // Submissão Pessoal, Veículo ou Pagamento
  const onSubmit = async (formData) => {
    try {
      if (activeTab === "pessoal") {
        await updateUsuario(user.userId || user.id, {
          email: formData.email || "",
          telefone: formData.telefone || ""
        });
        toast.success("Dados pessoais atualizados com sucesso!");
      } else {
        toast.success(`Configurações de ${activeTab} salvas (simulado).`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações.");
    }
  };

  // Submissão Senha
  const onSubmitSenha = async (formData) => {
    try {
      await updateSenhaUsuario(user.userId || user.id, {
        nova_senha: formData.nova_senha,
      });
      toast.success("Senha alterada com sucesso!");
      resetSenha();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao alterar senha.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarEntregador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderEntregador sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-16 w-full md:h-20"></div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            
            {/* Abas de Navegação */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap">
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'pessoal' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('pessoal')}
              >
                <i className="fas fa-user-circle mr-2"></i> Pessoal
              </button>
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'veiculo' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('veiculo')}
              >
                <i className="fas fa-motorcycle mr-2"></i> Veículo
              </button>
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'pagamento' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('pagamento')}
              >
                <i className="fas fa-credit-card mr-2"></i> Pagamento
              </button>
              <button
                className={`px-4 py-2 text-base font-semibold transition-colors duration-150 ${
                  activeTab === 'seguranca' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('seguranca')}
              >
                <i className="fas fa-shield-alt mr-2"></i> Segurança
              </button>
            </div>
            
            {/* CONTEÚDO DAS ABAS */}
            <form
              onSubmit={activeTab === 'seguranca' ? handleSubmitSenha(onSubmitSenha) : handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Pessoal */}
              {activeTab === 'pessoal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" {...register("email")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input type="text" id="telefone" {...register("telefone")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
                  </div>
                </div>
              )}

              {/* Veículo */}
              {activeTab === 'veiculo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Veículo</label>
                    <input type="text" id="tipo" {...register("tipo")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input type="text" id="modelo" {...register("modelo")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa / Matrícula</label>
                    <input type="text" id="placa" {...register("placa")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor</label>
                    <input type="text" id="cor" {...register("cor")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              )}

              {/* Pagamento */}
              {activeTab === 'pagamento' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg text-sm">
                    <p className="font-bold">Atenção:</p>
                    <p>O NIB/IBAN é crucial para o repasse semanal ou quinzenal dos seus ganhos.</p>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="banco" className="block text-sm font-medium text-gray-700">Nome do Banco</label>
                    <input type="text" id="banco" {...register("banco")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="nib" className="block text-sm font-medium text-gray-700">NIB / IBAN</label>
                    <input type="text" id="nib" {...register("nib")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="titular" className="block text-sm font-medium text-gray-700">Nome do Titular da Conta</label>
                    <input type="text" id="titular" {...register("titular")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
              )}

              {/* Segurança */}
              {activeTab === 'seguranca' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Alterar Senha</h4>
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg text-sm">
                    <p className="font-bold">Importante:</p>
                    <p>A nova senha deve ter no mínimo 8 caracteres, incluindo letras e números.</p>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="senha_atual" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                    <input type="password" id="senha_atual" {...registerSenha("senha_atual")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {errorsSenha.senha_atual && <p className="text-red-500 text-sm">{errorsSenha.senha_atual.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="nova_senha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input type="password" id="nova_senha" {...registerSenha("nova_senha")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {errorsSenha.nova_senha && <p className="text-red-500 text-sm">{errorsSenha.nova_senha.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                    <input type="password" id="confirmar_senha" {...registerSenha("confirma_senha")} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    {errorsSenha.confirma_senha && <p className="text-red-500 text-sm">{errorsSenha.confirma_senha.message}</p>}
                  </div>
                </div>
              )}

              {/* Botão de Submissão */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex items-center justify-center"
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