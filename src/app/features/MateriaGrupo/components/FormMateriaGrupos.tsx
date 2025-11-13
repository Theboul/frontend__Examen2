import { useState, useEffect } from "react";
import { MateriaGrupoService, type MateriaGrupoForm, type MateriaGrupo } from "../services/materiaGrupoService";
import { MateriaService } from "../../Materia/services/materiaService";
import { GrupoService } from "../../Grupo/services/grupoService";

const inputClass = "w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition";

interface Props {
  materiaGrupo?: MateriaGrupo | null;
  onSuccess: () => void;
}

export default function FormMateriaGrupos({ materiaGrupo = null, onSuccess }: Props) {
  const isEditing = !!materiaGrupo;

  const initialState: MateriaGrupoForm = {
    id_materia: materiaGrupo?.id_materia?.toString() ?? "",
    id_grupo: materiaGrupo?.id_grupo?.toString() ?? "",
    observacion: materiaGrupo?.observacion || "",
  };

  const [form, setForm] = useState<MateriaGrupoForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados para los dropdowns
  const [materias, setMaterias] = useState<Array<{ value: number; label: string }>>([]);
  const [grupos, setGrupos] = useState<Array<{ value: number; label: string }>>([]);

  useEffect(() => {
    setForm(initialState);
  }, [materiaGrupo]);

  useEffect(() => {
    cargarMaterias();
    cargarGrupos();
  }, []);

  const cargarMaterias = async () => {
    try {
      // Intentar primero con paraSelect
      let response = await MateriaService.paraSelect();
      
      // Si falla con 403, intentar con listar
      if (!response.success) {
        console.warn("⚠️ paraSelect falló (posible 403), intentando con listar...");
        const listResponse = await MateriaService.listar(false);
        if (listResponse.success && listResponse.data) {
          // Mapear materias a formato select
          const materiasFormateadas = listResponse.data.map((m: any) => ({
            value: m.id_materia,
            label: `[${m.sigla || 'SIN-SIGLA'}] ${m.nombre}`
          }));
          setMaterias(materiasFormateadas);
          return;
        } else {
          // Ambos endpoints fallaron - problema de permisos
          console.error("❌ ERROR: No tienes permisos para acceder a materias (403 Forbidden)");
          setError("⛔ No tienes permisos para gestionar materia-grupos. Contacta al administrador del sistema para que configure los permisos de 'Coordinador' en las rutas de Materias y Grupos.");
          return;
        }
      }
      
      if (response.success && response.data) {
        setMaterias(response.data);
      }
    } catch (error: any) {
      console.error("Error al cargar materias:", error);
      setError("⛔ Error de permisos: Tu rol no tiene acceso a este módulo. Verifica con el administrador.");
    }
  };

  const cargarGrupos = async () => {
    try {
      // Intentar primero con paraSelect
      let response = await GrupoService.paraSelect();
      
      // Si falla, intentar con listar
      if (!response.success) {
        console.warn("paraSelect de grupos falló, intentando con listar...");
        const listResponse = await GrupoService.listar({});
        if (listResponse.success && listResponse.data) {
          // Mapear grupos a formato select
          const gruposFormateados = listResponse.data.map((g: any) => ({
            value: g.id_grupo,
            label: g.nombre
          }));
          setGrupos(gruposFormateados);
          return;
        }
      }
      
      if (response.success && response.data) {
        // Mapear los grupos al formato correcto
        const gruposFormateados = response.data.map((g: any) => ({
          value: g.id_grupo,
          label: g.nombre
        }));
        setGrupos(gruposFormateados);
      } else {
        console.error("Error al cargar grupos");
        setError("No se pudieron cargar los grupos. Verifica que existan grupos activos.");
      }
    } catch (error: any) {
      console.error("Error al cargar grupos:", error);
      setError("Error de conexión al cargar grupos.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validación de campos
    if (!form.id_materia || !form.id_grupo) {
      setError("⚠️ Debes seleccionar una Materia y un Grupo");
      return;
    }

    console.log('📝 Datos del formulario:', form);
    setLoading(true);

    try {
      const res = isEditing
        ? await MateriaGrupoService.actualizar(materiaGrupo.id_materia_grupo, form)
        : await MateriaGrupoService.crear(form);

      if (res.success) {
        setSuccess(res.message);
        setForm({ id_materia: "", id_grupo: "", observacion: "" });
        setTimeout(() => {
          onSuccess();
          setSuccess("");
        }, 1500);
      } else {
        setError(res.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el materia-grupo`);
      }
    } catch (err: any) {
      console.error('❌ Error en handleSubmit:', err);
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {!isEditing && (<h2 className="text-2xl font-bold text-[#2A3964] mb-6 text-center">Crear Materia-Grupo</h2>)}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✅ {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Materia */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Materia <span className="text-red-500">*</span>
          </label>
          <select
            name="id_materia"
            value={form.id_materia}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Seleccione una materia</option>
            {materias.map((materia) => (
              <option key={materia.value} value={materia.value}>
                {materia.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grupo */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Grupo <span className="text-red-500">*</span>
          </label>
          <select
            name="id_grupo"
            value={form.id_grupo}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Seleccione un grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.value} value={grupo.value}>
                {grupo.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observación */}
      <div className="mt-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Observación (Opcional)
        </label>
        <textarea
          name="observacion"
          value={form.observacion || ""}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Ingrese alguna observación adicional..."
          className={inputClass}
        />
      </div>

      {/* Botón Submit */}
      <div className="mt-6 flex justify-end gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={() => onSuccess()}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#880000] text-white rounded-lg hover:bg-[#b30000] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear Materia-Grupo"}
        </button>
      </div>
    </form>
  );
}
