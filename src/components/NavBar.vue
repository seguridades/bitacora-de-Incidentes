<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary-custom">
    <div class="container-fluid">
      <!-- Icono + Título + Beta -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <i class="bi bi-shield-exclamation me-2 fs-4"></i>
        Bitácora de Incidentes
        <span class="beta-tag ms-2 d-flex align-items-center">
          <i class="bi bi-flask me-1"></i>
          <span>Beta</span>
        </span>
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/incidentes" class="nav-link">Lista de incidentes</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/agregar" class="nav-link">Agregar incidente</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/configuracion" class="nav-link">Configuración</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
