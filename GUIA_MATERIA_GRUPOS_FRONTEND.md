# 📚 Módulo de Materia-Grupos - Frontend

## ✅ Implementación Completada

Se ha creado el módulo completo de **Gestión de Materia-Grupos** en el frontend.

---

## 📁 Archivos Creados

### 1. Servicio API
**Ubicación:** `src/app/features/MateriaGrupo/services/materiaGrupoService.ts`

**Métodos disponibles:**
- ✅ `listar()` - Listar todos los materia-grupos
- ✅ `crear()` - Crear nuevo materia-grupo
- ✅ `obtener(id)` - Ver detalle
- ✅ `actualizar(id, data)` - Actualizar
- ✅ `eliminar(id)` - Desactivar
- ✅ `reactivar(id)` - Reactivar
- ✅ `paraSelect()` - Obtener dropdown de materia-grupos disponibles

### 2. Componentes

#### FormMateriaGrupos.tsx
**Ubicación:** `src/app/features/MateriaGrupo/components/FormMateriaGrupos.tsx`

**Características:**
- Dropdown de Materias (carga desde `/api/materias/select`)
- Dropdown de Grupos (carga desde `/api/grupos/select`)
- Campo de Observación opcional
- Modo creación y edición
- Validaciones en tiempo real
- Mensajes de éxito/error

#### TableMateriaGrupos.tsx
**Ubicación:** `src/app/features/MateriaGrupo/components/TableMateriaGrupos.tsx`

**Características:**
- Listado completo con información de materia y grupo
- Muestra si tiene docente asignado
- Checkbox para mostrar inactivos
- Acciones: Editar, Desactivar, Reactivar
- Indicadores visuales de estado
- Responsive

### 3. Página Principal

**Ubicación:** `src/app/features/MateriaGrupo/pages/GestionarMateriaGrupos.tsx`

**Funcionalidad:**
- Integra formulario y tabla
- Header y Footer
- Auto-refresh al crear/editar
- Scroll suave al editar

---

## 🔗 Integración en la App

### Ruta agregada
```typescript
// En App.tsx
<Route path="/materia-grupos" element={<GestionarMateriaGrupos />} />
```

### Menú de navegación
```typescript
// En sidebarMenuConfig.ts
// Para Administrador y Coordinador:
{ label: "Materia-Grupos", href: "/materia-grupos", icon: MenuBookIcon }
```

---

## 🚀 Cómo Usar

### Paso 1: Acceder al módulo

1. **Inicia sesión** como `Administrador` o `Coordinador`
2. En el sidebar, haz clic en **"Materia-Grupos"**
3. Serás redirigido a `/materia-grupos`

### Paso 2: Crear Materia-Grupo

1. En el formulario superior:
   - Selecciona una **Materia** del dropdown
   - Selecciona un **Grupo** del dropdown
   - (Opcional) Agrega una **Observación**
2. Haz clic en **"Crear Materia-Grupo"**
3. Verás un mensaje de éxito ✅
4. La tabla se actualizará automáticamente

### Paso 3: Asignar Docente

1. Ve a **"Asignar Docente"** en el sidebar
2. Ahora el dropdown de **"Materia-Grupo"** mostrará las opciones creadas
3. Selecciona el materia-grupo, docente y horas
4. Haz clic en **"Asignar Docente"**

---

## 🔄 Flujo Completo de Trabajo

```
1. Crear Materias
   └─ Menú: Materias → Crear nueva materia

2. Crear Grupos
   └─ Menú: Grupos → Crear nuevo grupo

3. Crear Materia-Grupos ✅ NUEVO
   └─ Menú: Materia-Grupos → Combinar Materia + Grupo

4. Asignar Docente
   └─ Menú: Asignar Docente → Seleccionar materia-grupo + docente
```

---

## 🎯 Estructura de Datos

### MateriaGrupo (Tipo TypeScript)
```typescript
interface MateriaGrupo {
  id_materia_grupo: number;
  id_materia: number;
  id_grupo: number;
  id_gestion: number;
  observacion: string | null;
  activo: boolean;
  fecha_creacion: string;
  fecha_modificacion: string | null;
  materia: Materia;  // Incluye: sigla, nombre
  grupo: Grupo;      // Incluye: nombre
  docente_asignado?: string | null; // Nombre completo si está asignado
}
```

---

## 📊 Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/materia-grupos` | Listar todos |
| POST | `/api/materia-grupos` | Crear nuevo |
| GET | `/api/materia-grupos/{id}` | Ver detalle |
| PUT | `/api/materia-grupos/{id}` | Actualizar |
| DELETE | `/api/materia-grupos/{id}` | Desactivar |
| POST | `/api/materia-grupos/{id}/reactivar` | Reactivar |
| GET | `/api/materia-grupos/select` | Dropdown (solo sin docente) |

---

## ⚠️ Validaciones del Backend

### Al Crear/Actualizar:
- ✅ `id_materia`: Requerido, debe existir
- ✅ `id_grupo`: Requerido, debe existir
- ✅ No permite duplicados (misma materia + grupo + gestión activa)

### Al Desactivar:
- ❌ **No permite desactivar** si tiene un docente asignado activo
- Solución: Primero desactiva la asignación del docente

---

## 🎨 Diseño Visual

### Formulario
- Fondo blanco con sombra
- Dropdowns con focus azul (#2A3964)
- Botón rojo (#880000) para submit
- Mensajes de validación en tiempo real

### Tabla
- Header azul oscuro (#2A3964)
- Estados con badges de colores:
  - Verde: Activo
  - Rojo: Inactivo
- Hover en filas
- Iconos en botones de acción

---

## 🐛 Solución de Problemas

### Problema: Dropdown de Materia-Grupo vacío en "Asignar Docente"

**Causa:** No hay materia-grupos creados o todos tienen docente asignado.

**Solución:**
1. Ve a **Materia-Grupos**
2. Crea nuevas combinaciones
3. Regresa a **Asignar Docente**
4. El dropdown se llenará automáticamente

### Problema: No aparecen materias o grupos en los dropdowns

**Causa:** No hay materias/grupos activos en el sistema.

**Solución:**
1. Ve a **Materias** y crea al menos una
2. Ve a **Grupos** y crea al menos uno
3. Regresa a **Materia-Grupos**

### Problema: Error al desactivar materia-grupo

**Mensaje:** "No se puede desactivar: tiene un docente asignado"

**Solución:**
1. Ve a la asignación del docente
2. Desactiva primero la asignación
3. Luego desactiva el materia-grupo

---

## ✅ Checklist de Verificación

- [x] Servicio API creado
- [x] Formulario funcional
- [x] Tabla con listado
- [x] Ruta registrada en App.tsx
- [x] Menú agregado al sidebar (Administrador)
- [x] Menú agregado al sidebar (Coordinador)
- [x] AsignarDocentePage actualizado para usar `/materia-grupos/select`
- [x] Sin errores de compilación
- [x] Tipos TypeScript definidos

---

## 🎉 ¡Listo para Usar!

El módulo está **100% funcional** y listo para crear materia-grupos y asignar docentes.

### Próximos pasos sugeridos:
1. Crear algunas combinaciones de materia-grupos de prueba
2. Asignar docentes a esas combinaciones
3. Verificar que el dropdown funcione correctamente
4. (Opcional) Agregar más validaciones según necesites
