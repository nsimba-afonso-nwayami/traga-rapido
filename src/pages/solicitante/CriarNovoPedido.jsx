import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pedidoSchema),
  });

  const onSubmit = async (data) => {
    try {
      // 1. Converter endereços em coordenadas
      const origemCoord = await geocodeAddress(data.origem);
      const destinoCoord = await geocodeAddress(data.destino);

      // 2. Preparar payload no formato da API (sem solicitanteId)
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao,
        origemLatitude: origemCoord.lat,
        origemLongitude: origemCoord.lon,
        destinoLatitude: destinoCoord.lat,
        destinoLongitude: destinoCoord.lon,
      };

      // 3. Enviar para API
      const response = await criarPedido(payload);

      console.log("Pedido criado:", response.data);

      toast.success("Pedido criado com sucesso!", {
        duration: 3000,
      });

    } catch (error) {
      console.error("Erro ao criar pedido:", error);

      if (error.message === "Endereço não encontrado.") {
        toast.error("Verifique os endereços de origem e destino.");
        return;
      }

      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Erro ao enviar pedido");
      }
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarSolicitante 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* MAIN CONTENT */}
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
                  className={`w-full p-2 border rounded-lg outline-none
                    ${errors.titulo ? "border-red-500" : "border-gray-300"}`}
                />

                {errors.titulo && (
                  <p className="text-red-500 text-sm">{errors.titulo.message}</p>
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
                  className={`w-full p-2 border rounded-lg outline-none resize-none
                    ${errors.descricao ? "border-red-500" : "border-gray-300"}`}
                />

                {errors.descricao && (
                  <p className="text-red-500 text-sm">{errors.descricao.message}</p>
                )}
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Origem */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-blue-700">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Local de Origem <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows="3"
                  {...register("origem")}
                  placeholder="Digite o endereço completo de origem"
                  className={`w-full p-2 border rounded-lg outline-none resize-none
                    ${errors.origem ? "border-red-500" : "border-gray-300"}`}
                />

                {errors.origem && (
                  <p className="text-red-500 text-sm">{errors.origem.message}</p>
                )}
              </div>

              {/* Destino */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-blue-700">
                  <i className="fas fa-route mr-2"></i>
                  Local de Destino <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows="3"
                  {...register("destino")}
                  placeholder="Digite o endereço completo de destino"
                  className={`w-full p-2 border rounded-lg outline-none resize-none
                    ${errors.destino ? "border-red-500" : "border-gray-300"}`}
                />

                {errors.destino && (
                  <p className="text-red-500 text-sm">{errors.destino.message}</p>
                )}
              </div>

              {/* Botão */}
              <div className="pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg 
                    shadow-md hover:bg-blue-700 transition flex items-center"
                >
                  <i className="fas fa-check-circle mr-3 text-lg"></i>
                  Enviar Pedido
                </button>
              </div>

            </form>

          </div>
        </main>
      </div>
    </div>
  );
}
