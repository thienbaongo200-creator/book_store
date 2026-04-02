import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBooks = (search = "", page = 1, limit = 8) => {
  const skip = (page - 1) * limit;
  const url = search 
    ? `/books/?search=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`
    : `/books/?skip=${skip}&limit=${limit}`;
  return api.get(url);
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