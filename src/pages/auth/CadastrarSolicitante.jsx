import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CadastroFimImg from "../../assets/img/cadastrofim.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { cadastroSolicitanteSchema } from "../../validations/cadastroSolicitante.schema";

export default function CadastrarSolicitante() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cadastroSolicitanteSchema),
  });

  const onSubmit = (data) => {
    console.log("Dados enviados:", data);
    toast.success("Cadastro concluído com sucesso!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        {/* COLUNA ESQUERDA (Imagem — apenas no desktop) */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10">
          <img src={CadastroFimImg} alt="Login Illustration" className="w-4/5" />
        </div>

        {/* COLUNA DIREITA (Ocupando 100% no tablet e mobile) */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center min-h-screen lg:min-h-0">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Complete seu cadastro de solicitante
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* fotos na mesma linha no desktop, empilhados no mobile */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto do Rosto</label>
                <input
                  type="file"
                  {...register("fotoRosto")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.fotoRosto ? "border border-red-500" : ""
                }`}
                />
                {errors.fotoRosto && (
                  <p className="text-red-600 text-sm mt-1">{errors.fotoRosto.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto BI Frente</label>
                <input
                  type="file"
                  {...register("biFrente")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.biFrente ? "border border-red-500" : ""
                }`}
                />
                {errors.biFrente && (
                  <p className="text-red-600 text-sm mt-1">{errors.biFrente.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto BI Verso</label>
                <input
                  type="file"
                  {...register("biVerso")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.biVerso ? "border border-red-500" : ""
                }`}
                />
                {errors.biVerso && (
                  <p className="text-red-600 text-sm mt-1">{errors.biVerso.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Morada</label>
                <input
                  type="text"
                  {...register("morada")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.morada ? "border border-red-500" : ""
                }`}
                placeholder="Digite sua morada"
                />
                {errors.morada && (
                  <p className="text-red-600 text-sm mt-1">{errors.morada.message}</p>
                )}
              </div>
            </div>

            {/* Tipo de Pessoa */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Tipo de Pessoa</label>
                <select
                  {...register("tipoPessoa")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                  errors.tipoPessoa ? "border border-red-500" : ""
                }`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="empresa">Empresa</option>
                  <option value="singular">Singular</option>
                </select>
                {errors.tipoPessoa && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipoPessoa.message}</p>
                )}
              </div>
            </div>

            {/* Botão concluir cadastro */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-6 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Concluir Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
