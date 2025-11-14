import { api } from "../../../lib/axios";

export const asistenciaService = {

  /**
   * Registrar asistencia por botón (GPS)
   */
  registrarAsistenciaBoton: async (
    id_horario_clase: number,
    coordenadas: { latitud: number; longitud: number }
  ) => {
    try {
      const res = await api.post("/asistencia/registrar", {
        id_horario_clase,
        coordenadas,
      });
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Registrar asistencia por QR (GPS + Aula Escaneada)
   */
  registrarAsistenciaQR: async (
    id_horario_clase: number,
    id_aula_escaneada: number,
    coordenadas: { latitud: number; longitud: number }
  ) => {
    try {
      const res = await api.post("/asistencia/registrar-qr", {
        id_horario_clase,
        id_aula_escaneada,
        coordenadas,
      });
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /**
   * Enviar justificación de ausencia (Archivo opcional)
   */
  justificarAusencia: async (
    id_asistencia: number,
    motivo: string,
    archivo?: File
  ) => {
    const formData = new FormData();
    formData.append("motivo", motivo);
    if (archivo) formData.append("documento", archivo);

    try {
      const res = await api.post(`/asistencia/${id_asistencia}/justificar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
