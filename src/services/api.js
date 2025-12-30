import axios from "axios";

export const api = axios.create({
  baseURL: "https://traga-rapido.fimbatec.com/api",
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR (401)
================================ */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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

      const refresh = localStorage.getItem("refreshToken");

      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "https://traga-rapido.fimbatec.com/api/auth/token/refresh/",
          { refresh }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("token", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        scheduleTokenRefresh(newAccessToken);
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ===============================
   JWT HELPERS
================================ */

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

let refreshTimeout = null;

function scheduleTokenRefresh(accessToken) {
  const decoded = parseJwt(accessToken);
  if (!decoded?.exp) return;

  const expiresAt = decoded.exp * 1000;
  const now = Date.now();
  const refreshTime = expiresAt - now - 60 * 1000;

  if (refreshTime <= 0) return;

  if (refreshTimeout) clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(refreshToken, refreshTime);
}

async function refreshToken() {
  const refresh = localStorage.getItem("refreshToken");

  if (!refresh) {
    logout();
    return;
  }

  try {
    const response = await axios.post(
      "https://traga-rapido.fimbatec.com/api/auth/token/refresh/",
      { refresh }
    );

    const newAccessToken = response.data.access;

    localStorage.setItem("token", newAccessToken);
    api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

    scheduleTokenRefresh(newAccessToken);
  } catch {
    logout();
  }
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.replace("/auth/login");
}
