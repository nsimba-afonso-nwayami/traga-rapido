import { Navigate, Outlet } from "react-router-dom";

export default function RolePrivateRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  // Se não estiver logado → redireciona para login
  if (!token) return <Navigate to="/auth/login" replace />;

  // Se o tipo de usuário não estiver permitido → redireciona para login
  if (!allowedRoles.includes(tipoUsuario)) return <Navigate to="/auth/login" replace />;

  // Usuário autorizado → renderiza as rotas filhas
  return <Outlet />;
}
