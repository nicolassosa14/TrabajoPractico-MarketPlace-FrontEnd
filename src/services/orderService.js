import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

const orderService = {
  crearOrden: async (pedido) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, pedido);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  obtenerOrdenes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }
};

export default orderService;
