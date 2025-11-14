import { api } from "../../../../lib/axios";

const API_URL = "/asignaciones-docente";

export const asignacionDocenteService = {
  getAll: async () => {
    try {
      const res = await api.get(API_URL);
      return res.data; // success, data
    } catch (error) {
      throw error;
    }
  },

  crearAsignacion: async (data: any) => {
    try {
      const res = await api.post(API_URL, data);
      return res.data; // success, message, data
    } catch (error: any) {
      throw error;
    }
  },
};
