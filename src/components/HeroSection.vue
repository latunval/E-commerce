<template>
  <section class="hero-section d-flex align-items-center justify-content-center text-center">
    <div class="hero-content">
      <h1 class="display-4 fw-bold mb-3">Welcome to Elysian Hub</h1>
      <p class="lead mb-4">
        Discover the best deals on clothes, jewelry, and perfume. Shop the latest trends and enjoy
        fast delivery!
      </p>
      <router-link to="/product" class="btn btn-primary btn-lg">Shop Now</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
}
</script>

<style scoped>
.hero-section {
  min-height: 380px;
  background:
    linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%),
    url('/image/jalab-1.jpg') center/cover no-repeat;
  color: #222;
  position: relative;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
}
.hero-content {
  background: rgba(255, 255, 255, 0.85);
  padding: 2.5rem 2rem;
  border-radius: 18px;
  display: inline-block;
  max-width: 600px;
}
@media (max-width: 600px) {
  .hero-section {
    min-height: 220px;
    border-radius: 0 0 18px 18px;
  }
  .hero-content {
    padding: 1.2rem 0.5rem;
  }
}
</style>
