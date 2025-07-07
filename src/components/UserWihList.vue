<!-- UserWishlist.vue -->
<template>
  <div class="user-wishlist">
    <h2>❤️ My Wishlist</h2>

    <div v-if="wishlist.length" class="wishlist-grid">
      <div v-for="item in wishlist" :key="item.id" class="wishlist-item">
        <img :src="item.image" :alt="item.name" />
        <h4>{{ item.name }}</h4>
        <p>₦{{ item.price }}</p>
        <button class="btn btn-danger" @click="removeFromWishlist(item.id)">Remove</button>
        <button class="btn btn-primary" @click="addToCart(item)">Add to Cart</button>
      </div>
    </div>
    <p v-else class="empty">No items in your wishlist.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wishlist: [],
    }
  },
  mounted() {
    const stored = localStorage.getItem('wishlist')
    this.wishlist = stored ? JSON.parse(stored) : []
  },
  methods: {
    removeFromWishlist(id) {
      this.wishlist = this.wishlist.filter((item) => item.id !== id)
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist))
    },
    addToCart(item) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existing = cart.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity++
      } else {
        cart.push({ ...item, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      window.showToast(`${item.name} added to cart!`)
    },
  },
}
</script>

<style scoped>
.user-wishlist {
  padding: 20px;
}
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}
.wishlist-item {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}
.wishlist-item img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
}
.empty {
  margin-top: 20px;
  color: #888;
}
</style>
