<template>
  <div class="container mt-5">
    <!-- Título + Botón -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 text-primary-custom">Lista de Incidentes</h2>
      <router-link to="/agregar" class="btn btn-primary-custom btn-lg">
        <i class="bi bi-plus-circle me-2"></i>Agregar Incidente
      </router-link>
    </div>

    <!-- Mensaje si no hay incidentes -->
    <div v-if="incidents.length === 0" class="alert alert-info">
      No se han registrado incidentes aún.
    </div>

    <!-- Tabla de incidentes -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Título</th>
            <th>Área</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Nivel de Riesgo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(incident, index) in incidents" :key="index">
            <td>{{ incident.title }}</td>
            <td>{{ incident.area }}</td>
            <td>{{ incident.date }}</td>
            <td>{{ incident.time }}</td>
            <td>
              <span
                :class="{
                  'badge bg-success': incident.riskLevel === 'Bajo',
                  'badge bg-warning text-dark': incident.riskLevel === 'Medio',
                  'badge bg-danger': incident.riskLevel === 'Alto',
                }"
              >
                {{ incident.riskLevel }}
              </span>
            </td>
            <td>
              <router-link :to="`/incidente/${index}`" class="btn btn-sm btn-outline-info">
                Ver Detalles
              </router-link>
              <router-link :to="`/editar/${index}`" class="btn btn-sm btn-outline-warning me-2">
                <i class="bi bi-pencil-square me-1"></i>Editar
              </router-link>
              <button @click="generatePDF(incident)" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-file-earmark-pdf"></i> Exportar PDF
              </button>
              <!-- Opcional: Botón de eliminar -->
              <button @click="deleteIncident(index)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para agregar nuevo incidente -->
    <div class="text-end mt-3">
      <router-link to="/agregar" class="btn btn-primary-custom">
        <i class="bi bi-plus-circle me-2"></i>Agregar Nuevo Incidente
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'
import organizationData from '@/services/organizationService'

const incidents = ref([])

// Cargar incidentes desde localStorage
onMounted(() => {
  const stored = localStorage.getItem('incidents')
  if (stored) {
    try {
      incidents.value = JSON.parse(stored)
    } catch (e) {
      console.error('Error al leer incidentes:', e)
    }
  }
})

// Eliminar un incidente
function deleteIncident(index) {
  if (confirm('¿Estás seguro de eliminar este incidente?')) {
    incidents.value.splice(index, 1)
    localStorage.setItem('incidents', JSON.stringify(incidents.value))
  }
}

// Generar PDF del incidente
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
  if (incident.screenshot) {
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
.table th,
.table td {
  vertical-align: middle;
}
.badge {
  font-size: 1rem;
}
</style>
