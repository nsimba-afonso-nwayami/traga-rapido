import axios from "axios";

export const api = axios.create({
  baseURL: "https://traga-rapido.fimbatec.com/api",
});

/* ===============================
   INTERCEPTOR DE REQUEST
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ACCESS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   INTERCEPTOR DE RESPONSE
   (REFRESH TOKEN)
================================ */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 token expirado
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "https://traga-rapido.fimbatec.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;

        // 🔁 atualiza o token
        localStorage.setItem("token", newAccessToken);

        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ===============================
   LOGOUT GLOBAL
================================ */
function logout() {
  localStorage.clear();
  window.location.href = "/auth/login";
}
