import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EsqueceuSenhaImg from "../../assets/img/esqueceusenha.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { esqueceuSenhaSchema } from "../../validations/esqueceuSenha.schema";

export default function EsqueceuSenha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esqueceuSenhaSchema),
  });

  const onSubmit = (data) => {
    console.log("Email enviado para recuperação:", data);
    toast.success("Link de recuperação enviado com sucesso!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img src={EsqueceuSenhaImg} alt="Login Illustration" className="w-4/5" />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Esqueceu a senha?
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div>
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
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Enviar link de recuperação
            </button>

            <div className="flex items-center gap-2 my-2">
              <span className="flex-1 h-px bg-gray-300"></span>
              <span className="text-gray-800 text-sm">ou</span>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            {/* Criar conta */}
            <Link
              to="/auth/login"
              className="cursor-pointer self-center mt-4 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Voltar ao Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
