
import { useState, useEffect } from "react";
import { FileSpreadsheet, FileText, Filter } from "lucide-react";
import { reporteAsistenciaService } from "../services/reporteAsistenciaService";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { api } from "../../../../lib/axios";

export default function GenerarReportesAsistenciaPage() {
  const [filtros, setFiltros] = useState({
    docente: "",
    materia: "",
    grupo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState<any>(null);

  // Datos de selects
  const [docentes, setDocentes] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dRes, mRes, gRes] = await Promise.all([
          api.get("/docentes/select"),
          api.get("/materias/select"),
          api.get("/grupos/select"),
        ]);

        setDocentes(dRes.data.data || dRes.data);
        setMaterias(mRes.data.data || mRes.data);
        setGrupos(gRes.data.data || gRes.data);
      } catch (err) {
        console.error("Error cargando selects:", err);
      }
    };

    cargarDatos();
  }, []);

  const generarReporte = async () => {
    setLoading(true);
    try {
      const data = await reporteAsistenciaService.getReporte({
        id_gestion: 1,
        id_docente: filtros.docente ? parseInt(filtros.docente) : undefined,
        id_materia: filtros.materia ? parseInt(filtros.materia) : undefined,
        id_grupo: filtros.grupo ? parseInt(filtros.grupo) : undefined,
        fecha_inicio: filtros.fechaInicio || undefined,
        fecha_fin: filtros.fechaFin || undefined,
      });

      setReporte(data);
    } catch (err) {
      console.error("Error:", err);
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-10 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#880000] mb-6 flex items-center gap-2">
            <Filter className="text-[#880000]" /> Reporte de Asistencia Docente
          </h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

            {/* DOCENTE */}
            <select
              name="docente"
              value={filtros.docente}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Docente...</option>
              {docentes.map((d) => (
                <option key={d.id_docente} value={d.id_docente}>
                  {d.nombre_completo}
                </option>
              ))}
            </select>

            {/* MATERIA */}
            <select
              name="materia"
              value={filtros.materia}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Materia...</option>
              {materias.map((m) => (
                <option key={m.id_materia} value={m.id_materia}>
                  {m.nombre}
                </option>
              ))}
            </select>

            {/* GRUPO */}
            <select
              name="grupo"
              value={filtros.grupo}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Grupo...</option>
              {grupos.map((g) => (
                <option key={g.id_grupo} value={g.id_grupo}>
                  {g.nombre}
                </option>
              ))}
            </select>

            {/* FECHAS */}
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={generarReporte}
              disabled={loading}
              className="flex items-center gap-2 bg-[#880000] hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Cargando..." : "Generar Reporte"}
            </button>

            <button
              onClick={() => reporteAsistenciaService.exportarPDF({ id_gestion: 1 })}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FileText className="w-5 h-5" /> Exportar PDF
            </button>

            <button
              onClick={() => reporteAsistenciaService.exportarExcel({ id_gestion: 1 })}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FileSpreadsheet className="w-5 h-5" /> Exportar Excel
            </button>
          </div>

          {/* Tabla de Resultados */}
          {reporte && reporte.success && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Estadísticas Generales</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(reporte.estadisticas).map(([key, value]) => (
                  <div key={key} className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
                    <div className="text-sm text-gray-600 font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <div className="text-lg font-bold text-[#880000]">{String(value)}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-3">📅 Registros Detallados</h2>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#880000] text-white">
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Docente</th>
                      <th className="px-3 py-2">Materia</th>
                      <th className="px-3 py-2">Grupo</th>
                      <th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2">Tipo Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.data_detallada.map((r: any, index: number) => (
                      <tr key={index} className="border-t hover:bg-gray-100 transition-colors">
                        <td className="px-3 py-2">{r.fecha_registro}</td>
                        <td className="px-3 py-2">{r.asignacion_docente?.docente?.perfil?.nombre_completo || "-"}</td>
                        <td className="px-3 py-2">{r.asignacion_docente?.materia_grupo?.materia?.nombre || "-"}</td>
                        <td className="px-3 py-2">{r.asignacion_docente?.materia_grupo?.grupo?.nombre || "-"}</td>
                        <td className="px-3 py-2 text-center font-semibold text-[#880000]">{r.estado?.nombre || "-"}</td>
                        <td className="px-3 py-2 text-center">{r.tipo_registro || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!reporte && !loading && (
            <p className="text-gray-500 text-center mt-8 italic">
              No hay reportes generados todavía.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
