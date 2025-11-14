import { useState, useEffect } from "react";
import { GrupoService, type Grupo, type GrupoForm } from "../../Grupo/services/grupoService";

interface Props {
  grupo?: Grupo | null;
  onSuccess: () => void;
}

export default function FormGrupo({ grupo = null, onSuccess }: Props) {

  const isEditing = !!grupo;

  const initialState = {
    id_grupo: grupo?.id_grupo?.toString() ?? "",
    nombre: grupo?.nombre ?? "",
    descripcion: grupo?.descripcion ?? "",
    capacidad_maxima: grupo?.capacidad_maxima?.toString() ?? "",
    cupos: grupo?.cupos?.toString() ?? "",
    creado_por: grupo?.creado_por?.toString() ?? "",
    activo: grupo?.activo ?? true,
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initialState);
  }, [grupo]);

  const parseNullable = (v: string) =>
    v.trim() === "" ? null : v;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload: GrupoForm = {
      nombre: form.nombre,
      descripcion: parseNullable(form.descripcion),
      capacidad_maxima: Number(form.capacidad_maxima),
      cupos: Number(form.cupos),
      activo: form.activo,
      creado_por: isEditing ? Number(form.creado_por) : undefined,
    };

    let res;
    if (isEditing && grupo) {
      res = await GrupoService.actualizar(grupo.id_grupo, payload);
    } else {
      res = await GrupoService.crear(payload);
    }

    if (res.success) {
      alert(`✔ Grupo ${isEditing ? "actualizado" : "creado"}`);
      onSuccess();
      if (!isEditing) setForm(initialState);
    } else {
      alert("⚠ " + res.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 border-t-4 border-[#2A3964]">

      {!isEditing && (
        <h2 className="text-2xl font-bold text-[#2A3964] mb-4">Crear Grupo</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {isEditing && (
          <div>
            <label>ID Grupo</label>
            <input
              name="id_grupo"
              value={form.id_grupo}
              disabled
              className="w-full bg-gray-200 p-2 rounded"
            />
          </div>
        )}

        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Cupos</label>
          <input
            name="cupos"
            type="number"
            value={form.cupos}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Capacidad Máxima</label>
          <input
            name="capacidad_maxima"
            type="number"
            value={form.capacidad_maxima}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="sm:col-span-2">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {isEditing && (
          <div className="flex items-center gap-2">
            <input
              id="activo"
              name="activo"
              type="checkbox"
              checked={form.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo">Activo</label>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-[#880000] text-white px-4 py-2 rounded"
      >
        {loading
          ? "Guardando..."
          : isEditing
          ? "Actualizar"
          : "Crear Grupo"}
      </button>

    </form>
  );
}
