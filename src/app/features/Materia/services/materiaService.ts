import { api } from '../../../../lib/axios';

// Definición básica para Semestre
export interface Semestre {
    id_semestre: number;
    nombre: string;
}

// ============================================================================
// TIPOS (Interfaces)
// ============================================================================

export interface Materia {
    id_materia: number;
    id_semestre: number;
    id_carrera: number;
    nombre: string;
    sigla: string | null;
    creditos: number | null;
    carga_horaria_semestral: number | null;
    activo: boolean;
    carrera: { id_carrera: number; nombre: string; codigo: string };
    semestre: Semestre;
}

export interface MateriaForm {
    id_semestre: number;
    id_carrera: number;
    nombre: string;
    sigla: string;
    creditos: number | null;
    carga_horaria_semestral: number | null; 
    activo?: boolean;
}

// Interfaz para la respuesta de Select
export interface MateriaSelect {
    value: number;
    label: string;
}

// ============================================================================
// API SERVICE
// ============================================================================

export const MateriaService = {

    /**
     * GET /materias
     * Listar todas las materias
     */
    listar: async (incluirInactivas = false) => {
        try {
            const params = incluirInactivas ? { incluir_inactivas: true } : {};
            const response = await api.get(`/materias`, { params });
            
            // Verifica la estructura real del backend
            if (response.data.success) {
                return { 
                    success: true, 
                    data: response.data.data || response.data.materias || [],
                    message: response.data.message 
                };
            } else {
                return { 
                    success: false, 
                    data: [], 
                    message: response.data.message || 'Error en la respuesta del servidor'
                };
            }
        } catch (error: any) {
            console.error('Error en MateriaService.listar:', error);
            return { 
                success: false, 
                data: [], 
                message: error.response?.data?.message || 'Error de conexión al servidor' 
            };
        }
    },

    /**
     * POST /materias
     * Crear nueva materia
     */
    crear: async (data: MateriaForm): Promise<{ success: boolean; data?: Materia; message: string }> => {
        try {
            // Limpiamos y convertimos datos a números enteros para Laravel
            const dataToSend = {
                ...data,
                id_semestre: Number(data.id_semestre) || null,
                id_carrera: Number(data.id_carrera) || null,
                creditos: Number(data.creditos) || null,
                carga_horaria_semestral: Number(data.carga_horaria_semestral) || null,
            };

            const response = await api.post('/materias', dataToSend);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                return { success: false, message: errorMessages };
            }
            return { success: false, message: error.response?.data?.message || 'Error al crear materia' };
        }
    },

    /**
     * PUT /materias/{id}
     * Actualizar materia
     */
    actualizar: async (id: number, data: MateriaForm): Promise<{ success: boolean; data?: Materia; message: string }> => {
        try {
            // Limpiamos y convertimos datos a números enteros
            const dataToSend = {
                ...data,
                id_semestre: Number(data.id_semestre) || null,
                id_carrera: Number(data.id_carrera) || null,
                creditos: Number(data.creditos) || null,
                carga_horaria_semestral: Number(data.carga_horaria_semestral) || null,
            };

            const response = await api.put(`/materias/${id}`, dataToSend);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                return { success: false, message: errorMessages };
            }
            return { success: false, message: error.response?.data?.message || 'Error al actualizar materia' };
        }
    },

    /**
     * DELETE /materias/{id} (Desactivar)
     */
    eliminar: async (id: number): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.delete(`/materias/${id}`);
            return response.data;
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Error al desactivar materia' };
        }
    },

    /**
     * POST /materias/{id}/reactivar
     */
    reactivar: async (id: number): Promise<{ success: boolean; data?: Materia; message: string }> => {
        try {
            const response = await api.post(`/materias/${id}/reactivar`);
            return response.data;
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Error al reactivar materia' };
        }
    },

    /**
     * GET /materias/select
     */
    paraSelect: async (idCarrera?: number): Promise<{ success: boolean; data: MateriaSelect[]; message?: string }> => {
        try {
            const params = idCarrera ? { id_carrera: idCarrera } : {};
            const response = await api.get('/materias/select', { params });
            return response.data;
        } catch (error: any) {
            return { success: false, data: [], message: 'Error al obtener materias para select' };
        }
    }
};