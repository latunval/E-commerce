<template>
  <nav-bar />
  <div class="account-page">
    <h2>👤 My Account</h2>

    <p><strong>Name:</strong> {{ user.name }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>

    <h4 class="mt-4">🧾 Order History</h4>
    <ul v-if="orders.length">
      <li v-for="(order, i) in orders" :key="i" class="mb-3 p-2 border rounded bg-light">
        <div>
          <strong>Order #{{ i + 1 }}</strong>
        </div>
        <div>Total: ₦{{ order.total }}</div>
        <div>Items: {{ order.items.length }}</div>
        <div>Date: {{ formatDate(order.placedAt) }}</div>
        <div>Shipping To: {{ order.shippingInfo.name }}, {{ order.shippingInfo.address }}</div>
      </li>
    </ul>
    <p v-else>No orders yet.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      orders: [],
    }
  },
  mounted() {
    const stored = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser')

    if (!stored) {
      this.$router.push('/auth')
      return
    }

    this.user = JSON.parse(stored)

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    this.orders = allOrders.filter((o) => o.customer.email === this.user.email)
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },
  },
}
</script>

<style scoped>
.account-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
</style>
