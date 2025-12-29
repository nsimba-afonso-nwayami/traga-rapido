import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

import { pedidoSchema } from "../../validations/pedidoSchema";
import { criarPedido } from "../../services/pedidoService";
import { criarNotificacao } from "../../services/notificacaoService";
import { geocodeAddress } from "../../services/geocodeService";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function CriarNovoPedido() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

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
        solicitante: user.id, // trocar pelo ID real do usuário logado
        entregador: 3,
      };

      console.log("Payload do pedido:", payload);

      const response = await criarPedido(payload);
      console.log("Pedido criado:", response.data);

      await criarNotificacao({
        titulo: "Novo pedido disponível 🚚",
        mensagem: `Novo pedido: ${data.titulo}`,
        usuario: 3,
      });

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
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DO FORMULÁRIO COM ROLAGEM */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          {/* ESPAÇADOR PARA O HEADER FIXO */}
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              {/* Cabeçalho do Formulário */}
              <div className="bg-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <i className="fas fa-plus-circle mr-3"></i>
                  Solicitar Nova Entrega
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Preencha os dados abaixo para encontrar um entregador
                  disponível.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Seção: Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Título do Pedido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("titulo")}
                      placeholder="Ex: Entrega de Documentos Contábeis"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        errors.titulo
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.titulo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.titulo.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Descrição Detalhada{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="3"
                      {...register("descricao")}
                      placeholder="Descreva o que será entregue e se há cuidados especiais..."
                      className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        errors.descricao
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.descricao && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.descricao.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("peso_kg")}
                      placeholder="0.00"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Urgência
                    </label>
                    <select
                      {...register("urgencia")}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="URGENTE">Urgente</option>
                      <option value="EXPRESS">Express</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Valor Sugerido (AKZ)
                    </label>
                    <input
                      type="number"
                      {...register("valor_sugerido")}
                      placeholder="Ex: 2500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400 font-semibold">
                      Logística de Endereços
                    </span>
                  </div>
                </div>

                {/* Seção: Endereços */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-blue-700 flex items-center">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>{" "}
                      Local de Origem{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      rows="2"
                      {...register("origem")}
                      placeholder="Endereço completo de retirada..."
                      className={`w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        errors.origem
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-blue-700 flex items-center">
                      <i className="fas fa-flag-checkered mr-2 text-green-500"></i>{" "}
                      Local de Destino{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      rows="2"
                      {...register("destino")}
                      placeholder="Endereço completo de entrega..."
                      className={`w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        errors.destino
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 cursor-pointer bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 cursor-pointer bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center transition-all ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700 active:scale-95"
                    }`}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                        Processando...
                      </>
                    ) : (
                      "Confirmar Pedido"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
