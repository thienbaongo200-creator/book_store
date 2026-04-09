import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Hàm lấy header admin từ localStorage
const getAuthHeaders = () => {
  const role = localStorage.getItem("role") || "admin"; 
  return { "x-user-role": role };
};

/* --- QUẢN LÝ DANH MỤC --- */
export const getCategories = () => api.get('/categories/');

export const createCategory = (name) => 
  api.post('/categories/', { name }, { headers: getAuthHeaders() });

export const deleteCategory = (id) => 
  api.delete(`/categories/${id}`, { headers: getAuthHeaders() });

/* --- QUẢN LÝ SÁCH --- */
export const getBooks = (search = "", page = 1, limit = 8, category = "") => {
  return api.get('/books/', {
    params: { search, page, limit, category }
  });
};

export const createBook = (formData) => api.post('/books/', formData, {
  headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" }
});

export const updateBook = (id, formData) => api.put(`/books/${id}`, formData, {
  headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" }
});

export const deleteBook = (id) => api.delete(`/books/${id}`, {
  headers: getAuthHeaders()
});

export default api;