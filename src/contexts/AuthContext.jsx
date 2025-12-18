import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

// 🔹 HOOK PERSONALIZADO
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("userId");

    if (storedToken && tipoUsuario) {
      setToken(storedToken);
      setUser({
        id: id ? Number(id) : null,
        tipo: tipoUsuario,
        username,
        email,
      });
    }
  }, []);

  function login(data) {
    const { access, refresh, tipo, username, email, id } = data;

    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("tipoUsuario", tipo);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", id);

    setToken(access);
    setUser({
      id,
      tipo,
      username,
      email,
    });

    if (tipo === "SOLICITANTE") {
      navigate("/dashboard/solicitante", { replace: true });
    } else if (tipo === "ENTREGADOR") {
      navigate("/dashboard/entregador", { replace: true });
    }
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/auth/login", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
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
