import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarSolicitante from "../../components/solicitante/SidebarSolicitante";
import HeaderSolicitante from "../../components/solicitante/HeaderSolicitante";

export default function MensagensSolicitante() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      {" "}
      {/* overflow-hidden evita scroll duplo na página toda */}
      <SidebarSolicitante
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        {/* HEADER FIXO */}
        <HeaderSolicitante
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ÁREA DE CONTEÚDO COM ROLAGEM PRÓPRIA */}
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 sm:px-6">
          {/* ESPAÇADOR MANUAL: Isso garante que o conteúdo comece DEPOIS do header */}
          <div className="h-20 w-full"></div>

          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
            
          </section>
        </main>

      </div>
    </div>
  );
}
