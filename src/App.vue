<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <Navbar />
  <router-view />
  <FooterBar />
</template>
