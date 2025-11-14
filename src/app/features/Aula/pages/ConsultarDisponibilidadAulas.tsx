import { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import axios from "axios";
import { disponibilidadAulasService } from "../services/disponibilidadAulasService";

type MensajeEstado = {
  tipo: "error" | "exito" | null;
  texto: string;
};

export default function ConsultarDisponibilidadAulasPage() {
  const [dias, setDias] = useState<any[]>([]);
  const [bloques, setBloques] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [resumen, setResumen] = useState<any>(null);
  const [formData, setFormData] = useState({
    id_dia: "",
    id_bloque_horario: "",
  });
  const [mensaje, setMensaje] = useState<MensajeEstado>({
    tipo: null,
    texto: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL as string;
  const token = localStorage.getItem("auth_token");

  // 🔹 Cargar días y bloques al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setMensaje({
            tipo: "error",
            texto: "No se encontró token. Inicie sesión nuevamente.",
          });
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [diasRes, bloquesRes] = await Promise.all([
          axios.get(`${API_URL}/dias/select`, { headers }),
          axios.get(`${API_URL}/bloques-horario/select`, { headers }),
        ]);

        // El backend devuelve { success, data: [ { value, label } ] }
        const diasData = diasRes.data?.data ?? [];
        const bloquesData = bloquesRes.data?.data ?? [];

        setDias(diasData);
        setBloques(bloquesData);
      } catch (error) {
        console.error("Error al cargar días o bloques:", error);
        setMensaje({
          tipo: "error",
          texto: "Error al cargar días o bloques.",
        });
      }
    };

    fetchData();
  }, [API_URL, token]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Consultar disponibilidad
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_dia || !formData.id_bloque_horario) {
      setMensaje({
        tipo: "error",
        texto: "Debe seleccionar un día y un bloque horario.",
      });
      return;
    }

    if (!token) {
      setMensaje({
        tipo: "error",
        texto: "No se encontró token. Inicie sesión nuevamente.",
      });
      return;
    }

    setLoading(true);
    setMensaje({ tipo: null, texto: "" });
    setAulas([]);
    setResumen(null);

    try {
      const res = await disponibilidadAulasService.consultarDisponibilidad(
        Number(formData.id_dia),
        Number(formData.id_bloque_horario)
      );

      if (res?.success) {
        setAulas(res.data ?? []);
        setResumen(res.resumen ?? null);
        setMensaje({
          tipo: "exito",
          texto: res.message || "Consulta realizada correctamente ✅",
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: res?.message || "No se pudo obtener la disponibilidad.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setMensaje({
        tipo: "error",
        texto:
          err?.response?.data?.message || "Error al consultar disponibilidad.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#f9fafc] to-[#e6f0ff]">
      <Header />
      <main className="grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-[#003366] mb-6">
          Consultar Disponibilidad de Aulas
        </h1>

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

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto space-y-4 border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Día */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Día
              </label>
              <select
                name="id_dia"
                value={formData.id_dia}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Seleccione...</option>
                {dias.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bloque horario */}
            <div>
              <label className="block text-sm font-semibold text-[#003366] mb-1">
                Bloque Horario
              </label>
              <select
                name="id_bloque_horario"
                value={formData.id_bloque_horario}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Seleccione...</option>
                {bloques.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#880000] text-white font-semibold py-2 rounded-lg hover:bg-[#b30000] transition-colors duration-200 disabled:opacity-70"
          >
            {loading ? "Consultando..." : "Consultar Disponibilidad"}
          </button>
        </form>

        {/* RESULTADOS */}
        {aulas.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-[#003366] mb-4 text-center">
              Resultados de Disponibilidad
            </h2>

            <div className="flex justify-center gap-6 mb-6 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#e6fff0]" /> Disponible
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ffe6e6]" /> Ocupada
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300" /> No
                disponible
              </span>
            </div>

            <table className="min-w-full bg-white border rounded-lg shadow text-sm">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="px-4 py-2">Aula</th>
                  <th className="px-4 py-2">Capacidad</th>
                  <th className="px-4 py-2">Piso</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {aulas.map((aula: any) => (
                  <tr
                    key={aula.id_aula}
                    className={`border-t ${
                      aula.estado === "DISPONIBLE"
                        ? "bg-[#e6fff0]"
                        : aula.estado === "OCUPADA"
                        ? "bg-[#ffe6e6]"
                        : "bg-gray-200"
                    }`}
                  >
                    <td className="px-4 py-2">{aula.nombre}</td>
                    <td className="px-4 py-2">{aula.capacidad}</td>
                    <td className="px-4 py-2">{aula.piso}</td>
                    <td className="px-4 py-2">{aula.tipo_aula || "-"}</td>
                    <td className="px-4 py-2 font-semibold">{aula.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {resumen && (
              <div className="mt-6 text-center text-sm text-gray-700">
                <p>
                  Total: <strong>{resumen.total}</strong> | Disponibles:{" "}
                  <strong>{resumen.disponibles}</strong> | Ocupadas:{" "}
                  <strong>{resumen.ocupadas}</strong> | No disponibles:{" "}
                  <strong>{resumen.no_disponibles}</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
