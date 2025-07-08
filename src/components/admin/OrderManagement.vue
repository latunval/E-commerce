<template>
  <div class="order-management">
    <h2>📦 Order Management</h2>

    <div class="filters">
      <select v-model="filterStatus" class="form-control">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="processing">Verified</option>
        <option value="payment_failed">Rejected</option>
      </select>
      <input v-model="searchQuery" class="form-control" placeholder="Search by customer or email..." />
    </div>

    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer.name }}</td>
            <td>{{ order.customer.email }}</td>
            <td>₦{{ order.total }}</td>
            <td><span :class="'badge status-' + order.status">{{ statusText(order.status) }}</span></td>
            <td>{{ formatDate(order.placedAt) }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="viewOrder(order)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="order-modal" @click.self="selectedOrder = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Order #{{ selectedOrder.id }} Details</h3>
          <button class="close-modal" @click="selectedOrder = null">×</button>
        </div>

        <div class="modal-body">
          <p><strong>Customer:</strong> {{ selectedOrder.customer.name }} ({{ selectedOrder.customer.email }})</p>
          <p><strong>Total:</strong> ₦{{ selectedOrder.total }}</p>
          <p><strong>Status:</strong> <span :class="'badge status-' + selectedOrder.status">{{ statusText(selectedOrder.status) }}</span></p>
          <p><strong>Placed At:</strong> {{ formatDate(selectedOrder.placedAt) }}</p>

          <h4>Shipping Info</h4>
          <p>
            {{ selectedOrder.shippingInfo.name }}<br />
            {{ selectedOrder.shippingInfo.address }}
          </p>

          <h4>Items</h4>
          <ul>
            <li v-for="item in selectedOrder.items" :key="item.id">
              {{ item.name }} - ₦{{ item.price }} × {{ item.quantity }}
            </li>
          </ul>

          <div v-if="selectedOrder.payment?.proofUrl">
            <h4>Payment Proof</h4>
            <img :src="selectedOrder.payment.proofUrl" class="proof-img" v-if="isImage(selectedOrder.payment.proofUrl)" />
            <a :href="selectedOrder.payment.proofUrl" target="_blank" v-else>View Document</a>
          </div>

          <div v-if="selectedOrder.status === 'payment_failed' && selectedOrder.rejectionReason">
            <p class="text-danger"><strong>Rejection Reason:</strong> {{ selectedOrder.rejectionReason }}</p>
          </div>
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
      filterStatus: 'all',
      searchQuery: ''
    }
  },
  computed: {
    filteredOrders() {
      let list = [...this.orders]

      if (this.filterStatus !== 'all') {
        list = list.filter(o => o.status === this.filterStatus)
      }

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(
          o =>
            o.customer.name.toLowerCase().includes(q) ||
            o.customer.email.toLowerCase().includes(q)
        )
      }

      return list.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    }
  },
  mounted() {
    const storedOrders = localStorage.getItem('orders') || '[]'
    this.orders = JSON.parse(storedOrders)
  },
  methods: {
    formatDate(str) {
      return new Date(str).toLocaleString()
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
    },
    statusText(status) {
      return {
        pending: 'Pending',
        processing: 'Verified',
        payment_failed: 'Rejected'
      }[status] || status
    },
    viewOrder(order) {
      this.selectedOrder = order
    }
  }
}
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.orders-table {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f4f6f8;
}

th, td {
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.status-pending {
  background: #ffeb3b;
  color: #333;
}
.status-processing {
  background: #4caf50;
  color: white;
}
.status-payment_failed {
  background: #f44336;
  color: white;
}

.order-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-modal {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.proof-img {
  max-width: 100px;
  margin-top: 10px;
  border: 1px solid #ccc;
}
</style>
