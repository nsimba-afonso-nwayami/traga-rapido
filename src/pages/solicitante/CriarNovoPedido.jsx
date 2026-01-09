import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

// IMPORTAÇÕES DO MAPA (Adicionado Polyline para traçar a rota)
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção necessária para o ícone do marcador aparecer no React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

import { pedidoSchema } from "../../validations/pedidoSchema";
import { criarPedido } from "../../services/pedidoService";
import { criarNotificacao } from "../../services/notificacaoService";
import { geocodeAddress } from "../../services/geocodeService";
import { listarUsuarios } from "../../services/usuarioService";

import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

// Auxiliar para mover a visão do mapa e enquadrar a rota
function RecenterMap({ coords, route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (coords) {
      map.setView(coords, 16);
    }
  }, [coords, route, map]);
  return null;
}

export default function CriarNovoPedido() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  // Coordenadas
  const [mapCenter, setMapCenter] = useState([-8.8399, 13.2894]);
  const [destinoCoords, setDestinoCoords] = useState({ lat: null, lng: null });
  const [rotaCaminho, setRotaCaminho] = useState([]); // Pontos da linha da rota

  // Estados para Sugestões
  const [sugestoesOrigem, setSugestoesOrigem] = useState([]);
  const [sugestoesDestino, setSugestoesDestino] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pedidoSchema),
  });

  const watchOrigem = watch("origem");
  const watchDestino = watch("destino");

  // Função para buscar os pontos da rota (OSRM)
  const calcularRota = async (lat1, lon1, lat2, lon2) => {
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`
      );
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const pontos = data.routes[0].geometry.coordinates.map((p) => [
          p[1],
          p[0],
        ]);
        setRotaCaminho(pontos);
      }
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
    }
  };

  useEffect(() => {
    if (mapCenter && destinoCoords.lat) {
      calcularRota(
        mapCenter[0],
        mapCenter[1],
        destinoCoords.lat,
        destinoCoords.lng
      );
    } else {
      setRotaCaminho([]);
    }
  }, [mapCenter, destinoCoords]);

  const formatarEnderecoCurto = (displayName) => {
    if (!displayName) return "";
    const partes = displayName.split(",");
    return partes.slice(0, 3).join(",").trim();
  };

  const buscarEnderecos = async (query, setSugestoes) => {
    if (query?.length > 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ao&limit=5`
        );
        const data = await response.json();
        setSugestoes(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSugestoes([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      () => buscarEnderecos(watchOrigem, setSugestoesOrigem),
      600
    );
    return () => clearTimeout(timer);
  }, [watchOrigem]);

  useEffect(() => {
    const timer = setTimeout(
      () => buscarEnderecos(watchDestino, setSugestoesDestino),
      600
    );
    return () => clearTimeout(timer);
  }, [watchDestino]);

  const selecionarEndereco = (item, tipo) => {
    const coords = [parseFloat(item.lat), parseFloat(item.lon)];
    const enderecoCurto = formatarEnderecoCurto(item.display_name);
    if (tipo === "origem") {
      setValue("origem", enderecoCurto);
      setMapCenter(coords);
      setSugestoesOrigem([]);
    } else {
      setValue("destino", enderecoCurto);
      setDestinoCoords({ lat: coords[0], lng: coords[1] });
      setSugestoesDestino([]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation)
      return toast.error("Seu navegador não suporta geolocalização.");
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setValue("origem", formatarEnderecoCurto(data.display_name));
          } else {
            setValue(
              "origem",
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
          }
          toast.success("Localização de origem capturada!");
        } catch (err) {
          setValue("origem", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } finally {
          setLocalizando(false);
        }
      },
      () => {
        setLocalizando(false);
        toast.error("Erro ao obter localização.");
      }
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo_item: "",
        peso_kg: data.peso_kg ? Number(data.peso_kg) : null,
        tamanho: "",
        urgencia: data.urgencia || null,
        origem_endereco: data.origem,
        origem_latitude: mapCenter[0],
        origem_longitude: mapCenter[1],
        destino_endereco: data.destino,
        destino_latitude: destinoCoords.lat,
        destino_longitude: destinoCoords.lng,
        valor_sugerido: data.valor_sugerido
          ? Number(data.valor_sugerido)
          : null,
        solicitante: user.id,
      };

      const pedidoCriado = await criarPedido(payload);

      // MANTIDO: Sua mensagem original no console
      console.log("PEDIDO CRIADO: ", pedidoCriado);

      // 1. Notificação para o Solicitante (quem criou)
      await criarNotificacao({
        usuario: user.id,
        titulo: "Pedido Criado",
        mensagem: `Seu pedido "${data.titulo}" foi criado com sucesso!`,
      });

      // 2. Notificação para todos os Entregadores
      try {
        const todosUsuarios = await listarUsuarios();

        // Filtramos apenas quem tem o tipo ENTREGADOR
        const entregadores = todosUsuarios.filter(
          (u) => u.tipo === "ENTREGADOR"
        );

        // Enviamos as notificações para todos simultaneamente
        await Promise.all(
          entregadores.map((entregador) =>
            criarNotificacao({
              usuario: entregador.id,
              titulo: "Novo Pedido Disponível",
              mensagem: `Novo pedido: "${data.titulo}". Verifique os detalhes na lista de entregas.`,
            })
          )
        );
      } catch (err) {
        // Erro ao notificar entregadores não deve impedir o sucesso do pedido
        console.error("Erro ao notificar entregadores:", err);
      }

      toast.success("Pedido criado com sucesso!");
      reset();
      navigate("/dashboard/solicitante/pedidos");
    } catch (error) {
      // MANTIDO: O log de erro caso a criação falhe
      console.error("ERRO AO CRIAR PEDIDO:", error);
      toast.error("Erro ao enviar pedido");
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
          <div className="h-20 w-full shrink-0"></div>

          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <i className="fas fa-plus-circle mr-3"></i> Solicitar Nova
                  Entrega
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Título do Pedido *
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
                      Descrição Detalhada *
                    </label>
                    <textarea
                      rows="3"
                      {...register("descricao")}
                      placeholder="Descreva o que será entregue..."
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
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                      Logística e Rota
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 relative">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-bold text-blue-700 flex items-center">
                          <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>{" "}
                          Local de Origem *
                        </label>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                        >
                          <i
                            className={`fas ${
                              localizando
                                ? "fa-spinner fa-spin"
                                : "fa-crosshairs"
                            } mr-1`}
                          ></i>{" "}
                          Usar minha localização
                        </button>
                      </div>
                      <textarea
                        rows="2"
                        {...register("origem")}
                        placeholder="Endereço de retirada..."
                        className={`w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                          errors.origem
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />

                      {sugestoesOrigem.length > 0 && (
                        <div className="absolute z-9999 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
                          {sugestoesOrigem.map((s, i) => (
                            <div
                              key={i}
                              onClick={() => selecionarEndereco(s, "origem")}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                            >
                              {s.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 relative">
                      <label className="text-sm font-bold text-blue-700 flex items-center pt-[5px] md:pt-0 mb-1">
                        <i className="fas fa-flag-checkered mr-2 text-green-500"></i>{" "}
                        Local de Destino *
                      </label>
                      <textarea
                        rows="2"
                        {...register("destino")}
                        placeholder="Endereço de entrega..."
                        className={`w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                          errors.destino
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />

                      {sugestoesDestino.length > 0 && (
                        <div className="absolute z-9999 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
                          {sugestoesDestino.map((s, i) => (
                            <div
                              key={i}
                              onClick={() => selecionarEndereco(s, "destino")}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                            >
                              {s.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-[350px] rounded-xl border border-gray-300 overflow-hidden relative z-0">
                    <MapContainer
                      center={mapCenter}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <RecenterMap coords={mapCenter} route={rotaCaminho} />
                      <Marker position={mapCenter}>
                        <Popup>Origem</Popup>
                      </Marker>
                      {destinoCoords.lat && (
                        <Marker
                          position={[destinoCoords.lat, destinoCoords.lng]}
                        >
                          <Popup>Destino</Popup>
                        </Marker>
                      )}

                      {/* TRAÇADO DA ROTA (Linha Azul) */}
                      {rotaCaminho.length > 0 && (
                        <Polyline
                          positions={rotaCaminho}
                          color="#3b82f6"
                          weight={5}
                          opacity={0.7}
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>

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
                    className={`px-10 py-3 cursor-pointer bg-blue-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center transition-all ${
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
