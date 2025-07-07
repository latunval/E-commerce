<template>
  <div class="order-management">
    <h2>📦 Order Management (Admin)</h2>

    <div v-if="!orders.length">No orders found.</div>

    <div v-for="(order, index) in orders" :key="order.id" class="order-card">
      <h4>Order #{{ index + 1 }} - {{ order.status.toUpperCase() }}</h4>
      <p><strong>Name:</strong> {{ order.customer.name }}</p>
      <p><strong>Email:</strong> {{ order.customer.email }}</p>
      <p><strong>Phone:</strong> {{ order.shippingInfo.phone }}</p>
      <p><strong>Address:</strong> {{ order.shippingInfo.address }}</p>
      <p><strong>Total:</strong> ₦{{ order.total }}</p>
      <p><strong>Placed At:</strong> {{ new Date(order.placedAt).toLocaleString() }}</p>

      <div v-if="order.payment?.proofUrl">
        <p><strong>Proof of Payment:</strong></p>
        <img :src="order.payment.proofUrl" alt="proof" class="proof-img" />
      </div>

      <div class="action-buttons">
        <button class="btn-approve" @click="updateStatus(order.id, 'approved')">Approve</button>
        <button class="btn-reject" @click="updateStatus(order.id, 'rejected')">Reject</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
    }
  },
  mounted() {
    const stored = localStorage.getItem('orders')
    const allOrders = stored ? JSON.parse(stored) : []
    // Support both 'items' and 'cart' for backward compatibility
    this.orders = allOrders.map((order) => ({
      ...order,
      items: order.items || order.cart || [],
      status:
        order.status ||
        (order.payment?.status === 'approved'
          ? 'approved'
          : order.payment?.status === 'rejected'
            ? 'rejected'
            : 'pending'),
      total:
        order.total ||
        (order.subtotal && order.shippingFee
          ? Number(order.subtotal) + Number(order.shippingFee)
          : 0),
    }))
  },
  methods: {
    updateStatus(orderId, newStatus) {
      const idx = this.orders.findIndex((o) => o.id === orderId)
      if (idx !== -1) {
        this.orders[idx].status = newStatus
        localStorage.setItem('orders', JSON.stringify(this.orders))
        window.showToast(`Order marked as ${newStatus}`)
      }
    },
  },
}
</script>

<style scoped>
.order-management {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.order-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background: #fafafa;
}
.proof-img {
  max-width: 300px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.btn-approve {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-reject {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
