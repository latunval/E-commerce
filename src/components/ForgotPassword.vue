<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Forgot Password</h2>
      <p class="subtitle">Enter your email to reset your password</p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="your@email.com"
            :class="{ 'is-invalid': error }"
          />
          <span class="error-message" v-if="error">{{ error }}</span>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting"> <i class="fas fa-spinner fa-spin"></i> Sending... </span>
          <span v-else>Send Reset Link</span>
        </button>
        <p class="toggle-account mt-3">
          <router-link to="/login">Back to Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      error: '',
      isSubmitting: false,
    }
  },
  methods: {
    submitForm() {
      this.error = ''
      if (!this.email) {
        this.error = 'Email is required'
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.error = 'Please enter a valid email'
        return
      }
      this.isSubmitting = true
      setTimeout(() => {
        // Simulate email check and reset
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find((u) => u.email === this.email)
        if (!user) {
          this.error = 'No account found with this email'
        } else {
          window.showToast('A password reset link would be sent to your email!', 'success')
          this.$router.push('/login')
        }
        this.isSubmitting = false
      }, 1200)
    },
  },
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}
.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}
h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 8px;
  text-align: center;
}
.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
}
.form-group {
  margin-bottom: 20px;
  position: relative;
}
label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}
input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
input.is-invalid {
  border-color: #e74c3c;
}
.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background-color: #3498db;
  color: white;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
.toggle-account {
  text-align: center;
  color: #7f8c8d;
  margin-top: 20px;
}
.toggle-account a {
  color: #3498db;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
}
.toggle-account a:hover {
  text-decoration: underline;
}
@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
}
</style>
