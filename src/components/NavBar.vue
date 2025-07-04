<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand logoText" to="/">ELYSIAN</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'product' }">Products</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/cart">🛒 Cart</router-link>
          </li>

          <li class="nav-item" v-if="user">
            <span class="nav-link">👤 Welcome, {{ user.name }}</span>
          </li>

          <li class="nav-item" v-if="!user">
            <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
          </li>

          <li class="nav-item" v-if="user">
            <button @click="logout" class="btn btn-sm btn-outline-danger ms-2">Logout</button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('loggedInUser')
    this.user = storedUser ? JSON.parse(storedUser) : null
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser')
      this.user = null
      this.$router.push('/') // Navigate home after logout
    }
  }
}
</script>

<style scoped>
.logoText {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
}
.navbar-nav .nav-link {
  margin-right: 10px;
}
</style>
