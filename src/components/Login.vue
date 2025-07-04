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

      <button type="submit" class="btn btn-primary">
        {{ isLogin ? 'Login' : 'Sign Up' }}
      </button>

      <p class="toggle">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
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
      form: {
        email: '',
        password: '',
        name: ''
      }
    }
  },
  methods: {
    submitForm() {
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      if (this.isLogin) {
        const user = users.find(u => u.email === this.form.email && u.password === this.form.password)
        if (!user) {
          alert('Invalid email or password')
          return
        }
        localStorage.setItem('loggedInUser', JSON.stringify(user))
        alert('Logged in successfully')
        this.$router.push('/')
      } else {
        if (users.find(u => u.email === this.form.email)) {
          alert('Email already in use')
          return
        }
        const newUser = { ...this.form }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('loggedInUser', JSON.stringify(newUser))
        alert('Account created and logged in!')
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
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.toggle {
  margin-top: 14px;
  font-size: 0.9rem;
}
.toggle span {
  color: blue;
  cursor: pointer;
  margin-left: 6px;
}
</style>
