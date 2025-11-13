import { useEffect, useState } from "react";
import { asignacionDocenteService } from "../services/asignacionDocenteService";
// Importa tu instancia 'api' global
import { api } from "../../../../lib/axios";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

interface OpcionSelect {
  value: number;
  label: string;
}

export default function AsignarDocentePage() {
  const [docentes, setDocentes] = useState<OpcionSelect[]>([]);
  const [materiaGrupos, setMateriaGrupos] = useState<OpcionSelect[]>([]);
  const [form, setForm] = useState({ id_docente: "", id_materia_grupo: "", hrs_asignadas: "" });
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error" | null; texto: string }>({
    tipo: null,
    texto: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSelects();
  }, []);

  const cargarSelects = async () => {
    try {
      // El interceptor 'api.js' maneja los headers automáticamente

      // Cargar docentes activos (usando la instancia 'api')
      const docentesRes = await api.get('/docentes/consulta?activo=true');

      const docentesMapeados = docentesRes.data.data.map((d: any) => ({
        value: d.cod_docente,
        label: d.nombre_completo || `Docente ${d.cod_docente}`
      }));

      setDocentes(docentesMapeados);

      const materiaGruposRes = await api.get('/materia-grupos/select');
      
      // Verificar si hay datos
      if (!materiaGruposRes.data.data || materiaGruposRes.data.data.length === 0) {
        console.warn("⚠️ No hay materia-grupos disponibles sin docente asignado");
        setMateriaGrupos([]);
      } else {
        // Mapear la respuesta a formato {value, label}
        const materiaGruposMapeados = materiaGruposRes.data.data.map((mg: any) => ({
          value: mg.value,
          label: mg.label
        }));
        
        setMateriaGrupos(materiaGruposMapeados);
      }
      
    } catch (error: any) {
      console.error("Error cargando selects:", error);
      setMensaje({ 
        tipo: "error", 
        texto: error.response?.data?.message || "Error al cargar datos de docentes o materias" 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: null, texto: "" });
    setLoading(true);

    try {
      const data = {
        id_docente: Number(form.id_docente),
        id_materia_grupo: Number(form.id_materia_grupo),
        hrs_asignadas: Number(form.hrs_asignadas),
      };

      const response = await asignacionDocenteService.crearAsignacion(data);

      if (response.success) {
        setMensaje({ tipo: "exito", texto: response.message });
        setForm({ id_docente: "", id_materia_grupo: "", hrs_asignadas: "" });
        
        // Recargar los materia-grupos
        cargarSelects(); 
      } else {
        throw new Error(response.message || "Error al asignar docente.");
      }
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || error.message || "No se pudo completar la asignación.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f9fafc] to-[#e6f0ff]">
      <Header />

      <main className="grow container mx-auto px-4 py-10">
        <div className="bg-white max-w-2xl mx-auto rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-[#003366] mb-3 text-center">
            Asignar Docente a Materia-Grupo
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Seleccione un docente y un materia-grupo para crear la asignación correspondiente.
          </p>

          {mensaje.tipo && (
            <div
              className={`p-3 mb-4 rounded-lg text-sm font-medium text-center ${
                mensaje.tipo === "exito"
                  ? "bg-[#e6fff0] text-[#007a33]"
                  : "bg-[#ffe6e6] text-[#b30000]"
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">Docente</label>
              <select
                name="id_docente"
                value={form.id_docente}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003366]"
              >
                <option value="">Seleccione un docente</option>
                {docentes.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">Materia-Grupo (Solo disponibles)</label>
              <select
                name="id_materia_grupo"
                value={form.id_materia_grupo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003366]"
              >
                <option value="">Seleccione una materia-grupo</option>
                {materiaGrupos.map((mg) => (
                  <option key={mg.value} value={mg.value}>
                    {mg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">Horas Asignadas (Semanales)</label>
              <input
                type="number"
                name="hrs_asignadas"
                min={1}
                max={40}
                value={form.hrs_asignadas}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#880000] text-white font-semibold py-2 rounded-lg hover:bg-[#b30000] transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Asignando..." : "Asignar Docente"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}