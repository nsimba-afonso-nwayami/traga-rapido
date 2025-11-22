export default function Footer() {
  return (
    <footer className="bg-gray-900 text-center">
      {/* Redes sociais */}
      <div className="py-4 flex justify-center">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-12 h-12
            text-2xl text-white border border-white rounded-full
            flex items-center justify-center
            m-1 transition-all duration-300
            hover:bg-blue-600 hover:rotate-180
          "
        >
          <i className="fab fa-facebook-f"></i>
        </a>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-12 h-12
            text-2xl text-white border border-white rounded-full
            flex items-center justify-center
            m-1 transition-all duration-300
            hover:bg-blue-600 hover:rotate-180
          "
        >
          <i className="fab fa-instagram"></i>
        </a>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-12 h-12
            text-2xl text-white border border-white rounded-full
            flex items-center justify-center
            m-1 transition-all duration-300
            hover:bg-blue-600 hover:rotate-180
          "
        >
          <i className="fab fa-linkedin"></i>
        </a>
      </div>

      {/* Créditos */}
      <div className="text-white text-base md:text-lg pt-8 pb-6 px-4 md:px-0 border-t border-white">
        &copy; 2025 TRAGA Rápido — Todos os direitos reservados
      </div>
    </footer>
  );
}
