import axios from "axios";

export const API_BASE = import.meta.env.VITE_BACKEND_URL;
const BASE_URL_LOGIN= `${API_BASE}/api/auth`;
const BASE_URL_products = `${API_BASE}/api/products`;
const BASE_URL_CHATBOT = `${API_BASE}/api`;
const ORDER_BASE = `${BASE_URL_CHATBOT}/orders`;
// Auth APIs
export const loginUser = (data) => axios.post(`${BASE_URL_LOGIN}/login`, data);
export const sendOtp = (data) => axios.post(`${BASE_URL_LOGIN}/send-otp`, data);
export const verifyOtp = (data) => axios.post(`${BASE_URL_LOGIN}/verify-otp`, data);
export const resetPassword = (data) => axios.post(`${BASE_URL_LOGIN}/reset-password`, data);
// Product APIs
export const getProducts = (params) => axios.get(BASE_URL_products, { params });
export const getFilterOptions = () => axios.get(`${BASE_URL_products}/filters`);
export const getProductBySKU = (sku) => axios.get(`${BASE_URL_products}/sku/${sku}`);
export const getInventoryAnalytics = (sku) => axios.get(`${BASE_URL_products}/inventory/analytics/${sku}`);
export const updateProductBySKU = (sku, data) => axios.put(`${BASE_URL_products}/sku/${sku}`, data);

// Notifications
export const fetchNotifications = async (token) => {
  try {
    const res = await fetch(`${BASE_URL_products}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const deleteNotification = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL_products}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete notification");
    }

    return await res.json();
  } catch (err) {
    console.error("Delete notification error:", err);
    throw err;
  }
};

// Misplaced products check
export const checkMisplaced = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL_products}/misplaced-check`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { image: ..., results: [...] }
  } catch (err) {
    console.error("Misplaced check error:", err);
    throw err;
  }
};
export const askAI = (question, token) =>
  fetch( `${BASE_URL_CHATBOT}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ question })
  }).then(res => res.json());

export const getOrdersAPI = () => axios.get(`${BASE_URL_products}/orders`);
export const createOrderAPI = (data) => axios.post(`${BASE_URL_products}/orders`, data);

// Quality Check API
export const qualityCheckAPI = (formData) =>
    axios.post(`${BASE_URL_products}/quality-check`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

/* ================= PROFILE ================= */
/* ================= PROFILE ================= */

export const getProfileAPI = (token) =>
    axios.get(`${BASE_URL_LOGIN}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);

export const updateProfileImageAPI = (formData, token) =>
    axios.put(`${BASE_URL_LOGIN}/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(res => res.data);