<template>
  <div class="thank-you-page">
    <h2>🎉 Thank You for Your Order!</h2>
    <p>Your order has been placed successfully.</p>

    <div class="summary">
      <p><strong>Order ID:</strong> {{ orderId }}</p>
      <p><strong>Date:</strong> {{ orderDate }}</p>
      <p><strong>Total:</strong> ₦{{ order?.total }}</p>

      <router-link :to="`/invoice/${orderId}`" class="btn btn-outline-dark mt-3">
        🧾 View/Print Invoice
      </router-link>
    </div>

    <div class="links mt-4">
      <router-link to="/" class="btn btn-primary">🏠 Go to Home</router-link>
      <router-link to="/account" class="btn btn-secondary">📦 My Orders</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      order: null
    }
  },
  computed: {
    orderDate() {
      if (!this.order?.placedAt) return ''
      return new Date(this.order.placedAt).toLocaleString()
    }
  },
  mounted() {
    this.orderId = localStorage.getItem('lastOrderId')
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    this.order = orders.find((_, i) => i.toString() === this.orderId)
  }
}
</script>

<style scoped>
.thank-you-page {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  text-align: center;
}
.summary {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}
.links .btn {
  margin: 0 10px;
}
</style>
