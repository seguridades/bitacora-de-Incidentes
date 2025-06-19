<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary-custom">Detalles del Incidente</h2>
      <router-link to="/incidentes" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Volver
      </router-link>
    </div>

    <!-- Datos del incidente -->
    <div v-if="incident" class="card shadow-sm border-0">
      <div class="card-body">
        <!-- Título -->
        <h4 class="card-title mb-4">{{ incident.title }}</h4>

        <!-- Información general -->
        <div class="row g-3">
          <div class="col-md-6">
            <p><strong>Área:</strong> {{ incident.area }}</p>
            <p><strong>Persona afectada:</strong> {{ incident.personAffected }}</p>
            <p><strong>Fecha:</strong> {{ incident.date }}</p>
            <p><strong>Hora:</strong> {{ incident.time }}</p>
            <p><strong>Tipo de ataque:</strong> {{ incident.attackType }}</p>
            <p><strong>Plataforma:</strong> {{ incident.platform }}</p>
            <p>
              <strong>URL:</strong> <a :href="incident.url" target="_blank">{{ incident.url }}</a>
            </p>
          </div>
          <div class="col-md-6">
            <p>
              <strong>Nivel de riesgo:</strong>
              <span
                :class="{
                  'badge bg-success': incident.riskLevel === 'Bajo',
                  'badge bg-warning text-dark': incident.riskLevel === 'Medio',
                  'badge bg-danger': incident.riskLevel === 'Alto',
                }"
              >
                {{ incident.riskLevel }}
              </span>
            </p>
            <p><strong>Descripción:</strong> {{ incident.description }}</p>
            <p><strong>Acciones de seguimiento:</strong> {{ incident.followUp || 'Ninguna' }}</p>
            <p><strong>Notas:</strong> {{ incident.notes || 'Ninguna' }}</p>
          </div>
        </div>

        <!-- Captura de pantalla -->
        <div v-if="incident.screenshot" class="mt-4">
          <h5>Captura de Pantalla</h5>
          <img
            :src="incident.screenshot"
            alt="Captura del incidente"
            class="img-fluid rounded shadow-sm"
          />
        </div>

        <!-- Botones -->
        <div class="mt-4 d-flex gap-2">
          <router-link :to="`/editar/${index}`" class="btn btn-sm btn-outline-warning me-2">
            <i class="bi bi-pencil-square me-1"></i>Editar
          </router-link>
          <button @click="generatePDF(incident)" class="btn btn-primary-custom">
            <i class="bi bi-file-earmark-pdf me-2"></i>Exportar PDF
          </button>
          <button @click="deleteIncident" class="btn btn-outline-danger">
            <i class="bi bi-trash me-2"></i>Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-danger">Incidente no encontrado.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'
import organizationData from '@/services/organizationService'

const route = useRoute()
const router = useRouter()

const incidentId = parseInt(route.params.id)
const incident = ref(null)

onMounted(() => {
  const stored = localStorage.getItem('incidents')
  if (stored) {
    try {
      const incidents = JSON.parse(stored)
      incident.value = incidents[incidentId]
    } catch (e) {
      console.error('Error al leer incidentes:', e)
    }
  }
})

// Eliminar incidente
function deleteIncident() {
  if (confirm('¿Estás seguro de eliminar este incidente?')) {
    let incidents = JSON.parse(localStorage.getItem('incidents'))
    incidents.splice(incidentId, 1)
    localStorage.setItem('incidents', JSON.stringify(incidents))
    router.push('/incidentes')
  }
}

// Generar PDF
function generatePDF(incident) {
  const doc = new jsPDF()

  // Datos de la organización
  const org = organizationData.getOrganization()

  // Título
  doc.setFontSize(16)
  doc.text(`Bitácora de Incidente: ${incident.title}`, 10, 10)

  // Encabezado con datos de la organización
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`${org.organizationName || 'Nombre de organización'}`, 10, 18)
  doc.text(`Responsable: ${org.mainResponsible || 'Sin responsable'}`, 10, 24)
  doc.setTextColor(0)

  // Datos del incidente
  let y = 34
  const lineHeight = 7

  function addLine(label, value) {
    if (value) {
      doc.setFontSize(12)
      doc.text(label, 10, y)
      doc.setFontSize(10)
      doc.text(value, 10, y + lineHeight / 2 + 1)
      y += lineHeight * 2
    }
  }

  addLine('Área afectada:', incident.area)
  addLine('Persona afectada:', incident.personAffected)
  addLine('Fecha:', incident.date)
  addLine('Hora:', incident.time)
  addLine('Tipo de ataque:', incident.attackType)
  addLine('Plataforma:', incident.platform)
  addLine('URL:', incident.url)
  addLine('Nivel de riesgo:', incident.riskLevel)
  addLine('Descripción:', incident.description)
  addLine('Acciones de seguimiento:', incident.followUp)
  addLine('Notas:', incident.notes)

  // Agregar imagen si existe
  if (incident.screenshot && incident.screenshot.startsWith('data:image')) {
    try {
      const imgProps = doc.getImageProperties(incident.screenshot)
      const pdfWidth = doc.internal.pageSize.getWidth()
      const ratio = imgProps.height / imgProps.width
      const pdfHeight = pdfWidth * ratio

      y += 10
      if (y + pdfHeight > doc.internal.pageSize.getHeight()) {
        doc.addPage()
        y = 20
      }

      doc.addImage(incident.screenshot, 'PNG', 10, y, pdfWidth - 20, pdfHeight * 0.3)
    } catch {
      console.warn('No se pudo incluir la imagen en el PDF.')
    }
  }

  // Guardar archivo
  const blob = doc.output('blob')
  saveAs(blob, `incidente_${incident.title.replace(/\s+/g, '_')}.pdf`)
}
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
.card img {
  max-height: 400px;
  object-fit: contain;
}
.badge {
  font-size: 1rem;
}
</style>
