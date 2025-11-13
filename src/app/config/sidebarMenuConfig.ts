import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  MeetingRoom as MeetingRoomIcon,
  AccountBalance as AccountBalanceIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  FilePresent as FilePresentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export const sidebarMenu = {
  // ==============================
  //  ADMINISTRADOR DE FACULTAD
  // ==============================
  Administrador: [
    { label: "Dashboard", href: "/dashboard", icon: DashboardIcon }, // Vista general del sistema
    { label: "Gestiones Académicas", href: "/gestion-academica", icon: SchoolIcon }, // CU18: Gestionar Gestiones Académicas
    { label: "Carreras", href: "/carreras", icon: AccountBalanceIcon }, // CU19: Gestionar Carreras
    { label: "Materias", href: "/materias", icon: MenuBookIcon }, // CU3: Gestionar Materias
    { label: "Docentes", href: "/docentes", icon: PersonIcon }, // CU2: Gestionar Docentes
    { label: "Grupos", href: "/grupos", icon: GroupIcon }, // CU4: Gestionar Grupos
    { label: "Materia-Grupos", href: "/materia-grupos", icon: MenuBookIcon }, // Gestionar Materia-Grupos
    { label: "Aulas", href: "/aulas", icon: MeetingRoomIcon }, // CU5: Gestionar Aulas
    { label: "Usuarios / Carga Masiva", href: "/carga-masiva-usuarios", icon: AssignmentIcon }, // CU1: Cargar Usuarios Masivamente
    { label: "Bitácora", href: "/bitacora", icon: HistoryIcon }, // CU21: Gestionar Bitácora
    { label: "Reportes", href: "/reportes/asistencia", icon: AssignmentIcon }, // CU11: Generar Reportes de Asistencia
  ],

  // ==============================
  //  COORDINADOR ACADÉMICO
  // ==============================
  Coordinador: [
    { label: "Dashboard", href: "/dashboard", icon: DashboardIcon }, // Vista general del coordinador
    { label: "Docentes", href: "/docentes", icon: PersonIcon }, // CU2: Gestionar Docentes
    { label: "Materias", href: "/materias", icon: MenuBookIcon }, // CU3: Gestionar Materias
    { label: "Grupos", href: "/grupos", icon: GroupIcon }, // CU4: Gestionar Grupos
    { label: "Materia-Grupos", href: "/materia-grupos", icon: MenuBookIcon }, // Gestionar Materia-Grupos
    { label: "Aulas", href: "/aulas", icon: MeetingRoomIcon }, // CU5: Gestionar Aulas
    { label: "Asignar Docente", href: "/asignar-docente", icon: PersonIcon }, // CU16: Asignar Docente a Materia-Grupo
    { label: "Horarios Manuales", href: "/asignar-horario-manual", icon: AccessTimeIcon }, // CU6: Asignar Horarios Manualmente
    { label: "Horarios Automáticos", href: "/asignar-horario-automatico", icon: AccessTimeIcon }, // CU7: Asignar Horarios Automáticamente
    { label: "Disponibilidad de Aulas", href: "/consultar-disponibilidad-aulas", icon: MeetingRoomIcon }, // CU8: Consultar Disponibilidad de Aulas
    { label: "Visualizar Horarios", href: "/visualizar-horarios-semanales", icon: BarChartIcon }, // CU12: Visualizar Horarios Semanales
    { label: "Publicar Horarios", href: "/publicar-horarios", icon: CheckCircleIcon }, // CU17: Publicar Horarios
    { label: "Reportes", href: "/reportes/asistencia", icon: AssignmentIcon }, // CU11: Generar Reportes de Asistencia
  ],

  // ==============================
  //  AUTORIDAD ACADÉMICA
  // ==============================
  Autoridad: [
    { label: "Dashboard", href: "/dashboard", icon: DashboardIcon }, // Vista general
    { label: "Visualizar Horarios", href: "/visualizar-horarios-semanales", icon: AccessTimeIcon }, // CU12: Visualizar Horarios Semanales
    { label: "Publicar Horarios", href: "/publicar-horarios", icon: CheckCircleIcon }, // CU17: Publicar Horarios
    { label: "Reportes de Asistencia", href: "/reportes/asistencia", icon: BarChartIcon }, // CU11: Generar Reportes de Asistencia
    { label: "Bitácora", href: "/bitacora", icon: HistoryIcon }, // CU21: Gestionar Bitácora
  ],

  // ==============================
  //  DOCENTE
  // ==============================
  Docente: [
    { label: "Mi Horario", href: "/docente/mi-horario", icon: AccessTimeIcon }, // CU10: Consultar Carga Horaria Personal
    { label: "Registrar Asistencia", href: "/docente/asistencia", icon: AssignmentIcon }, // CU9: Registrar Asistencia Docente
    { label: "Justificar Ausencias", href: "/docente/asistencia", icon: FilePresentIcon }, // CU20: Justificar Ausencia
    { label: "Perfil / Contraseña", href: "/cambiar-password", icon: PersonIcon }, // CU14: Cambiar Contraseña en Primer Ingreso
  ],
};