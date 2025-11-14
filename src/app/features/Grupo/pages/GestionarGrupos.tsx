import { useState } from "react";  
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import FormGrupo from "../../Grupo/components/FormGrupos";
import TableGrupos from "../../Grupo/components/TableGrupos";
import { motion } from "framer-motion";

export default function GestionPage() {

  const [refresh, setRefresh] = useState(false);
  const recargar = () => setRefresh(r => !r);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <Header />

      <motion.main
        className="flex-grow max-w-screen-xl w-full mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <h1 className="text-3xl font-bold text-[#2A3964] mb-6 border-b-4 border-[#880000] pb-2">
          Gestión de Grupos
        </h1>

        <FormGrupo onSuccess={recargar} />

        <TableGrupos refresh={refresh} />
      </motion.main>

      <Footer />
    </div>
  );
}