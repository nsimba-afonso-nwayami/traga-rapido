import axios from "axios";

// Configurações centralizadas da API
const CONFIG = {
  BASE_URL: "https://traga-rapido.fimbatec.com/api",
  REFRESH_ENDPOINT: "/auth/token/refresh/",
  LOGIN_PATH: "/auth/login",
  REFRESH_BUFFER_MS: 60 * 1000, // Atualiza 1 minuto antes de expirar
};

// Chaves usadas no localStorage
const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
};

// Instância do axios com URL base configurada
export const api = axios.create({
  baseURL: CONFIG.BASE_URL,
});

/* ===============================
   GERENCIADOR DE TOKENS
   Centraliza toda lógica de autenticação
================================ */
class TokenManager {
  constructor() {
    this.refreshTimeout = null; // Timer para atualização automática
    this.isRefreshing = false; // Flag para evitar múltiplas atualizações simultâneas
    this.failedQueue = []; // Fila de requisições que falharam durante refresh
  }

  // Recupera o token de acesso do localStorage
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Recupera o refresh token do localStorage
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Salva o token de acesso no localStorage
  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  // Decodifica JWT para extrair informações (como expiração)
  parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  // Agenda atualização automática do token antes de expirar
  scheduleRefresh(accessToken) {
    const decoded = this.parseJwt(accessToken);
    if (!decoded?.exp) return;

    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const refreshTime = expiresAt - now - CONFIG.REFRESH_BUFFER_MS;

    // Se já expirou, atualiza imediatamente
    if (refreshTime <= 0) {
      this.refresh();
      return;
    }

    this.clearScheduledRefresh();
    this.refreshTimeout = setTimeout(() => this.refresh(), refreshTime);
  }

  // Cancela atualização agendada
  clearScheduledRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  // Atualiza o token de acesso usando o refresh token
  async refresh() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await axios.post(
        `${CONFIG.BASE_URL}${CONFIG.REFRESH_ENDPOINT}`,
        { refresh: refreshToken }
      );

      const newAccessToken = response.data.access;
      this.setToken(newAccessToken);
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      this.scheduleRefresh(newAccessToken);

      return newAccessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Processa fila de requisições pendentes após refresh
  processQueue(error = null, token = null) {
    this.failedQueue.forEach((promise) => {
      error ? promise.reject(error) : promise.resolve(token);
    });
    this.failedQueue = [];
  }

  // Adiciona requisição à fila durante refresh
  addToQueue() {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  // Remove tokens e redireciona para login
  logout() {
    this.clearScheduledRefresh();
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.location.replace(CONFIG.LOGIN_PATH);
  }
}

const tokenManager = new TokenManager();

/* ===============================
   INTERCEPTOR DE REQUISIÇÃO
   Adiciona token JWT em todas requisições
================================ */
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   INTERCEPTOR DE RESPOSTA
   Trata erros 401 e atualiza token automaticamente
================================ */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica se é erro 401 (não autorizado) e não é uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Se já está atualizando token, adiciona requisição à fila
      if (tokenManager.isRefreshing) {
        try {
          const newToken = await tokenManager.addToQueue();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Marca como retry para evitar loop infinito
      originalRequest._retry = true;
      tokenManager.isRefreshing = true;

      try {
        // Tenta atualizar o token
        const newAccessToken = await tokenManager.refresh();
        
        if (!newAccessToken) {
          return Promise.reject(error);
        }

        // Processa fila de requisições pendentes com novo token
        tokenManager.processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Tenta novamente a requisição original
        return api(originalRequest);
      } catch (err) {
        // Se falhar, rejeita todas requisições na fila
        tokenManager.processQueue(err, null);
        return Promise.reject(err);
      } finally {
        tokenManager.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ===============================
   API PÚBLICA
================================ */

// Inicializa atualização automática do token
export const initTokenRefresh = () => {
  const token = tokenManager.getToken();
  if (token) {
    tokenManager.scheduleRefresh(token);
  }
};

// Faz logout e limpa sessão
export const logout = () => {
  tokenManager.logout();
};

// Inicializa automaticamente ao carregar o módulo
initTokenRefresh();