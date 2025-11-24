import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CadastroImg from "../../assets/img/cadastrarse.png";

export default function CadastrarSe() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img src={CadastroImg} alt="Login Illustration" className="w-4/5" />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Cadastrar-se
          </h2>

          <form method="POST" className="flex flex-col gap-4">
            {/* Nome e email na mesma linha no desktop, empilhados no mobile */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Nome</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite o seu nome"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite o seu email"
                  required
                />
              </div>
            </div>

            {/* Telefone e Tipo de Usuário */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Telefone</label>
                <input
                  type="tel"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite o seu telefone"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Tipo de Usuário</label>
                <select
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="entregador">Entregador</option>
                  <option value="solicitante">Solicitante</option>
                </select>
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-gray-800 text-sm">Senha</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                placeholder="Digite a sua senha"
                required
              />
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Criar Conta
            </button>

            {/* Já tenho conta */}
            <Link
              to="/auth/login"
              className="text-blue-600 text-sm text-center hover:text-blue-400"
            >
              Já tenho uma conta
            </Link>
            <Link
              to="/auth/cadastrar-solicitante"
              className="text-blue-600 text-sm text-center hover:text-blue-400"
            >
              Solicitante
            </Link>
            <Link
              to="/auth/cadastrar-entregador"
              className="text-blue-600 text-sm text-center hover:text-blue-400"
            >
              Entregador
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
