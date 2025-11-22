import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CadastroFimImg from "../assets/img/cadastrofim.png";

export default function CadastrarEntregador() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img
            src={CadastroFimImg}
            alt="Login Illustration"
            className="w-4/5"
          />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Complete seu cadastro de entregador
          </h2>

          <form method="POST" className="flex flex-col gap-4">
            {/* Concluindo cadastro */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">
                  Documento de Identidade
                </label>
                <input
                  type="file"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite o seu NIF"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Número do Bilhete de Identidade</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">
                  Número da Carta de Condução
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite o número da sua carta"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto</label>
                <input
                  type="file"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Tipo de Veículo</label>
                <select
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="carro">Carro</option>
                  <option value="camião">Camião</option>
                  <option value="mota">Mota</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">
                  Placa do veículo
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
                  placeholder="Digite a placa do seu veículo"
                  required
                />
              </div>
            </div>

            {/* Botão concluir cadastro */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Concluir Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
