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
            <Route path="/dashboard/solicitante/" element={<DashboardSolicitante />} />

            {/*Rotas do entregador */}
            <Route path="/dashboard/entregador/" element={<DashboardEntregador />} />
        </Routes>
    )
}