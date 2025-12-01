import { useNavigate } from "react-router-dom";
import CadastroFimImg from "../../assets/img/cadastrofim.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { cadastroEntregadorSchema } from "../../validations/cadastroEntregador.schema";
import { completarCadastroEntregador } from "../../services/entregadorService";

export default function CadastrarEntregador() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cadastroEntregadorSchema),
  });

  const onSubmit = async (data) => {
    const fotoRostoFile = data.fotoRosto?.[0];
    const biFrenteFile = data.fotoBIFrente?.[0];
    const biVersoFile = data.fotoBIVerso?.[0];
    const cartaFile = data.cartaConducao?.[0];

    console.log("Dados do Formulário Entregador:", {
      fotoRosto: fotoRostoFile,
      biFrente: biFrenteFile,
      biVerso: biVersoFile,
      carta: cartaFile,
      placaVeiculo: data.placaVeiculo,
    });

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Nenhum usuário encontrado. Refaça o cadastro.");
        return;
      }

      await completarCadastroEntregador({
        fotoRosto: fotoRostoFile,
        biFrente: biFrenteFile,
        biVerso: biVersoFile,
        cartaConducao: cartaFile,
        placaVeiculo: data.placaVeiculo,
        userId: userId,
      });

      // limpa localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("tipoUsuario");

      toast.success("Cadastro concluído! Redirecionando...", {
        duration: 2500,
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 2500);
    } catch (error) {
      console.error("Erro no envio do formulário:", error);

      if (error.response?.data) {
        toast.error(error.response.data.detail || "Erro ao enviar os dados");
      } else {
        toast.error("Erro de conexão ou erro desconhecido.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex">
        <div className="hidden lg:flex w-1/2 items-center justify-center p-10">
          <img src={CadastroFimImg} alt="Ilustração" className="w-4/5" />
        </div>

        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-wide">
            TRAGA RÁPIDO
          </h1>

          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Complete seu cadastro de entregador
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            {/* FOTO ROSTO + DOC FRENTE */}
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fotoRosto.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto BI Frente</label>
                <input
                  type="file"
                  {...register("fotoBIFrente")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.fotoBIFrente ? "border border-red-500" : ""
                  }`}
                />
                {errors.fotoBIFrente && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fotoBIFrente.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOC VERSO + CARTA */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Foto BI Verso</label>
                <input
                  type="file"
                  {...register("fotoBIVerso")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.fotoBIVerso ? "border border-red-500" : ""
                  }`}
                />
                {errors.fotoBIVerso && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fotoBIVerso.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-gray-800 text-sm">
                  Carta de Condução
                </label>
                <input
                  type="file"
                  {...register("cartaConducao")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.cartaConducao ? "border border-red-500" : ""
                  }`}
                />
                {errors.cartaConducao && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.cartaConducao.message}
                  </p>
                )}
              </div>
            </div>

            {/* PLACA */}
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Placa do veículo</label>
                <input
                  type="text"
                  {...register("placaVeiculo")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.placaVeiculo ? "border border-red-500" : ""
                  }`}
                  placeholder="Digite a placa do seu veículo"
                />
                {errors.placaVeiculo && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.placaVeiculo.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Concluir Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
