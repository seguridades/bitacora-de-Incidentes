<template>
  <footer class="bg-dark text-white text-center py-3 mt-auto">
    <div class="container d-flex flex-wrap justify-content-center align-items-center">
      <!-- Licencia -->
      <p class="mb-0 small d-flex align-items-center me-3">
        {{ new Date().getFullYear() }} Bitácora de Incidentes —
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          class="text-white text-decoration-none ms-1"
        >
          <small>Creative Commons BY 4.0</small>
        </a>
      </p>

      <!-- Redes sociales -->
      <div class="d-flex gap-3">
        <a href="https://github.com/TU_USUARIO" target="_blank" class="text-white">
          <i class="bi bi-github fs-5"></i>
          <span class="visually-hidden">GitHub</span>
        </a>
        <a href="https://instagram.com/tu.usuario" target="_blank" class="text-white">
          <i class="bi bi-instagram fs-5"></i>
          <span class="visually-hidden">Instagram</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup></script>
