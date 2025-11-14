import { useState, useEffect } from "react";
import { FileSpreadsheet, FileText, Filter } from "lucide-react";
import { reporteAsistenciaService } from "../services/reporteAsistenciaService";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { api } from "../../../../lib/axios";

// Interface para los dropdowns
interface OpcionSelect {
  value: number;
  label: string;
}

export default function GenerarReportesAsistenciaPage() {
  const [filtros, setFiltros] = useState({
    id_gestion: "",
    docente: "",
    materia: "",
    grupo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Datos de selects
  const [gestiones, setGestiones] = useState<OpcionSelect[]>([]);
  const [docentes, setDocentes] = useState<OpcionSelect[]>([]);
  const [materias, setMaterias] = useState<OpcionSelect[]>([]);
  const [grupos, setGrupos] = useState<OpcionSelect[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log("🔄 Cargando datos para los selects...");

        const [gRes, dRes, mRes, grRes] = await Promise.all([
          api.get("/gestiones/consulta"),
          api.get("/docentes/select/consulta"),
          api.get("/materias/select/consulta"),
          api.get("/grupos/select"),
        ]);

        // === ¡ARREGLO PARA DROPDOWNS! ===

        // 1. GESTIONES: Guardar original, luego mapear
        const gestionesOriginales = (gRes.data?.data || []);
        const gestionesData = gestionesOriginales.map((g: any) => ({
          value: g.id_gestion,
          label: `${g.anio} - ${g.semestre} ${g.activo ? '(Activa)' : ''}`
        }));
        
        // 2. DOCENTES: Mapear
        const docentesData = (dRes.data?.data || []).map((d: any) => ({
          value: d.cod_docente,
          label: `${d.nombre_completo ?? 'N/A'} (${d.cod_docente})`
        }));
        
        // 3. MATERIAS Y GRUPOS: Ya vienen listos
        const materiasData = mRes.data?.data || mRes.data || [];
        const gruposData = grRes.data?.data || grRes.data || [];

        setGestiones(gestionesData);
        setDocentes(docentesData);
        setMaterias(materiasData);
        setGrupos(gruposData);

        // 4. CORRECCIÓN: Buscar en los datos ORIGINALES
        const gestionActiva = gestionesOriginales.find((g: any) => g.activo === true);
        if (gestionActiva) {
          // CORRECCIÓN: Convertir a string para el <select>
          setFiltros(f => ({ ...f, id_gestion: gestionActiva.id_gestion.toString() }));
        }

      } catch (err: any) {
        console.error("❌ Error cargando selects:", err);
        setError(err.response?.data?.message || "Error al cargar los filtros");
      }
    };

    cargarDatos();
  }, []);

  const getFiltrosReporte = () => {
    if (!filtros.id_gestion) {
      setError("Por favor, seleccione una gestión para generar el reporte.");
      return null;
    }
    setError(null); // Limpiar error

    return {
      id_gestion: parseInt(filtros.id_gestion),
      id_docente: filtros.docente ? parseInt(filtros.docente) : undefined,
      id_materia: filtros.materia ? parseInt(filtros.materia) : undefined,
      id_grupo: filtros.grupo ? parseInt(filtros.grupo) : undefined,
      fecha_inicio: filtros.fechaInicio || undefined,
      fecha_fin: filtros.fechaFin || undefined,
    };
  }

  const generarReporte = async () => {
    const params = getFiltrosReporte();
    if (!params) return;

    setLoading(true);
    setReporte(null);

    try {
      const data = await reporteAsistenciaService.getReporte(params);
      setReporte(data);
    } catch (err: any) {
      console.error("Error:", err);
      // El 'err.message' viene del service
      setError(err.message || "Error al generar el reporte");
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  const exportar = async (formato: 'pdf' | 'excel') => {
    const params = getFiltrosReporte();
    if (!params) return;

    try {
      if (formato === 'pdf') {
        await reporteAsistenciaService.exportarPDF(params);
      } else if (formato === 'excel') {
        await reporteAsistenciaService.exportarExcel(params);
      }
    } catch (err: any) {
      setError(err.message || `Error al exportar ${formato}`);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    // ... Tu JSX es perfecto, no se toca ...
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-10 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#880000] mb-6 flex items-center gap-2">
            <Filter className="text-[#880000]" /> Reporte de Asistencia Docente
          </h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

            <select
              name="id_gestion"
              value={filtros.id_gestion}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 font-medium bg-gray-100 text-[#880000]"
            >
              <option value="">Seleccionar Gestión (Obligatorio)</option>
              {gestiones.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            
            <select
              name="docente"
              value={filtros.docente}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Docente...</option>
              {docentes.map((d, index) => (
                <option key={`docente-${d.value || index}`} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            <select
              name="materia"
              value={filtros.materia}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Materia...</option>
              {materias.map((m, index) => (
                <option key={`materia-${m.value || index}`} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              name="grupo"
              value={filtros.grupo}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar Grupo...</option>
              {grupos.map((g, index) => (
                <option key={`grupo-${g.value || index}`} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

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
          
          {error && (
             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
               {error}
             </div>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={generarReporte}
              disabled={loading || !filtros.id_gestion}
              className="flex items-center gap-2 bg-[#880000] hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Generar Reporte"}
            </button>

            <button
              onClick={() => exportar('pdf')}
              disabled={loading || !filtros.id_gestion}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              <FileText className="w-5 h-5" /> Exportar PDF
            </button>

            <button
              onClick={() => exportar('excel')}
              disabled={loading || !filtros.id_gestion}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              <FileSpreadsheet className="w-5 h-5" /> Exportar Excel
            </button>
          </div>

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

          {!reporte && !loading && !error && (
            <p className="text-gray-500 text-center mt-8 italic">
              Seleccione una gestión y presione "Generar Reporte".
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}