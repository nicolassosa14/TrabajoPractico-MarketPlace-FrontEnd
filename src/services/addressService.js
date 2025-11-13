import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const addressService = {
  crearAddress: async (direccionTexto, userId) => {
    try {
      const payload = { address: direccionTexto, userId };
      const res = await axios.post(`${API_BASE_URL}/addresses`, payload);
      return res.data; // esperamos { id: '...', ... } o similar
    } catch (err) {
      console.warn('No se pudo crear address via API', err);
      throw err;
    }
  }
};

export default addressService;
