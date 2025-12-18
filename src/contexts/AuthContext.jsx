import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Cria o contexto global de autenticação
export const AuthContext = createContext(null);

// Hook personalizado para consumir o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Provider que envolve a aplicação e fornece estado de autenticação
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Estado do token e do usuário logado
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Ao carregar a aplicação, tenta recuperar os dados do usuário do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("userId");

    if (storedToken && tipoUsuario) {
      setToken(storedToken);
      setUser({
        id: id ? Number(id) : null,  // converte o id para número
        tipo: tipoUsuario,
        username,
        email,
      });
    }
  }, []);

  // Função para fazer login e salvar dados no estado e localStorage
  function login(data) {
    const { access, refresh, tipo, username, email, id } = data;

    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("tipoUsuario", tipo);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", id);

    setToken(access);
    setUser({ id, tipo, username, email });

    // Redireciona para o dashboard correto
    if (tipo === "SOLICITANTE") {
      navigate("/dashboard/solicitante", { replace: true });
    } else if (tipo === "ENTREGADOR") {
      navigate("/dashboard/entregador", { replace: true });
    }
  }

  // Função para logout: limpa estado, localStorage e redireciona para login
  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/auth/login", { replace: true });
  }

  // Provedor que disponibiliza os dados e funções para toda a aplicação
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token, // true se token existir
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
