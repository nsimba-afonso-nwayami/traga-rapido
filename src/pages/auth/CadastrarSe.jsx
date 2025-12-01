import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CadastroImg from "../../assets/img/cadastrarse.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { cadastroSchema } from "../../validations/cadastroSchema";
import { cadastrarUsuario } from "../../services/cadastroService";

export default function CadastrarSe() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cadastroSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Chamada ao serviço de cadastro
      const response = await cadastrarUsuario(data);

      // Log completo da resposta para debug
      console.log("Resposta da API:", response.data);

      // Extrai informações do usuário
      const userId = response.data.id;
      const tipo = response.data.tipo;
      const token = response.token || "";

      // Salva no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("tipoUsuario", tipo);

      // Toast de sucesso
      toast.success("Cadastrado com sucesso! Redirecionando...", {
        duration: 3000,
      });

      // Redireciona após 3 segundos baseado no tipo de usuário
      setTimeout(() => {
        if (tipo === "SOLICITANTE") {
          navigate("/auth/cadastrar-solicitante");
        } else if (tipo === "ENTREGADOR") {
          navigate("/auth/cadastrar-entregador");
        }
      }, 3000);
    } catch (error) {
      // Log detalhado do erro
      console.error("Erro na API:", error.response?.data || error.message);

      // Mensagem do backend ou padrão
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.response?.data) {
        toast.error(JSON.stringify(error.response.data));
      } else {
        toast.error("Erro de conexão");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img src={CadastroImg} alt="Login Illustration" className="w-4/5" />
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Cadastrar-se
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nome + Email */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Nome</label>
                <input
                  type="text"
                  {...register("nome")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.nome ? "border border-red-500" : ""
                  }`}
                  placeholder="Digite o seu nome"
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.email ? "border border-red-500" : ""
                  }`}
                  placeholder="Digite o seu email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Telefone + Tipo */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Telefone</label>
                <input
                  type="tel"
                  {...register("telefone")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.telefone ? "border border-red-500" : ""
                  }`}
                  placeholder="Digite o seu telefone"
                />
                {errors.telefone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Tipo de Usuário</label>
                <select
                  {...register("tipo")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.tipo ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ENTREGADOR">Entregador</option>
                  <option value="SOLICITANTE">Solicitante</option>
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tipo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-gray-800 text-sm">Senha</label>
              <input
                type="password"
                {...register("senha")}
                className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.senha ? "border border-red-500" : ""
                }`}
                placeholder="Digite a sua senha"
              />
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Criar Conta
            </button>

            <Link
              to="/auth/login"
              className="text-blue-700 text-sm text-center hover:text-blue-600"
            >
              Já tenho uma conta
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
