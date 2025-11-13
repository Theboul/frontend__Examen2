import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MateriaService, type Materia } from "../services/materiaService";
import Modal from "../../../components/common/Modal";
import FormMateria from "./FormMaterias";

export default function TableMaterias({ refresh }: { refresh: boolean }) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  // ESTADO DE EDICIÓN
  const [materiaAEditar, setMateriaAEditar] = useState<Materia | null>(null);

  const cargarMaterias = async () => {
      try {

          const res = await MateriaService.listar(true);
          
          if (res.success) {
              setMaterias(res.data);
              console.log('✅ Materias cargadas:', res.data.length);
          } else {
              alert("Error al cargar materias: " + res.message);
          }
      } catch (error) {
          alert("Error fatal al cargar materias");
      }
  };

  useEffect(() => {
    cargarMaterias();
  }, [refresh]);

  // Lógica de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;
      const el = tableRef.current;
      setScrolled(el.scrollLeft > 0);
    };
    const el = tableRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  // Funciones de acción
  const reactivar = async (id: number, nombre: string) => {
    if (confirm(`¿Deseas reactivar la materia ${nombre}?`)) {
      const res = await MateriaService.reactivar(id);
      alert(res.message);
      cargarMaterias();
    }
  };

  const desactivar = async (id: number, nombre: string) => {
    if (confirm(`¿Deseas DESACTIVAR (eliminar) la materia ${nombre}?`)) {
      const res = await MateriaService.eliminar(id);
      alert(res.message);
      cargarMaterias();
    }
  };

  // Inicia la edición y abre el modal
  const iniciarEdicion = (materia: Materia) => {
    setMateriaAEditar(materia);
  };

  // Cierra el modal y recarga la tabla
  const finalizarEdicion = () => {
    setMateriaAEditar(null); // Cierra el modal
    cargarMaterias(); // Recarga la tabla
  }


  return (
    <motion.div
      className="bg-white shadow-md rounded-xl p-4 mt-6 w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2
        className="font-semibold mb-4 text-center sm:text-left text-lg sm:text-xl"
        style={{ color: "#2A3964" }}
      >
        Materias Registradas
      </h2>

      {/* Tabla única, adaptable y con header sticky */}
      <div
        ref={tableRef}
        className={`w-full overflow-x-auto rounded-lg border relative transition-shadow duration-300 ${scrolled ? "shadow-[inset_10px_0_8px_-8px_rgba(0,0,0,0.15)]" : ""
          }`}
      >
        <table className="min-w-full text-sm text-center border-collapse">
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: "#2A3964", color: "#ffffff" }}
          >
            <tr>
              <th className="py-2 px-3 whitespace-nowrap">ID</th>
              <th className="whitespace-nowrap text-left px-3">Nombre</th>
              <th className="whitespace-nowrap">Sigla</th>
              <th className="whitespace-nowrap">Carrera</th>
              <th className="whitespace-nowrap">Semestre</th>
              <th className="whitespace-nowrap">Créditos</th>
              <th className="whitespace-nowrap">Estado</th>
              <th className="whitespace-nowrap">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {materias.length > 0 ? (
              materias.map((materia) => (
                <motion.tr
                  key={materia.id_materia}
                  className="border-b hover:bg-gray-100 text-gray-700 transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-2 px-2 font-medium">{materia.id_materia}</td>
                  <td className="text-left px-3">{materia.nombre}</td>
                  <td>{materia.sigla || 'N/A'}</td>
                  <td>{materia.carrera.codigo}</td>
                  <td>{materia.semestre.nombre}</td>
                  <td>{materia.creditos || 0}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-medium ${materia.activo ? "bg-green-600" : "bg-red-500"
                        }`}
                    >
                      {materia.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="flex flex-col sm:flex-row justify-center items-center gap-2 py-2">
                    {/* Botón de Edición */}
                    <button
                      onClick={() => iniciarEdicion(materia)}
                      className="bg-orange-500 text-white text-xs sm:text-sm px-3 py-1 rounded-lg hover:opacity-90 transition-all w-full sm:w-auto min-w-[70px]"
                    >
                      Editar
                    </button>

                    {/* Botón de Desactivar/Activar */}
                    {materia.activo ? (
                      <button
                        onClick={() => desactivar(materia.id_materia, materia.nombre)}
                        className="bg-[#880000] text-white text-xs sm:text-sm px-3 py-1 rounded-lg hover:opacity-90 transition-all w-full sm:w-auto min-w-[70px]"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => reactivar(materia.id_materia, materia.nombre)}
                        className="bg-[#2A3964] text-white text-xs sm:text-sm px-3 py-1 rounded-lg hover:opacity-90 transition-all w-full sm:w-auto min-w-[70px]"
                      >
                        Reactivar
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-3 text-gray-500">
                  No hay materias registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {materiaAEditar && (
        <Modal
          open={!!materiaAEditar}
          onClose={() => setMateriaAEditar(null)}
          title={`Editar Materia: ${materiaAEditar.nombre} (${materiaAEditar.sigla})`}
        >
          <FormMateria
            materia={materiaAEditar}
            onSuccess={finalizarEdicion}
          />
        </Modal>
      )}
    </motion.div>
  );
}