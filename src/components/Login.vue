<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Welcome Back' : 'Create Your Account' }}</h2>
      <p class="subtitle">
        {{ isLogin ? 'Login to continue shopping' : 'Join Elysian Fashion Hub' }}
      </p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="your@email.com"
            :class="{ 'is-invalid': errors.email }"
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            :class="{ 'is-invalid': errors.password }"
          />
          <span class="password-toggle" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
          </span>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group" v-if="!isLogin">
          <label>Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Your full name"
            :class="{ 'is-invalid': errors.name }"
          />
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group" v-if="!isLogin">
          <label>Phone Number</label>
          <div style="display: flex; gap: 10px">
            <select v-model="form.countryCode" required>
              <option value="+234">🇳🇬 +234</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <!-- Add more as needed -->
            </select>
            <input
              v-model="form.phone"
              type="tel"
              required
              placeholder="8123456789"
              :class="{ 'is-invalid': errors.phone }"
            />
          </div>
          <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember Me</span>
          </label>
          <router-link to="/forgot-password" v-if="isLogin" class="forgot-password">
            Forgot Password?
          </router-link>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting"> <i class="fas fa-spinner fa-spin"></i> Processing... </span>
          <span v-else>
            {{ isLogin ? 'Login' : 'Sign Up' }}
          </span>
        </button>

        <div class="social-login" v-if="isLogin">
          <div class="divider">or continue with</div>
          <div class="social-buttons">
            <button type="button" class="social-btn google" @click="socialLogin('google')">
              <i class="fab fa-google"></i> Google
            </button>
            <button type="button" class="social-btn facebook" @click="socialLogin('facebook')">
              <i class="fab fa-facebook-f"></i> Facebook
            </button>
          </div>
        </div>

        <p class="toggle-account">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <span @click="toggleAuthMode">
            {{ isLogin ? 'Sign Up' : 'Login' }}
          </span>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      rememberMe: false,
      showPassword: false,
      isSubmitting: false,
      form: {
        email: '',
        password: '',
        name: '',
        phone: '',
        countryCode: '+234',
      },
      errors: {
        email: '',
        password: '',
        name: '',
        phone: ''
      },
    }
  },
  mounted() {
    this.checkExistingSession()
  },
  methods: {
    checkExistingSession() {
      const user = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser')
      if (user) {
        this.$router.push('/')
      }
    },

    toggleAuthMode() {
      this.isLogin = !this.isLogin
      this.resetForm()
    },

    resetForm() {
      this.form = {
        email: this.form.email,
        password: '',
        name: '',
        phone: '',
        countryCode: '+234',
      }
      this.errors = {
        email: '',
        password: '',
        name: '',
        phone: ''
      }
    },

    validateForm() {
      let isValid = true
      this.errors = { email: '', password: '', name: '', phone: '' }

      if (!this.form.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
        isValid = false
      }

      if (!this.form.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      if (!this.isLogin && !this.form.name.trim()) {
        this.errors.name = 'Full name is required'
        isValid = false
      }

      if (!this.isLogin && !this.form.phone.trim()) {
        this.errors.phone = 'Phone number is required'
        isValid = false
      }

      return isValid
    },

    async submitForm() {
      if (!this.validateForm()) return
      this.isSubmitting = true

      try {
        if (this.isLogin) {
          await this.handleLogin()
        } else {
          await this.handleSignup()
        }
      } catch (error) {
        window.showToast(error.message || 'An error occurred. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },

    async handleLogin() {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('users') || '[]');
      } catch (e) {
        users = [];
      }
      const user = users.find(
        u => u.email === this.form.email && u.password === this.form.password
      )
      if (!user) throw new Error('Invalid email or password')
      // Prevent normal users from logging in as admin
      if (user.email === 'valentino@gmail.com') {
        if (this.form.email !== 'valentino@gmail.com' || this.form.password !== user.password) {
          throw new Error('Unauthorized admin access')
        }
        this.saveUserSession(user)
        window.showToast('Admin logged in!', 'success')
        this.$router.push('/admin')
        return
      }
      // Prevent admin from logging in as user
      if (this.form.email === 'valentino@gmail.com') {
        throw new Error('Unauthorized admin access')
      }
      this.saveUserSession(user)
      window.showToast('Logged in successfully!', 'success')
      this.$router.push('/')
    },

    async handleSignup() {
      let users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.some(u => u.email === this.form.email)) throw new Error('Email already in use')
      const newUser = {
        id: Date.now().toString(),
        ...this.form,
        createdAt: new Date().toISOString()
      }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      this.saveUserSession(newUser)
      window.showToast('Account created successfully!', 'success')
      this.$router.push('/')
    },

    saveUserSession(user) {
      const storage = this.rememberMe ? localStorage : sessionStorage
      storage.setItem('loggedInUser', JSON.stringify(user))
    },

    socialLogin(provider) {
      window.showToast(`${provider} login would be implemented here`, 'info')
    }
  }
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

.password-toggle {
  position: absolute;
  right: 15px;
  top: 40px;
  cursor: pointer;
  color: #7f8c8d;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  width: auto;
  margin-right: 8px;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
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

.social-login {
  margin: 25px 0;
}

.divider {
  display: flex;
  align-items: center;
  color: #7f8c8d;
  margin: 20px 0;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider::before {
  margin-right: 10px;
}

.divider::after {
  margin-left: 10px;
}

.social-buttons {
  display: flex;
  gap: 10px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  background: #f8f9fa;
}

.social-btn.google {
  color: #db4437;
}

.social-btn.facebook {
  color: #4267b2;
}

.toggle-account {
  text-align: center;
  color: #7f8c8d;
  margin-top: 20px;
}

.toggle-account span {
  color: #3498db;
  cursor: pointer;
  font-weight: 500;
}

.toggle-account span:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .social-buttons {
    flex-direction: column;
  }
}
</style>
