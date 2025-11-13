import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GestionPage from '../src/app/features/Gestion/GestionPage';
import Dashboard from './app/features/Gestion/services/pages/Dashboard';
import GestionarAsistencia from './app/features/Aula/pages/GestionarAulas';
import GestionarAulas from './app/features/Aula/pages/GestionarAulas';
import GestionarCarreras from './app/features/Carrera/pages/GestionarCarreras';
import GestionarDocentes from './app/features/Docente/pages/GestionarDocentes';
import GestionarGrupos from './app/features/Grupo/pages/GestionarGrupos';
import GestionarHorarios from './app/features/Gestion/services/pages/GestionarHorarios';
import GestionarMaterias from './app/features/Materia/pages/GestionarMaterias';
import GestionarReportes from './app/features/Gestion/services/pages/GestionarReportes';
import Login from './app/features/Gestion/services/auth/Login';
import TipoAula from './app/features/Aula/pages/TipoAula';
import GestionTest from './app/components/test/GestionTest';
import Bitacora from "./app/features/Sistema/pages/Bitacora";
import CambiarPasswordPage from "./app/features/Auth/pages/CambiarPasswordPage";
import CargaMasivaUsuarios from "./app/features/Usuarios/pages/CargaMasivaUsuarios";
import AsignarDocentePage from "./app/features/Horario/pages/AsignarDocentePage";
import AsignarHorarioManualPage from "./app/features/Horario/pages/AsignarHorarioManualPage";
import AsignarHorarioAutomaticoPage from "./app/features/Horario/pages/AsignarHorarioAutomaticoPage";
import ConsultarDisponibilidadAulasPage from "./app/features/Aula/pages/ConsultarDisponibilidadAulas";
import VisualizarHorariosSemanales from "./app/features/Horario/pages/VisualizarHorariosSemanales";
import PublicarHorariosPage from "./app/features/Horario/pages/PublicarHorariosPage";
import CargaHorariaDocentePage from "./app/features/Horario/pages/CargaHorariaDocentePage";
import RegistrarYJustificarAsistencia from "./app/features/Asistencia/pages/RegistrarYJustificarAsistencia";
import MiHorarioDocenteDemo from "./app/features/Docente/pages/miHorario";
import GenerarReportesAsistenciaPage from "./app/features/Reportes/pages/GenerarReportesAsistenciaPage";
import GestionarMateriaGrupos from "./app/features/MateriaGrupo/pages/GestionarMateriaGrupos";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gestion-academica" element={<GestionPage />} />
        <Route path="/asistencias" element={<GestionarAsistencia />} />
        <Route path="/aulas" element={<GestionarAulas />} />
        <Route path="/carreras" element={<GestionarCarreras />} />
        <Route path="/docentes" element={<GestionarDocentes />} />
        <Route path="/grupos" element={<GestionarGrupos />} />
        <Route path="/horarios" element={<GestionarHorarios />} />
        <Route path="/materias" element={<GestionarMaterias />} />
        <Route path="/reportes" element={<GestionarReportes />} />
        <Route path="/tipos-aulas" element={<TipoAula/>} />
        <Route path="/test/gestiones" element={<GestionTest />} />
        <Route path="/bitacora" element={<Bitacora />} />
        <Route path="/cambiar-password" element={<CambiarPasswordPage />} />
        <Route path="/carga-masiva-usuarios" element={<CargaMasivaUsuarios />} />
        <Route path="/asignar-docente" element={<AsignarDocentePage />} />
        <Route path="/asignar-horario-manual" element={<AsignarHorarioManualPage />} />
        <Route path="/asignar-horario-automatico" element={<AsignarHorarioAutomaticoPage />} />
        <Route path="/consultar-disponibilidad-aulas" element={<ConsultarDisponibilidadAulasPage />} />
        <Route path="/visualizar-horarios-semanales" element={<VisualizarHorariosSemanales />} />
        <Route path="/publicar-horarios" element={<PublicarHorariosPage />} />
        <Route path="/carga-horaria-docente" element={<CargaHorariaDocentePage />} />
        <Route path="/docente/asistencia" element={<RegistrarYJustificarAsistencia />} />
        <Route path="/docente/mi-horario" element={<MiHorarioDocenteDemo />} />
        <Route path="/reportes/asistencia" element={<GenerarReportesAsistenciaPage />} />
        <Route path="/materia-grupos" element={<GestionarMateriaGrupos />} />
      </Routes>
    </Router>
  );
}


export default App;