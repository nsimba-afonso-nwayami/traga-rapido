import { useNavigate } from "react-router-dom";
import CadastroFimImg from "../../assets/img/cadastrofim.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { cadastroSolicitanteSchema } from "../../validations/cadastroSolicitante.schema";
import { completarCadastroSolicitante } from "../../services/solicitanteService";

export default function CadastrarSolicitante() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cadastroSolicitanteSchema),
  });

  const onSubmit = async (data) => {
    // Se a validação do Yup falhar, esta função não deveria ser chamada.
    // Mas se o erro for silencioso, esta verificação ajuda.
    const fotoRostoFile = data.fotoRosto?.[0];
    const biFrenteFile = data.biFrente?.[0];
    const biVersoFile = data.biVerso?.[0];

    // log para ver o que está sendo coletado
    console.log("Dados do Formulário:", {
      fotoRosto: fotoRostoFile,
      biFrente: biFrenteFile,
      biVerso: biVersoFile,
      morada: data.morada,
    });

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Nenhum usuário encontrado. Refaça o cadastro.");
        return;
      }

      await completarCadastroSolicitante({
        // Passando os objetos File diretamente
        fotoRosto: fotoRostoFile,
        biFrente: biFrenteFile,
        biVerso: biVersoFile,
        morada: data.morada,
        userId: userId,
      });

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
      // 💡 Adicione um log mais detalhado
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
            Complete seu cadastro de solicitante
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
                <label className="text-gray-800 text-sm">
                  Documento Frente
                </label>
                <input
                  type="file"
                  {...register("biFrente")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.biFrente ? "border border-red-500" : ""
                  }`}
                />
                {errors.biFrente && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.biFrente.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOC VERSO + MORADA */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-800 text-sm">Documento Verso</label>
                <input
                  type="file"
                  {...register("biVerso")}
                  className={`w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none ${
                    errors.biVerso ? "border border-red-500" : ""
                  }`}
                />
                {errors.biVerso && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.biVerso.message}
                  </p>
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.morada.message}
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
