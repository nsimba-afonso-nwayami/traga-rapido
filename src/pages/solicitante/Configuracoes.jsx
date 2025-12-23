import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { usuarioUpdateSchema } from "../../validations/usuarioUpdateSchema";
import { usuarioSenhaUpdateSchema } from "../../validations/usuarioSenhaUpdateSchema";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";
import {
  getUsuario,
  updateUsuario,
  updateSenhaUsuario,
} from "../../services/usuarioService";

export default function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

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
    formState: { errors: errorsSenha },
    reset: resetSenha,
  } = useForm({
    resolver: yupResolver(usuarioSenhaUpdateSchema),
  });

  // Buscar dados do usuário via API
  useEffect(() => {
    if (user?.userId || user?.id) {
      getUsuario(user.userId || user.id)
        .then((data) => {
          setValue("nome", data.username || "");
          setValue("email", data.email || "");
          setValue("telefone", data.telefone || "");
        })
        .catch((err) => {
          console.error("Erro ao buscar usuário:", err);
          toast.error("Não foi possível carregar os dados do usuário.");
        });
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!user?.userId && !user?.id) {
      toast.error("Usuário não identificado.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: data.nome,
        email: data.email,
        telefone: data.telefone,
        tipo: localStorage.getItem("tipoUsuario") || null,
      };

      const atualizado = await updateUsuario(user.userId || user.id, payload);
      toast.success("Dados atualizados com sucesso!", { duration: 3000 });

      setValue("nome", atualizado.username || "");
      setValue("email", atualizado.email || "");
      setValue("telefone", atualizado.telefone || "");
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      if (err.response?.data?.detail) {
        toast.error("Erro: " + err.response.data.detail);
      } else {
        toast.error("Erro ao atualizar dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback para avatar
  const usernameInicial = user?.username?.[0] || "U";

  const onSubmitSenha = async (data) => {
    if (!user?.userId && !user?.id) {
      toast.error("Usuário não identificado.");
      return;
    }

    try {
      await updateSenhaUsuario(user.userId || user.id, {
        nova_senha: data.nova_senha,
      });

      toast.success("Senha alterada com sucesso!");
      resetSenha();
    } catch (err) {
      console.error("Erro ao alterar senha:", err);

      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Erro ao alterar senha.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-6 sm:p-8">
            {/* ABAS DE NAVEGAÇÃO */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("perfil")}
                  className={`py-2 px-4 text-lg font-semibold border-b-2 transition duration-200 ${
                    activeTab === "perfil"
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-user-circle mr-2"></i> Perfil
                </button>
                <button
                  onClick={() => setActiveTab("seguranca")}
                  className={`py-2 px-4 text-lg font-semibold border-b-2 transition duration-200 ${
                    activeTab === "seguranca"
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300"
                  }`}
                >
                  <i className="fas fa-shield-alt mr-2"></i> Segurança
                </button>
              </nav>
            </div>

            {/* CONTEÚDO DA ABA ATIVA */}
            <div className="py-4">
              {activeTab === "perfil" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                    Atualizar Informações Pessoais
                  </h3>

                  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Avatar */}
                    <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {usernameInicial}
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
                          {...register("nome")}
                          className={`w-full p-2 border rounded-lg focus:outline-none ${
                            errors.nome ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.nome && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.nome.message}
                          </p>
                        )}
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
                          {...register("email")}
                          disabled
                          className={`w-full p-2 border rounded-lg focus:outline-none ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
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
                          {...register("telefone")}
                          className={`w-full p-2 border rounded-lg focus:outline-none ${
                            errors.telefone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.telefone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.telefone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg ${
                          loading
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-blue-700"
                        }`}
                      >
                        {loading ? "Salvando..." : "Salvar Alterações"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "seguranca" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                    Alterar Senha de Acesso
                  </h3>

                  <form
                    className="space-y-4 max-w-md"
                    onSubmit={handleSubmitSenha(onSubmitSenha)}
                  >
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
                        {...registerSenha("senha_atual")}
                        className={`w-full p-2 border rounded-lg focus:outline-none ${
                          errorsSenha.senha_atual
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errorsSenha.senha_atual && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsSenha.senha_atual.message}
                        </p>
                      )}
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
                        {...registerSenha("nova_senha")}
                        className={`w-full p-2 border rounded-lg focus:outline-none ${
                          errorsSenha.nova_senha
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errorsSenha.nova_senha && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsSenha.nova_senha.message}
                        </p>
                      )}
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
                        {...registerSenha("confirma_senha")}
                        className={`w-full p-2 border rounded-lg focus:outline-none ${
                          errorsSenha.confirma_senha
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errorsSenha.confirma_senha && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsSenha.confirma_senha.message}
                        </p>
                      )}
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
