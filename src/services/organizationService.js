export default {
  getOrganization() {
    const storedOrg = localStorage.getItem('organization')
    if (storedOrg) {
      try {
        return JSON.parse(storedOrg)
      } catch (e) {
        console.error('Error al leer organización:', e)
      }
    }
    return {}
  },
}
