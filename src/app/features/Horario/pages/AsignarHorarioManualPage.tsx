import { useEffect, useState } from "react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { horarioService } from "../services/HorarioService";
import { asignacionDocenteService } from "../services/asignacionDocenteService";
import axios from "../../../../lib/axios";

export default function AsignarHorarioManualPage() {
  const [formData, setFormData] = useState({
    id_asignacion_docente: "",
    id_aula: "",
    id_dia: "",
    id_bloque_horario: "",
    id_tipo_clase: "",
  });

  const [aulas, setAulas] = useState<any[]>([]);
  const [dias, setDias] = useState<any[]>([]);
  const [bloques, setBloques] = useState<any[]>([]);
  const [tiposClase, setTiposClase] = useState<any[]>([]);
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error" | null; texto: string }>({
    tipo: null,
    texto: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [
        respAsignaciones,
        respAulas,
        respDias,
        respBloques,
        respTiposClase,
      ] = await Promise.all([
        asignacionDocenteService.getSelect(), 
        axios.get("/aulas/select"),
        horarioService.getDias(),
        horarioService.getBloques(),
        horarioService.getTiposClase(),
      ]);

      setAsignaciones(respAsignaciones || []);
      setAulas(respAulas.data.data || []);
      setDias(respDias.data.data || []);
      setBloques(respBloques.data.data || []);
      setTiposClase(respTiposClase.data.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setMensaje({ tipo: "error", texto: "Error al cargar datos iniciales." });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: null, texto: "" });

    try {
      const response = await horarioService.create(formData);

      if (response.data.success) {
        setMensaje({
          tipo: "exito",
          texto: "✅ Horario asignado manualmente con éxito.",
        });
        setFormData({
          id_asignacion_docente: "",
          id_aula: "",
          id_dia: "",
          id_bloque_horario: "",
          id_tipo_clase: "",
        });
      } else {
        throw new Error(response.data.message || "Error al asignar horario.");
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "No se pudo asignar el horario.";
      setMensaje({ tipo: "error", texto: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#f9fafc] to-[#e6f0ff]">
      <Header />

      <main className="grow container mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#003366] text-center mb-4">
            Asignar Horario Manualmente
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Asigne día, bloque y aula a una asignación docente.
          </p>

          {mensaje.tipo && (
            <div
              className={`p-3 mb-4 rounded-lg text-center font-medium ${
                mensaje.tipo === "error"
                  ? "bg-[#ffe6e6] text-[#b30000]"
                  : "bg-[#e6fff0] text-[#007a33]"
              }`}
            >
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asignación */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Asignación Docente-Materia-Grupo
              </label>
              <select
                name="id_asignacion_docente"
                value={formData.id_asignacion_docente}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
          <option value="">Seleccione una asignación</option>
          {asignaciones.map((a) => (
            <option 
              key={a.id_asignacion_docente} 
              value={a.id_asignacion_docente}
            >
              {a.label}
            </option>
          ))}

       
              </select>
            </div>

            {/* Aula */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Aula
              </label>
              <select
                name="id_aula"
                value={formData.id_aula}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccione aula</option>
                
               {aulas.map((aula) => (
                    <option key={aula.value} value={aula.value}>
                      {aula.label}
                    </option>
               ))}
      
            
              </select>
            </div>

            {/* Día */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Día
              </label>
              <select
                name="id_dia"
                value={formData.id_dia}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccione día</option>
                {dias.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bloque Horario */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Bloque Horario
              </label>
              <select
                name="id_bloque_horario"
                value={formData.id_bloque_horario}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccione bloque</option>
                {bloques.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Clase */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Tipo de Clase
              </label>
              <select
                name="id_tipo_clase"
                value={formData.id_tipo_clase}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccione tipo</option>
                {tiposClase.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#880000] hover:bg-[#b30000] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Asignando..." : "Guardar Horario"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
