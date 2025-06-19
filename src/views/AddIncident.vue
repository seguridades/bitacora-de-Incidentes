<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-primary-custom">Agregar Nuevo Incidente</h2>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccess" class="alert alert-success" role="alert">
      ¡Incidente guardado correctamente!
    </div>

    <!-- Formulario -->
    <form @submit.prevent="saveIncident">
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
      <button type="submit" class="btn btn-primary-custom btn-lg px-4 w-100">
        <i class="bi bi-save me-2"></i>Guardar Incidente
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Datos del incidente actual
const incident = ref({
  title: '',
  area: '',
  personAffected: '',
  date: '',
  time: '',
  attackType: '',
  platform: '',
  url: '',
  screenshot: null,
  description: '',
  riskLevel: '',
  followUp: '',
  notes: '',
})

const showSuccess = ref(false)
const organization = ref({ areas: [] })
const areas = ref([])
const peopleInArea = ref([])

// Cargar datos de la organización desde localStorage
onMounted(() => {
  const storedOrg = localStorage.getItem('organization')
  if (storedOrg) {
    try {
      organization.value = JSON.parse(storedOrg)
      areas.value = organization.value.areas || []
    } catch (e) {
      console.error('Error al leer organización:', e)
    }
  }
})

// Actualizar lista de personas según el área seleccionada
function updatePeople() {
  const selectedArea = areas.value.find((area) => area.name === incident.value.area)
  if (selectedArea && selectedArea.members?.length > 0) {
    peopleInArea.value = [...selectedArea.members]
  } else {
    peopleInArea.value = []
  }
  incident.value.personAffected = '' // Resetear selección anterior
}

// Manejar carga de imagen (captura de pantalla)
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

// Guardar incidente
function saveIncident() {
  let incidents = []

  // Leer incidentes existentes
  const stored = localStorage.getItem('incidents')
  if (stored) {
    try {
      incidents = JSON.parse(stored)
    } catch (e) {
      console.error('Error al leer incidentes:', e)
    }
  }

  // Agregar nuevo incidente
  incidents.push(incident.value)

  // Guardar en localStorage
  localStorage.setItem('incidents', JSON.stringify(incidents))

  // Mostrar mensaje de éxito
  showSuccess.value = true

  // Reiniciar formulario
  incident.value = {
    title: '',
    area: '',
    personAffected: '',
    date: '',
    time: '',
    attackType: '',
    platform: '',
    url: '',
    screenshot: null,
    description: '',
    riskLevel: '',
    followUp: '',
    notes: '',
  }

  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  border-color: #04a1e9;
  box-shadow: 0 0 0 0.2rem rgba(4, 161, 233, 0.25);
}
</style>
