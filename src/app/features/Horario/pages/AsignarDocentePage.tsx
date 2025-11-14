import { useEffect, useState } from "react";
import { asignacionDocenteService } from "../services/asignacionDocenteService";
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
  const [form, setForm] = useState({
    cod_docente: "",
    id_materia_grupo: "",
    hrs_asignadas: "",
  });

  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error" | null;
    texto: string;
  }>({ tipo: null, texto: "" });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSelects();
  }, []);

  const cargarSelects = async () => {
    try {
      // DOCENTES
      const docentesRes = await api.get("/docentes/select");
      const docentesMapeados = docentesRes.data.data.map((d: any) => ({
        value: d.cod_docente,
        label: d.nombre_completo,
      }));
      setDocentes(docentesMapeados);

      // MATERIA-GRUPOS
      const mgRes = await api.get("/materia-grupos/select");
      const mgMapeados = mgRes.data.data.map((mg: any) => ({
        value: mg.value,
        label: mg.label,
      }));
      setMateriaGrupos(mgMapeados);

    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al cargar selects.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: null, texto: "" });
    setLoading(true);

    try {
      const data = {
        id_docente: Number(form.cod_docente),
        id_materia_grupo: Number(form.id_materia_grupo),
        hrs_asignadas: Number(form.hrs_asignadas),
      };

      const response = await asignacionDocenteService.crearAsignacion(data);

      if (response.success) {
        setMensaje({ tipo: "exito", texto: response.message });

        // limpiar form
        setForm({
          cod_docente: "",
          id_materia_grupo: "",
          hrs_asignadas: "",
        });

        cargarSelects();
      } else {
        throw new Error(response.message);
      }

    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          error.message ||
          "No se pudo completar la asignación.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f9fafc] to-[#e6f0ff]">
      <Header />

      <main className="grow container mx-auto px-4 py-10">
        <div className="bg-white max-w-2xl mx-auto rounded-2xl shadow-lg border p-8">
          <h1 className="text-2xl font-bold text-[#003366] mb-3 text-center">
            Asignar Docente a Materia-Grupo
          </h1>

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

            {/* DOCENTE */}
            <div>
              <label className="block text-sm font-semibold mb-1">Docente</label>
              <select
                name="cod_docente"
                value={form.cod_docente}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Seleccione un docente</option>
                {docentes.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MATERIA-GRUPO */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Materia-Grupo
              </label>
              <select
                name="id_materia_grupo"
                value={form.id_materia_grupo}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Seleccione una materia-grupo</option>
                {materiaGrupos.map((mg) => (
                  <option key={mg.value} value={mg.value}>
                    {mg.label}
                  </option>
                ))}
              </select>
            </div>

            {/* HORAS */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Horas asignadas
              </label>
              <input
                type="number"
                name="hrs_asignadas"
                min={1}
                max={40}
                value={form.hrs_asignadas}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#880000] text-white py-2 rounded-lg"
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
