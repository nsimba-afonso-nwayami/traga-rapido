import { Routes, Route } from "react-router-dom";
import Home from "../site/Home";
import NotFound from "../site/NotFound";

import Login from "../auth/Login";
import CadastrarSe from "../auth/CadastrarSe";
import CadastrarSolicitante from "../auth/CadastrarSolicitante";
import CadastrarEntregador from "../auth/CadastrarEntregador";
import EsqueceuSenha from "../auth/EsqueceuSenha";
import RedefinirSenha from "../auth/RedefinirSenha";
import VerifiqueEmail from "../auth/VerifiqueEmail";

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
        </Routes>
    )
}