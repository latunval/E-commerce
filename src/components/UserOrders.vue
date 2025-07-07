<template>
  <div class="user-orders">
    <h2>Your Orders</h2>

    <div v-if="orders.length === 0">
      <p>No orders yet.</p>
    </div>

    <div v-else class="orders-list">
      <div v-for="(order, index) in orders" :key="index" class="order-card">
        <div class="order-header">
          <h4>Order #{{ index + 1 }}</h4>
          <span class="badge" :class="order.status">{{ order.status }}</span>
        </div>

        <p><strong>Date:</strong> {{ new Date(order.placedAt).toLocaleString() }}</p>
        <p><strong>Total:</strong> ₦{{ order.total }}</p>

        <button class="btn btn-sm btn-primary" @click="viewDetails(order)">View Details</button>

        <button
          v-if="order.status === 'approved'"
          class="btn btn-sm btn-outline-success"
          @click="downloadInvoice(order)"
        >
          Download Invoice
        </button>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="order-modal">
      <div class="modal-content">
        <h3>Order Details</h3>
        <p><strong>Name:</strong> {{ selectedOrder.shippingInfo.name }}</p>
        <p><strong>Email:</strong> {{ selectedOrder.shippingInfo.email }}</p>
        <p><strong>Phone:</strong> {{ selectedOrder.shippingInfo.phone }}</p>
        <p><strong>Address:</strong> {{ selectedOrder.shippingInfo.address }}</p>
        <p><strong>Status:</strong> {{ selectedOrder.status }}</p>

        <h4>Items</h4>
        <ul>
          <li v-for="item in selectedOrder.items" :key="item.id">
            {{ item.name }} × {{ item.quantity }} — ₦{{ (item.price * item.quantity).toFixed(2) }}
          </li>
        </ul>

        <p><strong>Payment:</strong> {{ selectedOrder.paymentInfo.method }}</p>

        <div v-if="selectedOrder.proofUrl">
          <p><strong>Proof of Payment:</strong></p>
          <img :src="selectedOrder.proofUrl" alt="Proof" class="proof-img" />
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline-secondary" @click="selectedOrder = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      selectedOrder: null,
    }
  },
  mounted() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null')
    this.orders = allOrders.filter((o) => o.customer?.email === user?.email)
  },
  methods: {
    viewDetails(order) {
      this.selectedOrder = order
    },
    downloadInvoice(order) {
      const content = `
        Order Invoice
        -------------------
        Name: ${order.shippingInfo.name}
        Email: ${order.shippingInfo.email}
        Phone: ${order.shippingInfo.phone}
        Address: ${order.shippingInfo.address}
        Status: ${order.status}

        Items:
        ${order.items
          .map(
            (item) =>
              `${item.name} × ${item.quantity} — ₦${(item.price * item.quantity).toFixed(2)}`
          )
          .join('\n')}

        Total: ₦${order.total}
      `

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `order-invoice-${Date.now()}.txt`
      link.click()
    },
  },
}
</script>

<style scoped>
.user-orders {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}
.order-card {
  background: white;
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: capitalize;
}
.badge.pending {
  background: orange;
  color: white;
}
.badge.approved {
  background: green;
  color: white;
}
.badge.rejected {
  background: crimson;
  color: white;
}
.order-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  max-width: 500px;
  padding: 20px;
  border-radius: 10px;
}
.proof-img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-top: 10px;
}
.modal-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
