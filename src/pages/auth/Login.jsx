import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginImg from "../../assets/img/login.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { loginSchema } from "../../validations/loginSchema";
import { loginService } from "../../services/loginService";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      // chama API
      const response = await loginService({
        email: data.email,
        password: data.password,
      });

      console.log("Resposta login:", response.data);

      const { token, id, tipo_usuario } = response.data;

      // salva no storage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("tipoUsuario", tipo_usuario);

      toast.success("Login feito com sucesso! Redirecionando...");

      // delay antes do redirect
      setTimeout(() => {
        if (tipo_usuario === "SOLICITANTE") {
          navigate("/dashboard/solicitante");
        } else if (tipo_usuario === "ENTREGADOR") {
          navigate("/dashboard/entregador");
        } else {
          navigate("/auth/login");
        }
      }, 2000);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
        "Não foi possível entrar. Verifique os dados."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        
        {/* COLUNA ESQUERDA */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img src={LoginImg} alt="Login Illustration" className="w-4/5" />
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Entre na sua conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-gray-800 text-sm">Email</label>
              <input
                type="email"
                className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="Digite o seu email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="text-gray-800 text-sm">Senha</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.password ? "border border-red-500" : ""
                }`}
                placeholder="Digite a sua senha"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Entrar
            </button>

            {/* Esqueceu a senha */}
            <Link
              to="/auth/esqueceu-senha"
              className="text-blue-600 text-sm text-center hover:text-blue-400"
            >
              Esqueceu a senha?
            </Link>

            <div className="flex items-center gap-2 my-2">
              <span className="flex-1 h-px bg-gray-300"></span>
              <span className="text-gray-800 text-sm">ou</span>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            {/* Criar conta */}
            <Link
              to="/auth/criar-conta"
              className="cursor-pointer self-center mt-4 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Criar conta
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
}
