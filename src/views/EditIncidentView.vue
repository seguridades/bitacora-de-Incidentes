<template>
  <div class="container mt-5">
    <!-- Muestra formulario solo si el incidente existe -->
    <div v-if="incident">
      <h2 class="mb-4 text-primary-custom">Editar Incidente</h2>

      <!-- Título -->
      <div class="mb-3">
        <label for="title" class="form-label">Título del Incidente *</label>
        <input v-model="incident.title" type="text" id="title" class="form-control" required />
      </div>

      <!-- Área -->
      <div class="mb-3">
        <label for="area" class="form-label">Área *</label>
        <select
          v-model="incident.area"
          id="area"
          class="form-select"
          required
          @change="updatePeople"
        >
          <option value="" disabled selected>Selecciona un área</option>
          <option v-for="(area, index) in areas" :key="index" :value="area.name">
            {{ area.name }}
          </option>
        </select>
      </div>

      <!-- Personal del Área -->
      <div class="mb-3">
        <label class="form-label">Persona afectada por el incidente *</label>
        <select v-model="incident.personAffected" class="form-select" required>
          <option value="" disabled selected>Selecciona una persona</option>
          <option v-for="(person, idx) in peopleInArea" :key="idx" :value="person">
            {{ person }}
          </option>
        </select>
      </div>

      <!-- Fecha y Hora -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label for="date" class="form-label">Fecha del Incidente *</label>
          <input v-model="incident.date" type="date" id="date" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label for="time" class="form-label">Hora del Incidente *</label>
          <input v-model="incident.time" type="time" id="time" class="form-control" required />
        </div>
      </div>

      <!-- Tipo de ataque -->
      <div class="mb-3">
        <label for="attackType" class="form-label">Tipo de Ataque o Incidente *</label>
        <input
          v-model="incident.attackType"
          type="text"
          id="attackType"
          class="form-control"
          required
          placeholder="Ej: Phishing, Malware"
        />
      </div>

      <!-- Plataforma -->
      <div class="mb-3">
        <label for="platform" class="form-label">Plataforma *</label>
        <input
          v-model="incident.platform"
          type="text"
          id="platform"
          class="form-control"
          required
          placeholder="Ej: Correo, WhatsApp"
        />
      </div>

      <!-- URL -->
      <div class="mb-3">
        <label for="url" class="form-label">URL (si aplica)</label>
        <input
          v-model="incident.url"
          type="url"
          id="url"
          class="form-control"
          placeholder="https://ejemplo.com"
        />
      </div>

      <!-- Captura de pantalla -->
      <div class="mb-3">
        <label for="screenshot" class="form-label">Captura de Pantalla</label>
        <input
          @change="handleImageUpload"
          type="file"
          accept="image/*"
          id="screenshot"
          class="form-control"
        />
        <small class="text-muted">Dejar vacío si no deseas cambiar la imagen actual.</small>
      </div>

      <!-- Vista previa de la captura -->
      <div v-if="incident.screenshot" class="mb-3">
        <img
          :src="incident.screenshot"
          alt="Captura actual"
          class="img-thumbnail"
          style="max-height: 200px"
        />
      </div>

      <!-- Contenido -->
      <div class="mb-3">
        <label for="description" class="form-label">Descripción del Incidente *</label>
        <textarea
          v-model="incident.description"
          id="description"
          rows="4"
          class="form-control"
          required
        ></textarea>
      </div>

      <!-- Nivel de riesgo -->
      <div class="mb-3">
        <label for="riskLevel" class="form-label">Nivel de Riesgo *</label>
        <select v-model="incident.riskLevel" id="riskLevel" class="form-select" required>
          <option value="" disabled selected>Selecciona un nivel</option>
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
        </select>
      </div>

      <!-- Acciones de seguimiento -->
      <div class="mb-3">
        <label for="followUp" class="form-label">Acciones de Seguimiento</label>
        <textarea
          v-model="incident.followUp"
          id="followUp"
          rows="3"
          class="form-control"
        ></textarea>
      </div>

      <!-- Notas -->
      <div class="mb-3">
        <label for="notes" class="form-label">Notas Adicionales</label>
        <textarea v-model="incident.notes" id="notes" rows="3" class="form-control"></textarea>
      </div>

      <!-- Botón Guardar -->
      <button type="submit" class="btn btn-primary-custom btn-lg px-4 w-100" @click="saveChanges">
        <i class="bi bi-save me-2"></i>Guardar Cambios
      </button>
    </div>

    <!-- Mensaje si no se encontró el incidente -->
    <div v-else class="text-center py-5">
      <h4 class="text-danger mb-3">No se encontró el incidente</h4>
      <p class="text-muted mb-4">El incidente puede haber sido eliminado o no existe.</p>
      <router-link to="/incidentes" class="btn btn-outline-primary">
        Volver a la lista
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Índice del incidente a editar
const incidentId = parseInt(route.params.id)

// Datos reactivos
const incident = ref(null)
const organization = ref({ areas: [] })
const areas = ref([])
const peopleInArea = ref([])

// Cargar datos al montar el componente
onMounted(() => {
  try {
    // Cargar incidentes
    const storedIncidents = localStorage.getItem('incidents')
    if (!storedIncidents) {
      incident.value = null
      return
    }

    const incidents = JSON.parse(storedIncidents)
    if (!incidents[incidentId]) {
      incident.value = null
      return
    }

    incident.value = { ...incidents[incidentId] }

    // Cargar áreas
    const storedOrg = localStorage.getItem('organization')
    if (storedOrg) {
      organization.value = JSON.parse(storedOrg)
      areas.value = organization.value.areas || []
    }

    // Cargar personas del área seleccionada
    updatePeople()
  } catch (error) {
    console.error('Error al cargar los datos:', error)
    incident.value = null
  }
})

// Actualiza la lista de personas según el área seleccionada
function updatePeople() {
  if (!incident.value?.area) {
    peopleInArea.value = []
    return
  }

  const selectedArea = areas.value.find((area) => area.name === incident.value.area)
  if (selectedArea && selectedArea.members?.length > 0) {
    peopleInArea.value = [...selectedArea.members]
  } else {
    peopleInArea.value = []
  }
}

// Manejar carga de imagen
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      incident.value.screenshot = e.target.result // Base64
    }
    reader.readAsDataURL(file)
  }
}

// Guardar cambios
function saveChanges() {
  try {
    let incidents = []

    const stored = localStorage.getItem('incidents')
    if (stored) {
      incidents = JSON.parse(stored)
    }

    // Reemplazar el incidente editado
    incidents[incidentId] = incident.value

    // Guardar en localStorage
    localStorage.setItem('incidents', JSON.stringify(incidents))

    // Redirigir
    router.push('/incidentes')
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert('Hubo un error al guardar los cambios.')
  }
}
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  border-color: #04a1e9;
  box-shadow: 0 0 0 0.2rem rgba(4, 161, 233, 0.25);
}
</style>
