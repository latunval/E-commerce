<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand logoText" to="/">ELYSIAN</router-link>

          <li class="nav-item" v-if="user">
            <span class="nav-link">👤 Welcome, {{ user.name }}</span>
          </li>
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

          <li class="nav-item position-relative">
            <router-link class="nav-link" to="/cart">
              🛒 Cart
              <span
                v-if="cartCount > 0"
                class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                style="font-size: 0.8rem"
              >
                {{ cartCount }}
              </span>
            </router-link>
          </li>

         
          <li class="nav-item" v-if="user">
            <router-link class="nav-link" to="/user-dash">View Details</router-link>
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
      user: null,
      cartCount: 0,
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('loggedInUser')
    this.user = storedUser ? JSON.parse(storedUser) : null
    this.updateCartCount()
    window.addEventListener('storage', this.updateCartCount)
    window.addEventListener('cart-updated', this.updateCartCount)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.updateCartCount)
    window.removeEventListener('cart-updated', this.updateCartCount)
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser')
      this.user = null
      this.$router.push('/') // Navigate home after logout
    },
    updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      this.cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    },
    notifyCartUpdate() {
      // Call this after cart changes anywhere in the app
      window.dispatchEvent(new Event('cart-updated'))
    },
  },
  watch: {
    // Watch for route changes to update cart count
    $route() {
      this.updateCartCount()
    },
  },
}
</script>

<style scoped>
.logoText {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
}
.nav-item{
  list-style-type: none;
}
.navbar-nav .nav-link {
  margin-right: 10px;
}
.badge {
  min-width: 1.5em;
  padding: 0.3em 0.5em;
}
.navbar {
  z-index: 1050;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
</style>
