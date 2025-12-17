import { useState } from "react";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

// --- DADOS MOCKADOS PARA O HISTÓRICO ---
const mockHistorico = [
  { 
    id: "#1007", 
    titulo: "Entrega de Documentos", 
    origem: "Maianga, Luanda", 
    destino: "Talatona, Luanda", 
    data: "20/11/2025", 
    valor: "AOA 5.500", 
    status: "Concluído" 
  },
  { 
    id: "#1008", 
    titulo: "Pacote de E-commerce", 
    origem: "Viana", 
    destino: "Mutamba", 
    data: "15/11/2025", 
    valor: "AOA 0.00", 
    status: "Cancelado" 
  },
  { 
    id: "#1009", 
    titulo: "Chaves de Residência", 
    origem: "Benfica", 
    destino: "Alvalade", 
    data: "10/11/2025", 
    valor: "AOA 2.300", 
    status: "Concluído" 
  },
];

export default function HistoricoPedidos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarSolicitante sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        <HeaderSolicitante sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-8">
          <header>
            <h2 className="text-2xl font-bold text-gray-800">Histórico de Pedidos</h2>
            <p className="text-gray-500">Consulte todas as suas entregas finalizadas ou canceladas.</p>
          </header>

          {/* BARRA DE PESQUISA E FILTROS */}
          <div className="bg-white p-4 sm:p-6 border border-gray-300 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar por ID, título ou destino..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os Status</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* LISTA DE CARDS DE HISTÓRICO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHistorico.map((pedido) => (
              <div key={pedido.id} className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-mono text-blue-600 font-bold">{pedido.id}</span>
                      <h4 className="font-bold text-gray-800 truncate w-40">{pedido.titulo}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      pedido.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {pedido.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center"><i className="fas fa-calendar-alt w-5 text-gray-400"></i> {pedido.data}</p>
                    <p className="flex items-center"><i className="fas fa-map-marker-alt w-5 text-red-400"></i> <span className="truncate">{pedido.origem}</span></p>
                    <p className="flex items-center"><i className="fas fa-flag w-5 text-green-400"></i> <span className="truncate">{pedido.destino}</span></p>
                    <p className="flex items-center font-bold text-gray-800">
                      <i className="fas fa-coins w-5 text-yellow-500"></i> {pedido.valor}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 py-2 bg-gray-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                      <i className="fas fa-eye mr-1"></i> Detalhes
                    </button>
                    {pedido.status === "Concluído" && (
                      <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                        <i className="fas fa-receipt mr-1"></i> Recibo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÃO VER MAIS 100% LARGURA */}
          <div className="pt-4">
            <button 
              className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
              onClick={() => alert("Carregando mais registros...")}
            >
              <i className="fas fa-plus-circle"></i>
              VER MAIS REGISTROS
            </button>
          </div>

          <footer className="text-center text-gray-400 text-xs pb-10">
            Mostrando {mockHistorico.length} de 150 registros encontrados.
          </footer>
        </main>
      </div>
    </div>
  );
}