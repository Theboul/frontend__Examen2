import { useState, useEffect } from "react";
import { MateriaService, type MateriaForm, type Materia } from "../services/materiaService";
import { api } from "../../../../lib/axios"; 

interface FormProps {
  materia?: Materia | null;
  onSuccess: () => void;
}

// Tipos para los nuevos dropdowns
interface OpcionSelect {
  value: number;
  label: string;
}

interface FormState {
  id_semestre: string;
  id_carrera: string;
  nombre: string;
  sigla: string;
  creditos: string;
  carga_horaria_semestral: string;
  activo: boolean;
}

export default function FormMateria({ materia = null, onSuccess }: FormProps) {

  const isEditing = !!materia;

  const initialState: FormState = {
    id_semestre: materia?.id_semestre.toString() ?? "",
    id_carrera: materia?.id_carrera.toString() ?? "",
    nombre: materia?.nombre || "",
    sigla: materia?.sigla || "",
    creditos: materia?.creditos?.toString() ?? "",
    carga_horaria_semestral: materia?.carga_horaria_semestral?.toString() ?? "",
    activo: materia?.activo ?? true,
  };

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para errores

  // 3. Nuevos estados para los dropdowns
  const [carreras, setCarreras] = useState<OpcionSelect[]>([]);
  const [semestres, setSemestres] = useState<OpcionSelect[]>([]);

  useEffect(() => {
    setForm(initialState);
  }, [materia]);

  // useEffect para cargar Carreras y Semestres
  useEffect(() => {
    const cargarSelects = async () => {
      try {
        // Los admins usan la ruta /select, los coords usan /select/consulta
        // Asumimos que el admin también puede usar la de admin
        const [resCarreras, resSemestres] = await Promise.all([
          api.get('/carreras/select'),
          api.get('/semestres/select')
        ]);

        if (resCarreras.data.success) {
          setCarreras(resCarreras.data.data);
        }
        if (resSemestres.data.success) {
          setSemestres(resSemestres.data.data);
        }
      } catch (err) {
        console.error("Error cargando selects:", err);
        setError("Error al cargar carreras o semestres.");
      }
    };
    cargarSelects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parseNullableInt = (value: string): number | null => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    }

    const dataToSend: MateriaForm = {
      nombre: form.nombre,
      sigla: form.sigla,
      activo: form.activo,
      id_semestre: parseInt(form.id_semestre) || 0,
      id_carrera: parseInt(form.id_carrera) || 0,
      creditos: parseNullableInt(form.creditos),
      carga_horaria_semestral: parseNullableInt(form.carga_horaria_semestral),
    };

    try {
      const id = materia?.id_materia;
      let res;

      if (isEditing && id) {
        res = await MateriaService.actualizar(id, dataToSend);
      } else {
        res = await MateriaService.crear(dataToSend);
      }

      if (res.success) {
        alert(`✅ Materia ${isEditing ? 'actualizada' : 'creada'} correctamente`);
        onSuccess();
        if (!isEditing) setForm(initialState);
      } else {
        setError(res.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la materia`);
      }
    } catch (err: any) {
      console.error(err);
      setError("❌ Error al conectar con el servidor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={isEditing ? "p-0" : "bg-white shadow-xl rounded-2xl p-8 border-t-4 border-[#2A3964] w-full max-w-3xl mx-auto transition-transform hover:scale-[1.01]"}
    >

      {!isEditing && (<h2 className="text-2xl font-bold text-[#2A3964] mb-6 text-center">Crear Nueva Materia</h2>)}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:col-span-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="flex flex-col">
          <label htmlFor="nombre" className="text-sm font-semibold text-gray-700 mb-1">Nombre de la Materia</label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="sigla" className="text-sm font-semibold text-gray-700 mb-1">Sigla</label>
          <input
            type="text"
            name="sigla"
            id="sigla"
            value={form.sigla}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="id_carrera" className="text-sm font-semibold text-gray-700 mb-1">Carrera</label>
          <select
            id="id_carrera"
            name="id_carrera"
            value={form.id_carrera}
            onChange={handleChange}
            required
            disabled={loading || carreras.length === 0}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          >
            <option value="">{carreras.length > 0 ? "Seleccione una carrera" : "Cargando..."}</option>
            {carreras.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="id_semestre" className="text-sm font-semibold text-gray-700 mb-1">Semestre</label>
          <select
            id="id_semestre"
            name="id_semestre"
            value={form.id_semestre}
            onChange={handleChange}
            required
            disabled={loading || semestres.length === 0}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          >
            <option value="">{semestres.length > 0 ? "Seleccione un semestre" : "Cargando..."}</option>
            {semestres.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="creditos" className="text-sm font-semibold text-gray-700 mb-1">Créditos</label>
          <input
            type="number"
            name="creditos"
            id="creditos"
            value={form.creditos}
            onChange={handleChange}
            placeholder="Ej: 5"
            min={0}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="carga_horaria_semestral" className="text-sm font-semibold text-gray-700 mb-1">Carga Horaria</label>
          <input
            type="number"
            name="carga_horaria_semestral"
            id="carga_horaria_semestral"
            value={form.carga_horaria_semestral}
            onChange={handleChange}
            placeholder="Ej: 80"
            min={0}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A3964] focus:border-[#2A3964] transition"
          />
        </div>

        {isEditing && (
          <div className="flex items-center sm:col-span-2">
            <input id="activo" name="activo" type="checkbox" checked={form.activo} onChange={handleChange}
              className="w-5 h-5 text-[#2A3964] border-gray-300 rounded focus:ring-[#2A3964]" />
            <label htmlFor="activo" className="ml-2 text-sm text-gray-700">Materia activa</label>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-[#880000] hover:bg-[#a00000] text-white py-2.5 rounded-lg font-semibold tracking-wide transition disabled:opacity-60 shadow-md"
      >
        {loading ? (isEditing ? "Actualizando..." : "Guardando...") : (isEditing ? "Actualizar Materia" : "Guardar Materia")}
      </button>
    </form>
  );
}