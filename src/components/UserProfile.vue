// UserProfile.vue
<template>
  <div class="user-profile">
    <h2>👤 My Profile</h2>
    <div v-if="user">
      <div class="profile-info">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Joined:</strong> {{ formatDate(user.createdAt) }}</p>
      </div>

      <button class="btn btn-logout" @click="logout">Logout</button>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
      <router-link to="/login">Login here</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const stored = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser')
    this.user = stored ? JSON.parse(stored) : null
  },
  methods: {
    logout() {
      localStorage.removeItem('loggedInUser')
      sessionStorage.removeItem('loggedInUser')
      window.showToast('Logged out successfully.')
      this.$router.push('/login')
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 500px;
  margin: auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
}

.profile-info p {
  font-size: 1rem;
  margin-bottom: 10px;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
