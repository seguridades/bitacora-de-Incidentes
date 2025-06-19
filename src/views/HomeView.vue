<script setup>
import heroImage from '@/assets/hero.png'
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="bg-primary-custom text-white py-5 position-relative overflow-hidden">
      <div
        class="container d-flex flex-column flex-md-row align-items-center justify-content-between"
      >
        <div class="text-center text-md-start mb-4 mb-md-0">
          <h1 class="display-4 fw-bold">Bitácora de Incidentes</h1>
          <p class="lead">Registra, organiza y exporta tus incidentes fácilmente.</p>
          <router-link to="/agregar" class="btn btn-light btn-lg mt-3">
            <i class="bi bi-plus-circle me-2"></i>Agregar Nuevo Incidente
          </router-link>
        </div>
        <div class="text-center">
          <img
            :src="heroImage"
            alt="Ilustración de bitácora"
            class="img-fluid"
            style="max-width: 420px"
          />
        </div>
      </div>
    </section>

    <!-- Descripción -->
    <section class="py-5">
      <div class="container">
        <h2 class="mb-4 text-center">¿Qué es esta aplicación?</h2>
        <p class="lead text-center mx-auto" style="max-width: 800px">
          Esta web app te permite llevar un control completo de los incidentes que ocurren en tu
          organización, desde su registro hasta su exportación como PDF. Todo guardado localmente
          sin necesidad de conexión.
        </p>
      </div>
    </section>

    <!-- Secciones de Justificación -->
    <section class="bg-light py-5">
      <div class="container">
        <div class="row">
          <!-- Por qué usar -->
          <div class="col-md-6 mb-4">
            <h3>¿Por qué usar esta Bitácora?</h3>
            <ul class="list-group">
              <li class="list-group-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i> Almacenamiento local
                seguro
              </li>
              <li class="list-group-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i> Fácil registro de
                incidentes
              </li>
              <li class="list-group-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i> Exportación a PDF
                inmediata
              </li>
              <li class="list-group-item">
                <i class="bi bi-check-circle-fill text-success me-2"></i> Totalmente offline
              </li>
            </ul>
          </div>

          <!-- Cómo usar -->
          <div class="col-md-6 mb-4">
            <h3>¿Cómo usarla?</h3>
            <ol class="list-group list-group-numbered">
              <li class="list-group-item">Ingresa a la sección "Agregar incidente"</li>
              <li class="list-group-item">Completa los campos obligatorios</li>
              <li class="list-group-item">Guarda el nuevo incidente</li>
              <li class="list-group-item">Ve a "Lista de incidentes" y exporta como PDF</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilos personalizados si deseas */
.list-group-item i {
  font-size: 1.1rem;
}
</style>
