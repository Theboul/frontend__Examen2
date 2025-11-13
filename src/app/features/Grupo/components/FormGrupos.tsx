import { useState, useEffect } from "react";
import { GrupoService, type Grupo, type GrupoForm } from "../../Grupo/services/grupoService";
import { api } from "../../../../lib/axios";

interface FormProps {
  grupo?: Grupo | null; // Opcional para edición
  onSuccess: () => void;
}

// Definimos el tipo para el dropdown de materias
interface OpcionMateria {
  value: number;
  label: string;
}

interface FormState {
  id_materia: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  cupos: string;
  capacidad_maxima: string;
}

export default function FormGrupo({ grupo = null, onSuccess }: FormProps) {

  const isEditing = !!grupo;

  const initialState: FormState = {
    id_materia: grupo?.id_materia?.toString() ?? "",
    nombre: grupo?.nombre || "",
    descripcion: grupo?.descripcion || "",
    activo: grupo?.activo ?? true,
    cupos: grupo?.cupos?.toString() ?? "0", // Default 0
    capacidad_maxima: grupo?.capacidad_maxima?.toString() ?? "",
  };

  const [form, setForm] = useState<FormState>(initialState);
  // 3. Nuevo estado para guardar las materias del dropdown
  const [materias, setMaterias] = useState<OpcionMateria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para errores

  useEffect(() => {
    setForm(initialState);
  }, [grupo]);

  // 4. NUEVO: useEffect para cargar las materias al montar
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        // Usamos la ruta de consulta que ya existe y es segura para Coordinadores
        const response = await api.get('/materias/select/consulta');
        if (response.data.success) {
          setMaterias(response.data.data);
        } else {
          throw new Error("No se pudieron cargar las materias");
        }
      } catch (err) {
        console.error("Error cargando materias:", err);
        setError("Error al cargar la lista de materias.");
      }
    };
    cargarMaterias();
  }, []); // El array vacío asegura que solo se ejecute una vez

  // Función de ayuda para campos opcionales que pueden ser null
  const parseNullable = (value: string): string | null => (value.trim() === '' ? null : value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Manejo especial para el checkbox 'activo'
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiar errores previos

    // 5. CORRECCIÓN: Validación de frontend
    if (Number(form.cupos) > Number(form.capacidad_maxima)) {
      setError("Los cupos no pueden ser mayores a la capacidad máxima.");
      setLoading(false);
      return;
    }

    // Preparación de datos para la API
    const dataToSend: GrupoForm = {
      id_materia: parseInt(form.id_materia) || 0,
      nombre: form.nombre,
      descripcion: parseNullable(form.descripcion),
      capacidad_maxima: parseInt(form.capacidad_maxima) || 0,
      cupos: parseInt(form.cupos) || 0,
      // 6. 'creado_por' eliminado. El backend (GrupoController)  lo maneja con auth().
      activo: form.activo,
    };

    try {
      let res;
      if (isEditing && grupo) {
        res = await GrupoService.actualizar(grupo.id_grupo, dataToSend);
      } else {
        res = await GrupoService.crear(dataToSend);
      }

      if (res.success) {
        alert(`✅ Grupo ${isEditing ? 'actualizado' : 'creado'} correctamente`);
        onSuccess();
        if (!isEditing) setForm(initialState);
      } else {
        // El servicio ya formatea los errores 422
        setError(res.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el grupo`);
      }
    } catch (err: any) {
      console.error(err);
      setError("❌ Error al conectar con el servidor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isEditing ? "p-0" : "bg-white shadow-xl rounded-2xl p-8 border-t-4 border-[#2A3964] w-full max-w-3xl mx-auto transition-transform hover:scale-[1.01]"}>

      {!isEditing && (<h2 className="text-2xl font-bold text-[#2A3964] mb-6 text-center">Crear Grupo</h2>)}
      
      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="flex flex-col">
          <label htmlFor="id_materia" className="text-sm font-semibold text-gray-700 mb-1">Materia</label>
          <select
            id="id_materia"
            name="id_materia"
            value={form.id_materia}
            onChange={handleChange}
            required
            disabled={loading || materias.length === 0}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          >
            <option value="">{materias.length > 0 ? "Seleccione una materia" : "Cargando materias..."}</option>
            {materias.map((materia) => (
              <option key={materia.value} value={materia.value}>
                {materia.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre del Grupo */}
        <div className="flex flex-col">
          <label htmlFor="nombre" className="text-sm font-semibold text-gray-700 mb-1">Nombre del Grupo</label>
          <input id="nombre" name="nombre" type="text" placeholder="Ej: SA" value={form.nombre} onChange={handleChange} required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition" />
        </div>

        {/* Descripción */}
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="descripcion" className="text-sm font-semibold text-gray-700 mb-1">Descripción (Opcional)</label>
          <textarea id="descripcion" name="descripcion" placeholder="Breve descripción del grupo" value={form.descripcion} onChange={handleChange} rows={3}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition" />
        </div>

        {/* Cupos */}
        <div className="flex flex-col">
          <label htmlFor="cupos" className="text-sm font-semibold text-gray-700 mb-1">Cupos (Opcional)</label>
          <input id="cupos" name="cupos" type="number" min={0} placeholder="Ej: 0" value={form.cupos} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition" />
        </div>

        {/* Capacidad Máxima */}
        <div className="flex flex-col">
          <label htmlFor="capacidad_maxima" className="text-sm font-semibold text-gray-700 mb-1">Capacidad Máxima</label>
          <input id="capacidad_maxima" name="capacidad_maxima" type="number" min={1} placeholder="Ej: 80" value={form.capacidad_maxima} onChange={handleChange} required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition" />
        </div>
        
        {/* Activo (Visible/Editable solo en Edición) */}
        {isEditing && (
          <div className="flex items-center sm:col-span-2">
            <input id="activo" name="activo" type="checkbox" checked={form.activo} onChange={handleChange}
              className="w-5 h-5 text-[#2A3964] border-gray-300 rounded focus:ring-[#2A3964]" />
            <label htmlFor="activo" className="ml-2 text-sm text-gray-700">Grupo activo</label>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="mt-6 w-full bg-[#880000] hover:bg-[#a00000] text-white py-2.5 rounded-lg font-semibold tracking-wide transition disabled:opacity-60 shadow-md">
        {loading ? (isEditing ? "Actualizando..." : "Guardando...") : (isEditing ? "Actualizar Grupo" : "Guardar Grupo")}
      </button>
    </form>
  );
}