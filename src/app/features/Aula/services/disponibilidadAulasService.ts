import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/aulas/disponibilidad`;

export const disponibilidadAulasService = {
  async consultarDisponibilidad(id_dia: number, id_bloque_horario: number) {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: { id_dia, id_bloque_horario },
    });
    return response.data;
  },
};
