import { useEffect, useState } from "react";
import { MateriaGrupoService, type MateriaGrupo } from "../services/materiaGrupoService";

interface Props {
  refresh: number;
  onEdit: (materiaGrupo: MateriaGrupo) => void;
}

export default function TableMateriaGrupos({ refresh, onEdit }: Props) {
  const [materiaGrupos, setMateriaGrupos] = useState<MateriaGrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [incluirInactivos, setIncluirInactivos] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error" | null; texto: string }>({
    tipo: null,
    texto: "",
  });

  useEffect(() => {
    cargarMateriaGrupos();
  }, [refresh, incluirInactivos]);

  const cargarMateriaGrupos = async () => {
    setLoading(true);
    const response = await MateriaGrupoService.listar({ incluir_inactivos: incluirInactivos });
    if (response.success) {
      console.log("✅ Materia-Grupos cargados:", response.data);
      console.log("🔍 Primer registro (verificar grupo):", response.data[0]);
      setMateriaGrupos(response.data);
    }
    setLoading(false);
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Está seguro de desactivar este materia-grupo?")) return;

    const res = await MateriaGrupoService.eliminar(id);
    if (res.success) {
      setMensaje({ tipo: "exito", texto: res.message });
      cargarMateriaGrupos();
    } else {
      setMensaje({ tipo: "error", texto: res.message });
    }

    setTimeout(() => setMensaje({ tipo: null, texto: "" }), 3000);
  };

  const handleReactivar = async (id: number) => {
    if (!confirm("¿Está seguro de reactivar este materia-grupo?")) return;

    const res = await MateriaGrupoService.reactivar(id);
    if (res.success) {
      setMensaje({ tipo: "exito", texto: res.message });
      cargarMateriaGrupos();
    } else {
      setMensaje({ tipo: "error", texto: res.message });
    }

    setTimeout(() => setMensaje({ tipo: null, texto: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A3964]"></div>
        <p className="mt-3 text-gray-600">Cargando materia-grupos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#2A3964] to-[#1a2744] flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Materia-Grupos Registrados</h2>
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={incluirInactivos}
            onChange={(e) => setIncluirInactivos(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Mostrar inactivos
        </label>
      </div>

      {/* Mensaje */}
      {mensaje.tipo && (
        <div
          className={`mx-5 mt-4 p-3 rounded-lg text-sm font-medium ${
            mensaje.tipo === "exito"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Materia</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grupo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Docente Asignado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Observación</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {materiaGrupos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay materia-grupos registrados
                </td>
              </tr>
            ) : (
              materiaGrupos.map((mg) => (
                <tr key={mg.id_materia_grupo} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700">{mg.id_materia_grupo}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {mg.materia.sigla ? `[${mg.materia.sigla}]` : ""} {mg.materia.nombre}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {mg.grupo?.nombre || <span className="text-red-500 italic">⚠️ Grupo no cargado</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {mg.docente_asignado ? (
                      <span className="text-green-700 font-medium">👨‍🏫 {mg.docente_asignado}</span>
                    ) : (
                      <span className="text-gray-400 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {mg.observacion ? (
                      <span className="truncate block max-w-xs" title={mg.observacion}>
                        {mg.observacion}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        mg.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {mg.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {mg.activo ? (
                        <>
                          <button
                            onClick={() => onEdit(mg)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(mg.id_materia_grupo)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                          >
                            🗑️ Desactivar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReactivar(mg.id_materia_grupo)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                        >
                          ✅ Reactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
