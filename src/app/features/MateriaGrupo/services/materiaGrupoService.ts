import { api } from '../../../../lib/axios';
import { type Materia } from '../../Materia/services/materiaService';
import { type Grupo } from '../../Grupo/services/grupoService';

// ============================================================================
// TIPOS
// ============================================================================

export interface MateriaGrupo {
    id_materia_grupo: number;
    id_materia: number;
    id_grupo: number;
    id_gestion: number;
    observacion: string | null;
    activo: boolean;
    fecha_creacion: string;
    fecha_modificacion: string | null;
    materia: Materia;
    grupo: Grupo;
    docente_asignado?: string | null; // Nombre completo del docente si está asignado
}

export interface MateriaGrupoForm {
    id_materia: string | number;
    id_grupo: string | number;
    observacion: string | null;
}

export interface MateriaGrupoSelect {
    value: number;
    label: string;
}

// ============================================================================
// API SERVICE
// ============================================================================

export const MateriaGrupoService = {

    /**
     * GET /materia-grupos
     * Listar todos los materia-grupos
     */
    listar: async (params: { incluir_inactivos?: boolean } = {}): Promise<{ success: boolean; data: MateriaGrupo[]; message?: string }> => {
        try {
            const response = await api.get('/materia-grupos', { params });
            return response.data;
        } catch (error: any) {
            return { success: false, data: [], message: error.response?.data?.message || 'Error al obtener materia-grupos' };
        }
    },

    /**
     * POST /materia-grupos
     * Crear nuevo materia-grupo
     */
    crear: async (data: MateriaGrupoForm): Promise<{ success: boolean; data?: MateriaGrupo; message: string }> => {
        try {
            const dataToSend = {
                id_materia: Number(data.id_materia),
                id_grupo: Number(data.id_grupo),
                observacion: data.observacion || null,
            };

            console.log('📤 Datos a enviar al backend:', dataToSend);
            const response = await api.post('/materia-grupos', dataToSend);
            console.log('✅ Respuesta del backend:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error completo:', error);
            console.error('📋 Detalles del error:', error.response?.data);
            
            if (error.response?.status === 422) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                return { success: false, message: errorMessages };
            }
            if (error.response?.status === 500) {
                return { 
                    success: false, 
                    message: `Error 500: ${error.response?.data?.message || 'Error interno del servidor'}. Revisa los logs del backend Laravel.` 
                };
            }
            return { success: false, message: error.response?.data?.message || 'Error al crear materia-grupo' };
        }
    },

    /**
     * GET /materia-grupos/{id}
     * Ver detalle de un materia-grupo
     */
    obtener: async (id: number): Promise<{ success: boolean; data?: MateriaGrupo; message?: string }> => {
        try {
            const response = await api.get(`/materia-grupos/${id}`);
            return response.data;
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Error al obtener materia-grupo' };
        }
    },

    /**
     * PUT /materia-grupos/{id}
     * Actualizar materia-grupo
     */
    actualizar: async (id: number, data: MateriaGrupoForm): Promise<{ success: boolean; data?: MateriaGrupo; message: string }> => {
        try {
            const dataToSend = {
                id_materia: Number(data.id_materia),
                id_grupo: Number(data.id_grupo),
                observacion: data.observacion || null,
            };

            const response = await api.put(`/materia-grupos/${id}`, dataToSend);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                return { success: false, message: errorMessages };
            }
            return { success: false, message: error.response?.data?.message || 'Error al actualizar materia-grupo' };
        }
    },

    /**
     * DELETE /materia-grupos/{id}
     * Desactivar materia-grupo
     */
    eliminar: async (id: number): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await api.delete(`/materia-grupos/${id}`);
            return response.data;
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Error al desactivar materia-grupo' };
        }
    },

    /**
     * POST /materia-grupos/{id}/reactivar
     * Reactivar materia-grupo
     */
    reactivar: async (id: number): Promise<{ success: boolean; data?: MateriaGrupo; message: string }> => {
        try {
            const response = await api.post(`/materia-grupos/${id}/reactivar`);
            return response.data;
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Error al reactivar materia-grupo' };
        }
    },

    /**
     * GET /materia-grupos/select
     * Obtener materia-grupos disponibles (sin docente asignado) para dropdown
     */
    paraSelect: async (): Promise<{ success: boolean; data: MateriaGrupoSelect[] }> => {
        try {
            const response = await api.get('/materia-grupos/select');
            return response.data;
        } catch (error: any) {
            return { success: false, data: [] };
        }
    }
};
