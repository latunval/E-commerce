<template>
  <nav-bar />
  <div class="cart-page">
    <h2>🛒 Your Cart</h2>

    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
      <router-link to="/" class="btn btn-primary mt-2">Back to Shop</router-link>
    </div>

    <div v-else>
      <div class="cart-item" v-for="(item, index) in cart" :key="item.id">
        <img :src="item.image" :alt="item.name" />
        <div class="info">
          <h4>{{ item.name }}</h4>
          <p>₦{{ item.price }} x {{ item.quantity }} = ₦{{ item.price * item.quantity }}</p>

          <label>
            Quantity:
            <input type="number" v-model.number="item.quantity" @change="updateCart" min="1" />
          </label>

          <button class="btn btn-sm btn-danger" @click="removeItem(index)">Remove</button>
        </div>
      </div>

      <div class="summary">
        <h3>Total: ₦{{ totalPrice }}</h3>
        <router-link to="/checkout" class="btn btn-success">Proceed to Checkout</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    },
  },
  mounted() {
    const storedCart = localStorage.getItem('cart')
    this.cart = storedCart ? JSON.parse(storedCart) : []
  },
  methods: {
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    removeItem(index) {
      this.cart.splice(index, 1)
      this.updateCart()
    },
  },
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #ddd;
  padding: 12px 0;
}
.cart-item img {
  width: 100px;
  height: auto;
  border-radius: 8px;
}
.info {
  flex: 1;
}
input[type='number'] {
  width: 60px;
  margin-left: 8px;
}
.summary {
  text-align: right;
  margin-top: 20px;
}
</style>
