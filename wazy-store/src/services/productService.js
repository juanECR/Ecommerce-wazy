import { apiClient } from './api';

export const getProducts = async () => {
  const response = await apiClient.get('/productos');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/productos/${id}`);
  return response.data;
};