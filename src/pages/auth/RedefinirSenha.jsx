import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RedefinirSenhaImg from "../../assets/img/redefinirsenha.png";

export default function RedefinirSenha() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img
            src={RedefinirSenhaImg}
            alt="Login Illustration"
            className="w-4/5"
          />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Redefinir senha
          </h2>

          <form method="POST" className="flex flex-col gap-4">
            <div>
              <label className="text-gray-800 text-sm">Nova senha</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                placeholder="Digite o sua nova senha"
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm">Confirmar nova senha</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                placeholder="Confirme sua nova senha"
                required
              />
            </div>

            {/* Botão salvar */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Salvar nova senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
