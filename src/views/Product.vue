<template>
  <div>
    <nav-bar />
    <cloth />
  </div>
</template>

<script>
import navBar from '../components/NavBar.vue'
import cloth from '../components/Clothes.vue'
export default {
  components: { navBar, cloth },
}
</script>

<style scoped></style>
