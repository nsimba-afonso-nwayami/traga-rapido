import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VerifiqueEmailImg from "../assets/img/verifiqueemail.png";

export default function VerifiqueEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img
            src={VerifiqueEmailImg}
            alt="Verifique Email Illustration"
            className="w-4/5"
          />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-2 tracking-wide">
            Verifique seu e-mail
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Enviámos um link de recuperação para o seu e-mail. Clique no link para recuperar a sua conta.
          </h2>
        </div>
      </div>
    </div>
  );
}
