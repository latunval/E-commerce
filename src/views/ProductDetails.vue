<template>
  <div v-if="product" class="details">
    <h2>{{ product.name }}</h2>
    <p><strong>Price:</strong> ₦{{ product.price }}</p>
    <img :src="product.image" :alt="product.name" />

    <p style="margin-top: 1rem">{{ product.description }}</p>

    <div v-if="product.moreImages && product.moreImages.length">
      <h4>More Images:</h4>
      <div class="gallery">
        <img v-for="(img, i) in product.moreImages" :key="i" :src="img" />
      </div>
    </div>

    <!-- Back to shop -->
    <router-link to="/product/:id" class="back-button">← Back to Shop</router-link>
  </div>

  <div v-else class="not-found">
    <h2>Product not found 😢</h2>
    <router-link to="/product" class="back-button">← Return to Shop</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null
    }
  },
  async mounted() {
    const response = await fetch('/product.json')
    const data = await response.json()

    // Combine all categories
    const allProducts = [
      ...(data.clothes || []),
      ...(data.jewelry || []),
      ...(data.perfume || [])
    ]

    const id = Number(this.$route.params.id)
    this.product = allProducts.find(p => p.id === id) || null
  }
}
</script>

<style scoped>
.details{
  border: 2px solid red;
  width: 50%;
  margin: 10px auto;
}
img {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 12px;
}
.gallery {
  display: flex;
  gap: 10px;
  margin: 12px auto;
  border: 2px solid red;
  width: 90%;
}
.gallery img {
  width: 200px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 14px;
  background: #eee;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.not-found {
  text-align: center;
  padding: 40px;
}
</style>
