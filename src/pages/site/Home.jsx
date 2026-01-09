import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroImg from "../../assets/img/Hero.jpg";
import SolicitanteImg from "../../assets/img/solicitante.jpg";
import EntregadorImg from "../../assets/img/entregador.jpg";
import ParallaxImg from "../../assets/img/parallax.jpg";
import DownloadImg from "../../assets/img/download_app.jpg";
import ReviewImg1 from "../../assets/img/review1.jpeg";
import ReviewImg2 from "../../assets/img/review2.jpg";
import ReviewImg3 from "../../assets/img/review3.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const testimonials = [
  {
    name: "Carla Domingos",
    role: "Usuária do TRAGA Rápido",
    text: "O serviço é extremamente rápido! Meu pedido chegou em poucos minutos. Super recomendo!",
    img: ReviewImg1,
  },
  {
    name: "Márcia André",
    role: "Entregador Parceiro",
    text: "Consigo trabalhar com liberdade e ainda ter uma renda excelente. O aplicativo é simples e intuitivo.",
    img: ReviewImg2,
  },
  {
    name: "Helena Sousa",
    role: "Cliente Frequente",
    text: "Uso o TRAGA Rápido sempre que preciso enviar algo urgente. Nunca me deixou na mão!",
    img: ReviewImg3,
  },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HeroImg})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/70"></div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-10 max-w-3xl px-6 text-center"
        >
          <h3 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">
            Entregas rápidas e seguras com o TRAGA RÁPIDO
          </h3>

          <p className="text-white text-2xl leading-relaxed mt-4">
            Conectamos você ao entregador mais próximo em segundos
          </p>

          <a
            href="/auth/login"
            className="mt-4 md:mt-0 bg-blue-700 text-white text-center font-semibold px-4 py-2 rounded-md inline-flex items-center gap-2 hover:bg-blue-900 transition"
          >
            Fazer Pedido Agora
          </a>
        </motion.div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Como funciona
          </h2>

          {/* Subtítulo */}
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            Rápido, simples e seguro em apenas 3 etapas
          </p>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              variants={fadeUp}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center"
            >
              <i className="fa-solid fa-box text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Faça o pedido
              </h3>
              <p className="text-gray-600 mt-3">
                Escolha o ponto de coleta e o destino de entrega em poucos
                cliques
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center"
            >
              <i className="fa-solid fa-truck text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Escolha o entregador
              </h3>
              <p className="text-gray-600 mt-3">
                Receba propostas e negocie de forma segura
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center"
            >
              <i className="fa-solid fa-map-location-dot text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Receba sua entrega
              </h3>
              <p className="text-gray-600 mt-3">
                Acompanhe a sua entrega em tempo real
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SEÇÃO SOLICITANTE */}
      <section id="sou-solicitante" className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full flex justify-center"
          >
            <img
              src={SolicitanteImg}
              alt="Solicitante recebendo encomenda"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900">
              Sou Solicitante
            </h2>
            <p className="text-gray-700 text-lg mt-4 leading-relaxed max-w-md">
              Peça entregas rápidas e seguras sem complicação. Conecte-se a
              entregadores próximos, negocie o preço e acompanhe seu pedido em
              tempo real.
            </p>
            <a
              href="/auth/login"
              className="mt-8 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Fazer Pedido Agora
            </a>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO ENTREGADOR */}
      <section id="sou-entregador" className="w-full py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full flex justify-center order-1 md:order-0"
          >
            <img
              src={EntregadorImg}
              alt="Entregador com moto"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900">Sou Entregador</h2>
            <p className="text-gray-700 text-lg mt-4 leading-relaxed max-w-md">
              Cadastre-se para receber pedidos próximos a você, negocie
              diretamente com o solicitante e aumente sua renda fazendo entregas
              rápidas e seguras.
            </p>
            <a
              href="/auth/login"
              className="mt-8 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
            >
              Quero Me Cadastrar
            </a>
          </motion.div>
        </div>
      </section>

      {/* PARALLAX */}
      <section
        className="relative min-h-[50vh] flex items-center bg-cover bg-center bg-no-repeat bg-fixed p-3"
        style={{ backgroundImage: `url(${ParallaxImg})` }}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]"></div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative max-w-4xl px-6 text-center mx-auto"
        >
          <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mb-6">
            Entrega Rápida, Segura e Sem Complicação
          </h3>
          <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed">
            Conectamos você ao entregador mais próximo com agilidade e
            segurança.
          </p>
          <a
            href="/auth/login"
            className="inline-block mt-6 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition"
          >
            Fazer Pedido Agora
          </a>
        </motion.div>
      </section>

      {/* DOWNLOAD APP */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 py-20 px-6 lg:px-16 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex justify-center"
        >
          <img
            src={DownloadImg}
            alt="App"
            className="w-full max-w-xl object-cover rounded-lg"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-snug">
            Leve o TRAGA Rápido <br /> com você
          </h2>
          <p className="text-gray-700 text-lg mt-4 max-w-md mx-auto lg:mx-0">
            Disponível para Android e iOS. Faça entregas ou receba em minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
            <a
              href="#"
              className="flex items-center justify-center gap-3 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition w-full sm:w-auto"
            >
              Baixar no Google Play
              <i className="fab fa-google-play text-xl"></i>
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-3 bg-blue-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition w-full sm:w-auto"
            >
              Baixar na App Store
              <i className="fab fa-apple text-xl"></i>
            </a>
          </div>
        </motion.div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-gray-100 px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            O que dizem nossos usuários
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Experiências reais de pessoas que usam o TRAGA Rápido todos os dias
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {t.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIPOS DE ENTREGAS */}
      <section id="tipos-entregas" className="py-20 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Tipos de Entregas
          </h2>

          {/* Subtítulo */}
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            O TRAGA Rápido atende diversas necessidades de envio
          </p>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <motion.div
              variants={fadeUp}
              className="bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-box-open text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Pequenas Encomendas
              </h3>
              <p className="text-gray-600 mt-3">
                Ideal para pacotes leves, presentes, pequenos objetos e itens
                pessoais.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp}
              className="bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-file-lines text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Documentos Urgentes
              </h3>
              <p className="text-gray-600 mt-3">
                Entrega rápida e segura de documentos importantes e assinaturas.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp}
              className="bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-bag-shopping text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Compras e Retiradas
              </h3>
              <p className="text-gray-600 mt-3">
                O entregador recolhe suas compras ou produtos em qualquer loja.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              variants={fadeUp}
              className="bg-gray-50 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-building text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Entregas Empresariais
              </h3>
              <p className="text-gray-600 mt-3">
                Solução ideal para empresas que precisam enviar itens
                diariamente.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SEGURANÇA & CONFIABILIDADE */}
      <section id="seguranca" className="py-20 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Segurança & Confiabilidade
          </h2>

          {/* Subtítulo */}
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            A tua entrega sempre protegida, do início ao fim
          </p>

          {/* GRID */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ITEM 1 */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-shield-halved text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Motoristas Verificados
              </h3>
              <p className="text-gray-600 mt-3">
                Todos os entregadores passam por verificação de identidade e
                histórico.
              </p>
            </motion.div>

            {/* ITEM 2 */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-location-dot text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Rastreamento em Tempo Real
              </h3>
              <p className="text-gray-600 mt-3">
                Acompanhe cada etapa da entrega pelo mapa, sem surpresas.
              </p>
            </motion.div>

            {/* ITEM 3 */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-lock text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Pagamento Seguro
              </h3>
              <p className="text-gray-600 mt-3">
                Suas transações são protegidas com tecnologia de segurança
                avançada.
              </p>
            </motion.div>

            {/* ITEM 4 */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <i className="fa-solid fa-headset text-blue-700 text-5xl mb-6"></i>

              <h3 className="text-xl font-semibold text-gray-800">
                Suporte 24/7
              </h3>
              <p className="text-gray-600 mt-3">
                Atendimento rápido sempre que precisares de ajuda.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ESTATÍSTICAS */}
      <section id="estatisticas" className="py-24 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Nossos Números
          </h2>

          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            Resultados que mostram a confiança dos nossos usuários
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <i className="fa-solid fa-box text-blue-700 text-6xl mb-4"></i>
              <h3 className="text-4xl font-extrabold text-gray-800">+10.000</h3>
              <p className="text-gray-600 mt-2 text-lg">Entregas realizadas</p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <i className="fa-solid fa-motorcycle text-blue-700 text-6xl mb-4"></i>
              <h3 className="text-4xl font-extrabold text-gray-800">1.200+</h3>
              <p className="text-gray-600 mt-2 text-lg">Entregadores ativos</p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <i className="fa-solid fa-star text-blue-700 text-6xl mb-4"></i>
              <h3 className="text-4xl font-extrabold text-gray-800">4.9/5</h3>
              <p className="text-gray-600 mt-2 text-lg">
                Avaliação dos usuários
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <i className="fa-solid fa-map text-blue-700 text-6xl mb-4"></i>
              <h3 className="text-4xl font-extrabold text-gray-800">10+</h3>
              <p className="text-gray-600 mt-2 text-lg">Províncias atendidas</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* POR QUE ESCOLHER */}
      <section id="porque-escolher" className="py-24 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Por que escolher o TRAGA Rápido?
          </h2>

          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            A plataforma de entregas mais rápida e confiável do país
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-bolt text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Mais Rápido da Cidade
              </h3>
              <p className="text-gray-600 mt-3">
                Encontramos o entregador mais próximo em segundos, garantindo
                velocidade.
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-handshake text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Preço Flexível
              </h3>
              <p className="text-gray-600 mt-3">
                Você negocia diretamente com o entregador e escolhe a melhor
                oferta.
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-thumbs-up text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Simples e Intuitivo
              </h3>
              <p className="text-gray-600 mt-3">
                Interface pensada para ser prática mesmo para usuários
                iniciantes.
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-route text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Rota em Tempo Real
              </h3>
              <p className="text-gray-600 mt-3">
                Acompanhe o percurso do início ao fim com total transparência.
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-users text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Grande Comunidade
              </h3>
              <p className="text-gray-600 mt-3">
                Milhares de usuários e entregadores confiando diariamente na
                plataforma.
              </p>
            </motion.div>

            {/* ITEM */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition"
            >
              <i className="fa-solid fa-headset text-blue-700 text-5xl mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-800">
                Suporte Real
              </h3>
              <p className="text-gray-600 mt-3">
                Atendimento humano sempre disponível para resolver qualquer
                situação.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Perguntas Frequentes
          </h2>
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            Dúvidas comuns sobre o TRAGA Rápido
          </p>

          <div className="mt-16 space-y-6 text-left max-w-4xl mx-auto">
            {/* FAQ Item 1 */}
            <motion.div
              variants={fadeUp}
              className="border-l-4 border-blue-700 pl-4"
            >
              <h3 className="font-semibold text-gray-800 text-lg">
                É seguro utilizar o TRAGA Rápido?
              </h3>
              <p className="text-gray-600 mt-1">
                Sim! Todos os entregadores são verificados e todas as transações
                são criptografadas.
              </p>
            </motion.div>

            {/* FAQ Item 2 */}
            <motion.div
              variants={fadeUp}
              className="border-l-4 border-blue-700 pl-4"
            >
              <h3 className="font-semibold text-gray-800 text-lg">
                Como funciona o pagamento?
              </h3>
              <p className="text-gray-600 mt-1">
                Você pode pagar via cartão, MBWay ou diretamente no app, de
                forma segura e transparente.
              </p>
            </motion.div>

            {/* FAQ Item 3 */}
            <motion.div
              variants={fadeUp}
              className="border-l-4 border-blue-700 pl-4"
            >
              <h3 className="font-semibold text-gray-800 text-lg">
                Como me tornar entregador?
              </h3>
              <p className="text-gray-600 mt-1">
                Basta cadastrar-se no app, enviar seus documentos e começar a
                receber pedidos próximos.
              </p>
            </motion.div>

            {/* FAQ Item 4 */}
            <motion.div
              variants={fadeUp}
              className="border-l-4 border-blue-700 pl-4"
            >
              <h3 className="font-semibold text-gray-800 text-lg">
                Onde o TRAGA Rápido está disponível?
              </h3>
              <p className="text-gray-600 mt-1">
                Atendemos atualmente em várias províncias, com expansão
                constante para novas áreas.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* MAPA DE COBERTURA */}
      <section id="cobertura" className="py-24 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Áreas Atendidas
          </h2>
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            Estamos cada vez mais próximos de você
          </p>

          <motion.div
            variants={fadeUp}
            className="mt-16 w-full h-[400px] rounded-lg overflow-hidden shadow-lg"
          >
            {/* Mapa ilustrativo */}
            <iframe
              title="Mapa de Cobertura TRAGA Rápido"
              src="https://maps.google.com/maps?q=luanda&t=&z=10&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="border-0"
            ></iframe>
          </motion.div>
        </motion.div>
      </section>

      {/* VÍDEO DE APRESENTAÇÃO */}
      <section id="video" className="py-24 bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Conheça o TRAGA Rápido
          </h2>
          <p className="text-blue-700 mt-2 text-lg md:text-xl">
            Veja como é simples e rápido utilizar nosso aplicativo
          </p>

          <motion.div variants={fadeUp} className="mt-16 flex justify-center">
            <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/yQcNOnNs6X4?si=dNxHRKDFRob13YHp"
                title="Vídeo de Apresentação TRAGA Rápido"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
