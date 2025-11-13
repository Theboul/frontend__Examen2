import axios from "../../../../lib/axios";

export interface ResultadoCarga {
  total_procesados: number;
  exitosos: number;
  fallidos: number;
  archivo: string;
  usuarios_creados: any[];
  errores: {
    fila: number;
    datos: { nombres: string; apellidos: string; email: string; ci: string };
    error: string;
  }[];
}

export const cargaMasivaService = {
  async cargarArchivo(archivo: File) {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const response = await axios.post("/usuarios/carga-masiva", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 180000, // 3 minutos
    });

    return response.data;
  },
};
