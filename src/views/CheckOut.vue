<template>
  <div class="checkout-page">
    <h2>🧾 Checkout</h2>

    <form @submit.prevent="placeOrder">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <input v-model="form.phone" type="tel" required />
      </div>

      <div class="form-group">
        <label>Delivery Address</label>
        <textarea v-model="form.address" rows="3" required></textarea>
      </div>

      <div class="summary">
        <p>Total Items: {{ cart.length }}</p>
        <p>Total Price: ₦{{ totalPrice }}</p>
      </div>

      <button type="submit" class="btn btn-success">Place Order</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      form: {
        name: '',
        email: '',
        phone: '',
        address: ''
      }
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  },
  mounted() {
    const storedCart = localStorage.getItem('cart')
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  const user = localStorage.getItem('loggedInUser')
  if (!user) {
    alert('Please log in to proceed to checkout.')
    this.$router.push('/login')
  }
  // Load cart normally...


  },
  methods: {
    placeOrder() {
      if (!this.cart.length) {
        alert('Your cart is empty.')
        return
      }

      const order = {
        customer: this.form,
        items: this.cart,
        total: this.totalPrice,
        placedAt: new Date().toISOString()
      }

      console.log('✅ Order Placed:', order)

      localStorage.removeItem('cart') // Clear cart
      alert('🎉 Order placed successfully!')

      this.$router.push('/') // Go back to home or a success page
    }
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 16px;
}
input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.summary {
  margin: 20px 0;
  font-weight: 500;
}
</style>
