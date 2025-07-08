<template>
  <div>
    <nav-bar />
    <hero-section />
    <card />
  </div>
</template>

<script>
import navBar from '../components/NavBar.vue'
import heroSection from '../components/HeroSection.vue'
import card from '../components/CardItem.vue'
export default {
  components: { navBar, heroSection, card },
}
</script>

<style scoped></style>
