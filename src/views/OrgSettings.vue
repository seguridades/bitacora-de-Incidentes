<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-primary-custom">Configuración de la Organización</h2>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccess" class="alert alert-success" role="alert">
      ¡Datos guardados correctamente!
    </div>

    <!-- Mensaje de error -->
    <div v-if="showError" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="saveOrg">
      <!-- Información General -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header bg-primary-custom text-white">Información General</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="orgName" class="form-label">Nombre de la organización o medio</label>
              <input
                v-model="org.organizationName"
                type="text"
                id="orgName"
                class="form-control"
                placeholder="Ej: Empresa ABC S.A.C."
                required
              />
            </div>
            <div class="col-md-6">
              <label for="mainResponsible" class="form-label">
                Persona responsable de seguimiento
              </label>
              <input
                v-model="org.mainResponsible"
                type="text"
                id="mainResponsible"
                class="form-control"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Áreas -->
      <div class="card mb-4 shadow-sm">
        <div
          class="card-header bg-primary-custom text-white d-flex justify-content-between align-items-center"
        >
          Áreas de la Organización
          <button @click="addArea" type="button" class="btn btn-light btn-sm">
            <i class="bi bi-plus-circle me-1"></i>Agregar Área
          </button>
        </div>
        <div class="card-body">
          <div
            v-for="(area, index) in org.areas"
            :key="index"
            :class="[
              'border rounded p-3 mb-3 position-relative',
              { 'bg-light': !area.name || !area.manager || area.members.length === 0 },
            ]"
          >
            <!-- Encabezado con botón de eliminar -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0 fw-bold">{{ area.name || 'Área sin nombre' }}</h5>

              <!-- Botón de eliminar solo si hay más de una área -->
              <button
                v-if="org.areas.length > 1"
                @click="removeArea(index)"
                type="button"
                class="btn btn-danger btn-sm"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre del Área *</label>
                <input v-model="area.name" class="form-control" placeholder="Recursos Humanos" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Encargado del Área *</label>
                <input v-model="area.manager" class="form-control" placeholder="Ana Gómez" />
              </div>
            </div>

            <!-- Personal del área -->
            <div class="mt-4">
              <h6 class="text-muted">Personal del Área</h6>

              <div class="d-flex gap-2 mb-2">
                <input
                  v-model="area.newMember"
                  @keyup.enter="addMember(area)"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Nombre de persona"
                />
                <button @click="addMember(area)" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-person-add"></i>
                </button>
              </div>

              <ul class="list-group list-group-flush">
                <li
                  v-for="(member, i) in area.members"
                  :key="i"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ member }}
                  <button @click="removeMember(area, i)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón Guardar -->
      <div class="d-grid gap-2">
        <button type="submit" class="btn btn-primary-custom btn-lg px-4">
          <i class="bi bi-save me-2"></i>Guardar Configuración
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const org = ref({
  organizationName: '',
  mainResponsible: '',
  areas: [
    {
      name: '',
      manager: '',
      members: [],
      newMember: '',
    },
  ],
})

// Guardar datos en localStorage
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
// Cargar datos desde localStorage al montar el componente
onMounted(() => {
  const stored = localStorage.getItem('organization')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Si tiene áreas guardadas, las usamos
      if (parsed.areas && parsed.areas.length > 0) {
        org.value = {
          ...parsed,
          areas: parsed.areas.map((area) => ({
            ...area,
            newMember: '',
          })),
        }
      } else {
        // Si no tiene áreas, inicializamos con una vacía
        org.value = {
          organizationName: parsed.organizationName || '',
          mainResponsible: parsed.mainResponsible || '',
          areas: [
            {
              name: '',
              manager: '',
              members: [],
              newMember: '',
            },
          ],
        }
      }
    } catch (e) {
      console.error('Error al leer localStorage:', e)
    }
  }
})

// Añadir una nueva área
function addArea() {
  org.value.areas.push({
    name: '',
    manager: '',
    members: [],
    newMember: '',
  })
}

// Eliminar un área
function removeArea(index) {
  org.value.areas.splice(index, 1)
}

// Añadir miembro a un área
function addMember(area) {
  if (area.newMember.trim()) {
    area.members.push(area.newMember.trim())
    area.newMember = ''
  }
}

// Eliminar miembro de un área
function removeMember(area, index) {
  area.members.splice(index, 1)
}

// Guardar datos en localStorage con validación completa
function saveOrg() {
  const invalidAreas = org.value.areas
    .map((area, index) => {
      const errors = []
      if (!area.name.trim()) errors.push('Sin nombre')
      if (!area.manager.trim()) errors.push('Sin encargado')
      if (area.members.length === 0) errors.push('Sin personal')

      return { index, errors }
    })
    .filter((area) => area.errors.length > 0)

  if (invalidAreas.length > 0) {
    showError.value = true
    errorMessage.value = 'Por favor corrige las áreas incompletas antes de guardar.'
    return
  }

  localStorage.setItem('organization', JSON.stringify(org.value))
  showSuccess.value = true
  showError.value = false

  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<style scoped>
.card .card-header {
  font-weight: 600;
}
.form-control:focus {
  border-color: #04a1e9;
  box-shadow: 0 0 0 0.2rem rgba(4, 161, 233, 0.25);
}
</style>
