import { useState } from "react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import FormMateriaGrupos from "../components/FormMateriaGrupos";
import TableMateriaGrupos from "../components/TableMateriaGrupos";
import type { MateriaGrupo } from "../services/materiaGrupoService";

export default function GestionarMateriaGrupos() {
  const [refresh, setRefresh] = useState(0);
  const [editingMateriaGrupo, setEditingMateriaGrupo] = useState<MateriaGrupo | null>(null);

  const handleSuccess = () => {
    setRefresh((prev) => prev + 1);
    setEditingMateriaGrupo(null);
  };

  const handleEdit = (materiaGrupo: MateriaGrupo) => {
    setEditingMateriaGrupo(materiaGrupo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f9fafc] to-[#e6f0ff]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2A3964] mb-2 border-b-4 border-[#880000] pb-2 text-center sm:text-left">
            Gestión de Materia-Grupos
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Los materia-grupos son la combinación de una materia con un grupo específico para la gestión académica actual.
            Aquí puedes crear nuevas combinaciones antes de asignar docentes.
          </p>
        </div>

        {/* Formulario */}
        <div className="mb-8">
          <FormMateriaGrupos 
            materiaGrupo={editingMateriaGrupo} 
            onSuccess={handleSuccess} 
          />
        </div>

        {/* Tabla */}
        <div>
          <TableMateriaGrupos 
            refresh={refresh} 
            onEdit={handleEdit} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
