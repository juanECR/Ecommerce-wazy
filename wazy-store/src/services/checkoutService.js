import { apiClient } from './api';

export const submitOrder = async (orderPayload) => {
  // Hacemos el POST al endpoint /ventas
  const response = await apiClient.post('/ventas', orderPayload);
  return response.data;
};