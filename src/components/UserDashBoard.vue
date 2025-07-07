<template>
  <div class="user-account">
    <h2>🧾 My Orders</h2>

    <div class="controls">
      <label>Status:
        <select v-model="selectedStatus">
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
      </label>
    </div>

    <div v-if="filteredOrders.length === 0" class="empty-msg">
      <p>No orders found.</p>
    </div>

    <div v-else class="order-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h4>Order #{{ order.id }}</h4>
          <span :class="['status', order.status]">
            {{ order.status.toUpperCase() }}
          </span>
        </div>

        <p><strong>Placed At:</strong> {{ new Date(order.placedAt).toLocaleString() }}</p>

        <div class="items">
          <div v-for="item in order.items" :key="item.id" class="item">
            <img :src="item.image" :alt="item.name" />
            <div>
              <p>{{ item.name }}</p>
              <p>Qty: {{ item.quantity }}</p>
              <p>₦{{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <p><strong>Total:</strong> ₦{{ order.total }}</p>

        <div v-if="order.status === 'approved'" class="action-row">
          <button class="btn btn-outline" @click="printInvoice(order)">
            🖨️ Download Invoice
          </button>
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
      selectedStatus: 'all'
    }
  },
  computed: {
    filteredOrders() {
      if (this.selectedStatus === 'all') return this.orders
      return this.orders.filter(order => order.status === this.selectedStatus)
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {}
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    // Support both 'items' and 'cart' for backward compatibility
    this.orders = allOrders.filter(order => order.customer.email === user.email).map(order => ({
      ...order,
      items: order.items || order.cart || [],
      status: order.status || (order.payment?.status === 'approved' ? 'approved' : (order.payment?.status === 'rejected' ? 'rejected' : 'pending')),
      total: order.total || order.subtotal + order.shippingFee || 0
    }))
  },
  methods: {
    printInvoice(order) {
      const printContent = `
        <div>
          <h2>Invoice for Order #${order.id}</h2>
          <p><strong>Name:</strong> ${order.customer.name}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <p><strong>Address:</strong> ${order.shippingInfo.address}</p>
          <p><strong>Phone:</strong> ${order.shippingInfo.phone}</p>
          <hr />
          <h4>Items:</h4>
          ${order.items
            .map(
              item => `
              <div style="margin-bottom: 10px">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₦${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `
            )
            .join('')}
          <hr />
          <p><strong>Total:</strong> ₦${order.total}</p>
        </div>
      `
      const win = window.open('', '', 'width=800,height=600')
      win.document.write(`
        <html>
          <head>
            <title>Invoice</title>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      win.document.close()
      win.print()
    }
  }
}
</script>

<style scoped>
.user-account {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.controls {
  margin-bottom: 20px;
}
.empty-msg {
  text-align: center;
  margin-top: 50px;
  color: gray;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.order-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  font-size: 0.9em;
  font-weight: bold;
}
.status.approved {
  background: #d4edda;
  color: #155724;
}
.status.rejected {
  background: #f8d7da;
  color: #721c24;
}
.status.pending {
  background: #fff3cd;
  color: #856404;
}
.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin: 15px 0;
}
.item {
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
.action-row {
  margin-top: 15px;
  text-align: right;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-outline {
  background: transparent;
  border: 1px solid #4CAF50;
  color: #4CAF50;
}
</style>
