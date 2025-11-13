
import { api } from "../../../../lib/axios";

const API_URL = '/asignaciones-docente';

export const asignacionDocenteService = {
  /**
   * Listar todas las asignaciones
   * Llama a GET /api/asignaciones-docente
   */
  async listar() {
    const response = await api.get(API_URL);
    return response.data;
  },

  /**
   * Alias opcional (compatibilidad con otros módulos)
   */
  async getAll() {
    return await this.listar();
  },

  /**
   * Crear nueva asignación docente
   * Llama a POST /api/asignaciones-docente
   */
  async crearAsignacion(data: { id_docente: number; id_materia_grupo: number; hrs_asignadas: number }) {
    const response = await api.post(API_URL, data);
    return response.data;
  },
};