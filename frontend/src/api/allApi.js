import axios from 'axios';

// ==================== AXIOS SETUP ====================
const API = axios.create({
  baseURL: 'https://hissab-4ggc.onrender.com', // Check karein iske aage /api toh nahi laga?
  headers: {
    'Content-Type': 'application/json'
  } 
});

// Request Interceptor: Token automatically har request ke header mein jayega
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 (Unauthorized) error par auto-logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH FUNCTIONS ====================

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// 🚀 LIVE: Verification bypass hai abhi, baad mein use hoga
// export const verifyUserEmail = async (token) => {
//   // Humne ?token=${token} ka use kiya hai kyunki EmailVerification.jsx yahi expect kar raha hai
//   const response = await API.get(`/auth/verify-email?token=${token}`);
//   return response.data;
// };

export const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ==================== EXPENSE FUNCTIONS (WITH AMOUNT) ====================

export const getAllExpenses = async () => {
  const response = await API.get('/expenses');
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await API.post('/expenses', expenseData);
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

export const addProduct = async (expenseId, productData) => {
  const response = await API.post(`/expenses/${expenseId}/products`, productData);
  return response.data;
};

export const deleteProduct = async (expenseId, productId) => {
  const response = await API.delete(`/expenses/${expenseId}/products/${productId}`);
  return response.data;
};

// ==================== WITHOUT AMOUNT FUNCTIONS ====================

export const getAllWithoutAmountExpenses = async () => {
  const response = await API.get('/withoutAmount');
  return response.data;
};

export const createWithoutAmountExpense = async (expenseData) => {
  const response = await API.post('/withoutAmount/create', expenseData);
  return response.data;
};

export const getWithoutAmountExpenseById = async (id) => {
  const response = await API.get(`/withoutAmount/${id}`);
  return response.data;
};

export const deleteWithoutAmountExpense = async (id) => {
  const response = await API.delete(`/withoutAmount/${id}`);
  return response.data;
};

export const addProductToWithoutAmount = async (expenseId, productData) => {
  const response = await API.post(`/withoutAmount/${expenseId}/products`, productData);
  return response.data;
};

export const deleteProductFromWithoutAmount = async (expenseId, productId) => {
  const response = await API.delete(`/withoutAmount/${expenseId}/products/${productId}`);
  return response.data;
};

// ==================== UTILITY FUNCTIONS ====================

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!(token && token !== 'undefined' && token !== 'null');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.log(error)
    return null;
  }
};