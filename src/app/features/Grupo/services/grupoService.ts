import { api } from '../../../../lib/axios';

// ============================================================================
// TIPOS
// ============================================================================

export interface Grupo {
    id_grupo: number;
    nombre: string;
    descripcion: string | null;
    capacidad_maxima: number;
    cupos: number;
    activo: boolean;
    creado_por: number | null;
    fecha_creacion: string;
    fecha_modificacion: string | null;
}

// Interfaz para Crear/Editar (usan strings para inputs)
export interface GrupoForm {
    nombre: string;
    descripcion: string | null;
    capacidad_maxima: number | string;
    cupos: number | string;
    creado_por?: number | string | null;
    activo?: boolean;
}

// ============================================================================
// API SERVICE
// ============================================================================

export const GrupoService = {

    /**
    * GET /grupos
    */
    listar: async (params: { incluir_inactivos?: number } = {}) => {
        try {
            const response = await api.get('/grupos', { params });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || 'Error al obtener grupos',
            };
        }
    },

    /**
    * POST /grupos
    */
    crear: async (data: GrupoForm) => {
        try {
            const response = await api.post('/grupos', {
                ...data,
                capacidad_maxima: Number(data.capacidad_maxima),
                cupos: Number(data.cupos),
                descripcion: data.descripcion || null,
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear grupo',
            };
        }
    },

    /**
    * PUT /grupos/{id}
    */
    actualizar: async (id: number, data: GrupoForm) => {
        try {
            const response = await api.put(`/grupos/${id}`, {
                ...data,
                capacidad_maxima: Number(data.capacidad_maxima),
                cupos: Number(data.cupos),
                descripcion: data.descripcion || null,
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar grupo',
            };
        }
    },

    /**
    * DELETE /grupos/{id} (Desactivar)
    */
    eliminar: async (id: number) => {
        try {
            const response = await api.delete(`/grupos/${id}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al desactivar grupo',
            };
        }
    },

    reactivar: async (id: number) => {
        try {
            const response = await api.post(`/grupos/${id}/reactivar`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al reactivar grupo',
            };
        }
    },

    /**
    * GET /grupos/select
    */
    paraSelect: async () => {
        try {
            const response = await api.get('/grupos/select');
            return response.data;
        } catch {
            return { success: false, data: [] };
        }
    }
};