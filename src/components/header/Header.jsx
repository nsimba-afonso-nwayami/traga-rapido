import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Fecha o menu ao rolar a página
  useEffect(() => {
    const closeMenu = () => setOpen(false);
    window.addEventListener("scroll", closeMenu);
    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center justify-between px-4 md:px-8 py-4">
      
      {/* LOGO */}
      <a href="/" className="text-3xl font-bold text-blue-700 flex items-center" title="TRAGA Rápido">
        TRAGA Rápido
      </a>

      {/* NAVBAR */}
      <nav
        className={`
          absolute top-full left-0 w-full bg-white shadow p-4
          transition-all duration-300
          ${open ? "block" : "hidden"}
          md:static md:flex md:items-center md:w-auto md:bg-transparent md:shadow-none md:p-0
        `}
      >
        <a href="/" className="block md:inline-block text-gray-800 hover:text-blue-600 py-2 md:py-0 md:mr-6">Home</a>
        <a href="/#como-funciona" className="block md:inline-block text-gray-800 hover:text-blue-700 py-2 md:py-0 md:mr-6">Como Funciona</a>
        <a href="/#sou-solicitante" className="block md:inline-block text-gray-800 hover:text-blue-700 py-2 md:py-0 md:mr-6">Sou Solicitante</a>
        <a href="/#sou-entregador" className="block md:inline-block text-gray-800 hover:text-blue-700 py-2 md:py-0 md:mr-6">Sou Entregador</a>

        <a
          href="/auth/login"
          className="mt-4 md:mt-0 block md:inline-block bg-blue-700 text-white text-center font-semibold px-4 py-2 rounded-md hover:bg-blue-900 transition"
        >
          Entrar
          <i className="fas fa-sign-out-alt ml-2"></i>
        </a>
      </nav>

      {/* BOTÃO MOBILE */}
      <div className="text-3xl text-gray-800 cursor-pointer md:hidden" onClick={() => setOpen(!open)}>
        <i className={`fas ${open ? "fa-times text-blue-700" : "fa-bars"}`}></i>
      </div>
    </header>
  );
}
