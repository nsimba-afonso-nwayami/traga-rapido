import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function NotFound() {
  return (
    <>
      {/*Header*/}
      <Header />

      <section className="pt-40 pb-32 px-6 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-8xl font-extrabold text-blue-600">404</h1>

          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
            Página não encontrada
          </h2>

          <p className="text-gray-600 mt-3">
            A página que você tentou acessar não existe ou foi movida.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Voltar para a Home
          </Link>
        </motion.div>
      </section>

      {/*Footer*/}
      <Footer />
    </>
  );
}
