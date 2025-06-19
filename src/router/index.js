import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import IncidentList from '@/views/IncidentList.vue'
import AddIncident from '@/views/AddIncident.vue'
import OrgSettings from '@/views/OrgSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/incidentes', component: IncidentList },
    { path: '/agregar', component: AddIncident },
    { path: '/configuracion', component: OrgSettings },
    {
      path: '/incidente/:id',
      name: 'IncidentDetail',
      component: () => import('@/views/IncidentDetailView.vue'),
    },
    {
      path: '/editar/:id',
      name: 'EditIncident',
      component: () => import('@/views/EditIncidentView.vue'),
    },
  ],
})

export default router
