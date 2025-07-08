<template>
  <div id="app">
    <!-- <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view> -->
<RouterView />
    <!-- GLOBAL LOADER -->
    <div v-if="loading" class="overlay">
      <div class="spinner-border text-light" role="status"></div>
    </div>

    <!-- GLOBAL TOAST -->
    <div
      v-if="toast.message"
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 9999"
    >
      <div class="toast show align-items-center text-white bg-success border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="toast.message = ''"
          ></button>
        </div>
      </div>
    </div>
  </div>
  <footers />
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      toast: {
        message: '',
      },
    }
  },
  watch: {
    $route() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
  },
  created() {
    // Global toast function (can be called from anywhere)
    window.showToast = (msg) => {
      this.toast.message = msg
      setTimeout(() => {
        this.toast.message = ''
      }, 3000)
    }
  },
}
</script>

<style scoped>
/* Loader Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
