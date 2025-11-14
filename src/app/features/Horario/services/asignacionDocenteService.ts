import { api } from "../../../../lib/axios";

const API_URL = "/asignaciones-docente";

export const asignacionDocenteService = {

  // 🔹 NUEVO método para traer solo lo necesario para el select
  getSelect: async () => {
    try {
      const res = await api.get(`${API_URL}/select`);
      return res.data.data; // solo la lista
    } catch (error) {
      throw error;
    }
  },

  // 🔹 ESTO NO LO TOCAMOS
  getAll: async () => {
    try {
      const res = await api.get(API_URL);
      return res.data; // success, data
    } catch (error) {
      throw error;
    }
  },

  // 🔹 TAMPOCO TOCADO
  crearAsignacion: async (data: any) => {
    try {
      const res = await api.post(API_URL, data);
      return res.data; // success, message, data
    } catch (error: any) {
      throw error;
    }
  },
};
