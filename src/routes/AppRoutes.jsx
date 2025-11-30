import { Routes, Route } from "react-router-dom";
//Site
import Home from "../pages/site/Home";
import NotFound from "../pages/site/NotFound";

//Autenticação
import Login from "../pages/auth/Login";
import CadastrarSe from "../pages/auth/CadastrarSe";
import CadastrarSolicitante from "../pages/auth/CadastrarSolicitante";
import CadastrarEntregador from "../pages/auth/CadastrarEntregador";
import EsqueceuSenha from "../pages/auth/EsqueceuSenha";
import RedefinirSenha from "../pages/auth/RedefinirSenha";
import VerifiqueEmail from "../pages/auth/VerifiqueEmail";

//Solicitante
import DashboardSolicitante from "../pages/solicitante/Dashboard"
import MeusPedidos from "../pages/solicitante/MeusPedidos"
import CriarNovoPedido from "../pages/solicitante/CriarNovoPedido"
import EditarPedido from "../pages/solicitante/EditarPedido"
import DetalhesDoPedido from "../pages/solicitante/DetalhesDoPedido"
import HistoricoPedidos from "../pages/solicitante/Historico"
import Configuracoes from "../pages/solicitante/Configuracoes"
import NotificacoesSolicitante from "../pages/solicitante/Notificacoes"
import NotFoundSolicitante from "../pages/solicitante/NotFoundSolicitante"

//Entregador
import DashboardEntregador from "../pages/entregador/Dashboard"

export default function AppRoutes () {
    return (
        <Routes>
            {/*Rotas do site */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />

            {/*Rotas de login */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/criar-conta" element={<CadastrarSe />} />
            <Route path="/auth/cadastrar-solicitante" element={<CadastrarSolicitante />} />
            <Route path="/auth/cadastrar-entregador" element={<CadastrarEntregador />} />
            <Route path="/auth/esqueceu-senha" element={<EsqueceuSenha />} />
            <Route path="/auth/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/auth/verifique-email" element={<VerifiqueEmail />} />

            {/*Rotas do solicintante */}
            <Route path="/dashboard/solicitante/">
                <Route path="" element={<DashboardSolicitante />} />
                <Route path="pedidos" element={<MeusPedidos />} />
                <Route path="novo-pedido" element={<CriarNovoPedido />} />
                <Route path="editar-pedido" element={<EditarPedido />} />
                <Route path="detalhes-pedido" element={<DetalhesDoPedido />} />
                <Route path="historico" element={<HistoricoPedidos />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="notificacoes" element={<NotificacoesSolicitante />} />
                
                {/* ROTA NOT FOUND ESPECÍFICA PARA O SOLICITANTE */}
                <Route path="*" element={<NotFoundSolicitante />} />
            </Route>

            {/*Rotas do entregador */}
            <Route path="/dashboard/entregador/" element={<DashboardEntregador />} />
        </Routes>
    )
}