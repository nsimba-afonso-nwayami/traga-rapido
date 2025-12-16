import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";

import { pedidoSchema } from "../../validations/pedidoSchema";
import { criarPedido } from "../../services/pedidoService";
import { geocodeAddress } from "../../services/geocodeService";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function CriarNovoPedido() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pedidoSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo_item: "", // campo obrigatório, mas vazio
        peso_kg: data.peso_kg ? Number(data.peso_kg) : null,
        tamanho: "", // campo obrigatório, mas vazio
        urgencia: data.urgencia || null,
        origem_endereco: data.origem,
        origem_latitude: null, // coordenadas não usadas
        origem_longitude: null,
        destino_endereco: data.destino,
        destino_latitude: null,
        destino_longitude: null,
        valor_sugerido: data.valor_sugerido
          ? Number(data.valor_sugerido)
          : null,
        solicitante: 18, // trocar pelo ID real do usuário logado
      };

      console.log("Payload do pedido:", payload);

      const response = await criarPedido(payload);
      console.log("Pedido criado:", response.data);

      toast.success("Pedido criado com sucesso!", { duration: 3000 });
      reset();
      navigate("/dashboard/solicitante/pedidos");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);

      if (error.response?.data) {
        console.error(
          "Erro da API detalhado:",
          JSON.stringify(error.response.data, null, 2)
        );

        if (error.response.data.detail) {
          toast.error("Erro: " + error.response.data.detail);
        } else {
          const fieldErrors = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
          toast.error("Erro no envio:\n" + fieldErrors);
        }
      } else {
        toast.error("Erro ao enviar pedido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow p-6 sm:p-8 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Título do Pedido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("titulo")}
                  placeholder="Ex: Documentos Urgentes"
                  className={`w-full p-2 border rounded-lg ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  {...register("descricao")}
                  placeholder="Detalhe o conteúdo e as instruções..."
                  className={`w-full p-2 border rounded-lg resize-none ${
                    errors.descricao ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm">
                    {errors.descricao.message}
                  </p>
                )}
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Peso */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("peso_kg")}
                  placeholder="Ex: 2.5"
                  className={`w-full p-2 border rounded-lg ${
                    errors.peso_kg ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Urgência */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Urgência
                </label>
                <select
                  {...register("urgencia")}
                  defaultValue=""
                  className={`w-full p-2 border rounded-lg ${
                    errors.urgencia ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Selecione a urgência
                  </option>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="EXPRESS">Express</option>
                </select>
              </div>

              {/* Valor sugerido */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Valor sugerido (AKZ)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("valor_sugerido")}
                  placeholder="Ex: 1500"
                  className={`w-full p-2 border rounded-lg ${
                    errors.valor_sugerido ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Origem */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-blue-700">
                  Local de Origem <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  {...register("origem")}
                  placeholder="Digite o endereço completo de origem"
                  className={`w-full p-2 border rounded-lg resize-none ${
                    errors.origem ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Destino */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-blue-700">
                  Local de Destino <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  {...register("destino")}
                  placeholder="Digite o endereço completo de destino"
                  className={`w-full p-2 border rounded-lg resize-none ${
                    errors.destino ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Botão */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-600 text-white font-bold rounded-lg ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Enviando..." : "Enviar Pedido"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
