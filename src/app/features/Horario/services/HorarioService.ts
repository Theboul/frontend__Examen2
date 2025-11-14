import axios from "../../../../lib/axios"; // axios con token incluido

export const horarioService = {
  /**
   * Listar todos los horarios (opcional: filtrar por gestión)
   */
  getAll: (params?: any) => axios.get("/horarios-clase", { params }),

  /**
   * Crear un horario manualmente (CU6)
   */
  create: (data: any) => axios.post("/horarios-clase", data),

  /**
   * Actualizar un horario existente
   */
  update: (id: number, data: any) =>
    axios.put(`/horarios-clase/${id}`, data),

  /**
   * Eliminar (cancelar) un horario
   */
  delete: (id: number) =>
    axios.delete(`/horarios-clase/${id}`),

  /**
   * Reactivar un horario previamente desactivado
   */
  reactivar: (id: number) =>
    axios.post(`/horarios-clase/${id}/reactivar`),

  /**
   * Generar horarios automáticamente (CU7)
   */
  generarAutomatico: (data: any) =>
    axios.post(`/horarios-clase/generar-automatico`, data),

  /**
   * Obtener catálogos de apoyo (días, bloques, tipos de clase)
   * TODAS ESTAS RUTAS REQUERÍAN TOKEN → ahora SI lo enviamos
   */
  getDias: () => axios.get(`/dias/select`),
  getBloques: () => axios.get(`/bloques-horario/select`),
  getTiposClase: () => axios.get(`/tipos-clase/select`),
};
