<template>
  <div>
    <div class="wishlist-page">
      <h2>❤️ My Wishlist</h2>

      <div v-if="wishlist.length === 0">
        <p>Your wishlist is empty.</p>
        <router-link to="/" class="btn btn-primary mt-2">Back to Shop</router-link>
      </div>

      <div v-else class="wishlist-list">
        <div class="wishlist-item" v-for="(item, index) in wishlist" :key="item.id">
          <img :src="item.image" :alt="item.name" />
          <div class="info">
            <h4>{{ item.name }}</h4>
            <p>₦{{ item.price }}</p>

            <div class="actions">
              <button class="btn btn-sm btn-success" @click="moveToCart(index)">
                🛒 Add to Cart
              </button>
              <button class="btn btn-sm btn-danger" @click="removeItem(index)">
                ❌ Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '../components/NavBar.vue'

export default {
  components: {
    navBar,
  },
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
    moveToCart(index) {
      const item = this.wishlist[index]
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')

      // Check if already in cart
      const found = cart.find(c => c.id === item.id)
      if (found) {
        found.quantity += item.quantity || 1
      } else {
        cart.push({ ...item, quantity: 1 })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      this.removeItem(index)
      alert('Item moved to cart!')
    },
    removeItem(index) {
      this.wishlist.splice(index, 1)
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist))
    },
  }
}
</script>

<style scoped>
.wishlist-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.wishlist-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.wishlist-item {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
}
.wishlist-item img {
  width: 100px;
  height: auto;
  border-radius: 8px;
}
.info {
  flex: 1;
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
