import { useEffect, useState, useRef } from "react";
import { GrupoService, type Grupo } from "../../Grupo/services/grupoService";
import Modal from "../../../components/common/Modal";
import FormGrupo from "../components/FormGrupos";
import { motion } from "framer-motion";

export default function TableGrupos({ refresh }: { refresh: boolean }) {

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoAEditar, setGrupoAEditar] = useState<Grupo | null>(null);

  const cargarGrupos = async () => {
    const res = await GrupoService.listar({});
    if (res.success) setGrupos(res.data);
    else console.error("Error grupos:", res.message);
  };

  useEffect(() => {
    cargarGrupos();
  }, [refresh]);

  const finalizar = () => {
    setGrupoAEditar(null);
    cargarGrupos();
  };

  return (
    <motion.div className="bg-white shadow-lg rounded-xl p-4 mt-8">
      <h2 className="text-xl font-bold text-[#2A3964] mb-4">Grupos Registrados</h2>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2A3964] text-white">
            <tr>
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Capacidad</th>
              <th>Cupos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {grupos.length > 0 ? (
              grupos.map(grupo => (
                <tr key={grupo.id_grupo} className="border-b">
                  <td className="py-2">{grupo.id_grupo}</td>
                  <td>{grupo.nombre}</td>
                  <td>{grupo.descripcion || "N/A"}</td>
                  <td>{grupo.capacidad_maxima}</td>
                  <td>{grupo.cupos}</td>

                  <td>
                    <span className={
                      `px-2 py-1 rounded text-white ${
                        grupo.activo ? "bg-green-600" : "bg-red-500"
                      }`
                    }>
                      {grupo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="flex gap-2 justify-center">

                    <button
                      className="px-3 py-1 bg-orange-500 text-white rounded"
                      onClick={() => setGrupoAEditar(grupo)}
                    >
                      Editar
                    </button>

                    {grupo.activo ? (
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                          if (confirm("¿Desactivar grupo?")) {
                            const r = await GrupoService.eliminar(grupo.id_grupo);
                            alert(r.message);
                            cargarGrupos();
                          }
                        }}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-blue-700 text-white rounded"
                        onClick={async () => {
                          if (confirm("¿Reactivar grupo?")) {
                            const r = await GrupoService.reactivar(grupo.id_grupo);
                            alert(r.message);
                            cargarGrupos();
                          }
                        }}
                      >
                        Reactivar
                      </button>
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No hay grupos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {grupoAEditar && (
        <Modal
          open={true}
          onClose={() => setGrupoAEditar(null)}
          title={`Editar Grupo: ${grupoAEditar.nombre}`}
        >
          <FormGrupo grupo={grupoAEditar} onSuccess={finalizar} />
        </Modal>
      )}
    </motion.div>
  );
}
