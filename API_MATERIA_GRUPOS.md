# API Materia-Grupos

## 📋 Descripción

La tabla `materia_grupo` combina una **Materia** + **Grupo** para una **Gestión** específica.

## 🔄 Flujo de Trabajo

1. **Crear Materias** → `/api/materias` (ya existe)
2. **Crear Grupos** → `/api/grupos` (ya existe)
3. **Crear Materia-Grupo** → `/api/materia-grupos` (combina ambos) ✅ **NUEVO**
4. **Asignar Docente** → `/api/asignaciones-docente` (ya existe)

---

## 🔐 Permisos

**Roles permitidos:** `Administrador`, `Coordinador`

---

## 📌 Endpoints

### 1. Listar Materia-Grupos

```http
GET /api/materia-grupos
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_materia_grupo": 1,
      "materia": {
        "sigla": "INF-111",
        "nombre": "Programación I"
      },
      "grupo": "A",
      "gestion": "I/2025",
      "docente_asignado": "Juan Pérez López",
      "observacion": null,
      "activo": true,
      "fecha_creacion": "2025-11-13 10:30:00"
    }
  ]
}
```

---

### 2. Crear Materia-Grupo

```http
POST /api/materia-grupos
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "id_materia": 5,
  "id_grupo": 3,
  "observacion": "Grupo avanzado"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Materia-Grupo creado exitosamente",
  "data": {
    "id_materia_grupo": 12,
    "id_materia": 5,
    "id_grupo": 3,
    "id_gestion": 4,
    "observacion": "Grupo avanzado",
    "activo": true,
    "materia": {
      "sigla": "INF-112",
      "nombre": "Programación II"
    },
    "grupo": {
      "nombre": "B"
    }
  }
}
```

**Validaciones:**
- `id_materia`: Requerido, debe existir en tabla `materias`
- `id_grupo`: Requerido, debe existir en tabla `grupos`
- `observacion`: Opcional, máximo 500 caracteres
- No permite duplicados (misma materia + grupo + gestión activa)

---

### 3. Ver Detalle

```http
GET /api/materia-grupos/{id}
Authorization: Bearer {token}
```

---

### 4. Actualizar Materia-Grupo

```http
PUT /api/materia-grupos/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "id_materia": 6,
  "id_grupo": 4,
  "observacion": "Actualizado"
}
```

---

### 5. Desactivar Materia-Grupo

```http
DELETE /api/materia-grupos/{id}
Authorization: Bearer {token}
```

**Validación:** No permite desactivar si tiene un docente asignado activo.

---

### 6. Reactivar Materia-Grupo

```http
POST /api/materia-grupos/{id}/reactivar
Authorization: Bearer {token}
```

---

### 7. Dropdown (Sin Docente Asignado)

```http
GET /api/materia-grupos/select
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "value": 12,
      "label": "[INF-112] Programación II (Grupo: B)"
    },
    {
      "value": 15,
      "label": "[MAT-101] Cálculo I (Grupo: A)"
    }
  ]
}
```

**Filtros aplicados:**
- ✅ Gestión activa
- ✅ `activo = true`
- ✅ **SIN docente asignado** (usa `whereDoesntHave('asignacionDocenteActiva')`)

---

## 🎯 Ejemplo de Uso en Frontend (React)

### Paso 1: Crear Materia-Grupo

```jsx
const crearMateriaGrupo = async (idMateria, idGrupo) => {
  try {
    const response = await axios.post('/api/materia-grupos', {
      id_materia: idMateria,
      id_grupo: idGrupo,
      observacion: 'Opcional'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('Materia-Grupo creado:', response.data.data);
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
};
```

### Paso 2: Cargar Dropdown de Materia-Grupos Disponibles

```jsx
const cargarMateriaGrupos = async () => {
  try {
    const response = await axios.get('/api/materia-grupos/select', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setMateriaGrupos(response.data.data); // Array de {value, label}
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
};
```

### Paso 3: Asignar Docente a Materia-Grupo

```jsx
const asignarDocente = async (idMateriaGrupo, codDocente, horasAsignadas) => {
  try {
    const response = await axios.post('/api/asignaciones-docente', {
      id_materia_grupo: idMateriaGrupo,
      cod_docente: codDocente,
      horas_asignadas: horasAsignadas
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('Docente asignado correctamente');
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
};
```

---

## ❌ Errores Comunes

### Error 422: Duplicado

```json
{
  "success": false,
  "message": "Esta combinación de Materia y Grupo ya existe para la gestión activa"
}
```

**Solución:** Verifica que no exista otro `materia_grupo` con la misma `id_materia` + `id_grupo` en la gestión activa.

### Error 422: No se puede desactivar

```json
{
  "success": false,
  "message": "No se puede desactivar: tiene un docente asignado. Primero desactive la asignación."
}
```

**Solución:** Desactiva primero la asignación en `/api/asignaciones-docente/{id}` (DELETE).

---

## 📊 Modelo de Datos

```
materia_grupo
├── id_materia_grupo (PK)
├── id_materia (FK → materias)
├── id_grupo (FK → grupos)
├── id_gestion (FK → gestiones)
├── observacion (text, nullable)
├── activo (boolean)
└── fecha_creacion (timestamp)
```

**Relaciones:**
- `materia()` → belongsTo Materia
- `grupo()` → belongsTo Grupo
- `gestion()` → belongsTo Gestion
- `asignacionDocenteActiva()` → hasOne AsignacionDocente (where activo = true)
