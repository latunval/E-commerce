<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- GLOBAL LOADER -->
    <div v-if="loading" class="overlay">
      <div class="spinner-border text-light" role="status"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  watch: {
    $route() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 600) // simulate fade delay
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
