import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
const BASE_URL = "http://127.0.0.1:8000";
export const getBooks = (search = "", page = 1, limit = 8, category = "") => {
  const skip = (page - 1) * limit;
  // Đảm bảo truyền đúng category vào query
  const params = new URLSearchParams({
    search: search || "",
    category: category || "",
    skip: skip,
    limit: limit
  });
  return axios.get(`${BASE_URL}/books/?${params.toString()}`);
};

export const createBook = (bookData) => {
  return api.post('/books/', bookData);
};

export const deleteBook = (id) => {
  return api.delete(`/books/${id}`);
};

export const updateBook = (id, bookData) => {
  return api.put(`/books/${id}`, bookData);
};


export default api;