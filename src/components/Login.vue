<template>
  <div class="auth-page">
    <h2>{{ isLogin ? 'Login' : 'Create Account' }}</h2>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" required />
      </div>

      <div class="form-group" v-if="!isLogin">
        <label>Full Name</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="rememberMe" />
          Remember Me
        </label>
      </div>

      <button type="submit" class="btn btn-primary w-100 mt-2">
        {{ isLogin ? 'Login' : 'Sign Up' }}
      </button>

      <p class="toggle text-center mt-3">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <span @click="isLogin = !isLogin">
          {{ isLogin ? 'Sign Up' : 'Login' }}
        </span>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true,
      rememberMe: false,
      form: {
        email: '',
        password: '',
        name: '',
      },
    }
  },
  mounted() {
    const already = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser')
    if (already) {
      this.$router.push('/') // redirect if already logged in
    }
  },
  methods: {
    submitForm() {
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      if (this.isLogin) {
        const user = users.find(
          u => u.email === this.form.email && u.password === this.form.password
        )

        if (!user) {
          window.showToast('❌ Invalid email or password')
          return
        }

        if (this.rememberMe) {
          localStorage.setItem('loggedInUser', JSON.stringify(user))
        } else {
          sessionStorage.setItem('loggedInUser', JSON.stringify(user))
        }

        window.showToast('✅ Logged in successfully!')
        this.$router.push('/')
      } else {
        if (users.find(u => u.email === this.form.email)) {
          window.showToast('⚠️ Email already in use')
          return
        }

        const newUser = { ...this.form }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        if (this.rememberMe) {
          localStorage.setItem('loggedInUser', JSON.stringify(newUser))
        } else {
          sessionStorage.setItem('loggedInUser', JSON.stringify(newUser))
        }

        window.showToast('🎉 Account created and logged in!')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 16px;
}
input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.toggle {
  font-size: 0.9rem;
}
.toggle span {
  color: blue;
  cursor: pointer;
  margin-left: 6px;
  text-decoration: underline;
}
</style>
