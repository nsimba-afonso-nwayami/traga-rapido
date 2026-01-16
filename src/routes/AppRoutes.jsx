import { Routes, Route } from "react-router-dom";
import RolePrivateRoute from "./RolePrivateRoute"; // novo

// Site
import Home from "../pages/site/Home";
import NotFound from "../pages/site/NotFound";

// Auth
import Login from "../pages/auth/Login";
import CadastrarSe from "../pages/auth/CadastrarSe";
import CadastrarSolicitante from "../pages/auth/CadastrarSolicitante";
import CadastrarEntregador from "../pages/auth/CadastrarEntregador";
import EsqueceuSenha from "../pages/auth/EsqueceuSenha";
import RedefinirSenha from "../pages/auth/RedefinirSenha";
import VerifiqueEmail from "../pages/auth/VerifiqueEmail";

// Solicitante
import DashboardSolicitante from "../pages/solicitante/Dashboard";
import MensagensSolicitante from "../pages/solicitante/MensagensSolicitante";
import ChatSolicitante from "../pages/solicitante/ChatSolicitante";
import MeusPedidos from "../pages/solicitante/MeusPedidos";
import CriarNovoPedido from "../pages/solicitante/CriarNovoPedido";
import EditarPedido from "../pages/solicitante/EditarPedido";
import DetalhesDoPedido from "../pages/solicitante/DetalhesDoPedido";
import HistoricoPedidos from "../pages/solicitante/Historico";
import Configuracoes from "../pages/solicitante/Configuracoes";
import NotificacoesSolicitante from "../pages/solicitante/NotificacoesSolicitante";
import NotFoundSolicitante from "../pages/solicitante/NotFoundSolicitante";

// Entregador
import DashboardEntregador from "../pages/entregador/Dashboard";
import ListaDePedidos from "../pages/entregador/ListaDePedidos";
import HistoricoEntregador from "../pages/entregador/HistoricoEntregador";
import NotificacoesEntregador from "../pages/entregador/NotificacoesEntregador";
import ConfiguracoesEntregador from "../pages/entregador/ConfiguracoesEntregador";
import NotFoundEntregador from "../pages/entregador/NotFoundEntregador";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Site */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />

      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/criar-conta" element={<CadastrarSe />} />
      <Route path="/auth/cadastrar-solicitante" element={<CadastrarSolicitante />} />
      <Route path="/auth/cadastrar-entregador" element={<CadastrarEntregador />} />
      <Route path="/auth/esqueceu-senha" element={<EsqueceuSenha />} />
      <Route path="/auth/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/auth/verifique-email" element={<VerifiqueEmail />} />

      {/* ROTAS PROTEGIDAS POR TIPO DE USUÁRIO */}
      
      {/* Solicitante */}
      <Route element={<RolePrivateRoute allowedRoles={["SOLICITANTE"]} />}>
        <Route path="/dashboard/solicitante">
          <Route index element={<DashboardSolicitante />} />
          <Route path="mensagens" element={<MensagensSolicitante />} />
          <Route path="mensagens/chat/" element={<ChatSolicitante />} />
          <Route path="pedidos" element={<MeusPedidos />} />
          <Route path="novo-pedido" element={<CriarNovoPedido />} />
          <Route path="editar-pedido" element={<EditarPedido />} />
          <Route path="detalhes-pedido/:id" element={<DetalhesDoPedido />} />
          <Route path="historico" element={<HistoricoPedidos />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="notificacoes" element={<NotificacoesSolicitante />} />
          <Route path="*" element={<NotFoundSolicitante />} />
        </Route>
      </Route>

      {/* Entregador */}
      <Route element={<RolePrivateRoute allowedRoles={["ENTREGADOR"]} />}>
        <Route path="/dashboard/entregador">
          <Route index element={<DashboardEntregador />} />
          <Route path="lista-pedidos" element={<ListaDePedidos />} />
          <Route path="historico" element={<HistoricoEntregador />} />
          <Route path="notificacoes" element={<NotificacoesEntregador />} />
          <Route path="configuracoes" element={<ConfiguracoesEntregador />} />
          <Route path="*" element={<NotFoundEntregador />} />
        </Route>
      </Route>
    </Routes>
  );
}
