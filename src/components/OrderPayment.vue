<template>
  <div class="order-management">
    <h2>Order Management</h2>
    
    <div class="filters">
      <select v-model="filterStatus" class="form-control">
        <option value="all">All Orders</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input v-model="searchQuery" placeholder="Search orders..." class="form-control">
    </div>

    <div class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h4>Order #{{ order.id }}</h4>
          <span :class="'status-' + order.status">{{ order.status }}</span>
        </div>
        
        <div class="order-details">
          <p><strong>Customer:</strong> {{ order.customer.name }}</p>
          <p><strong>Date:</strong> {{ formatDate(order.placedAt) }}</p>
          <p><strong>Total:</strong> ₦{{ order.total }}</p>
          <p><strong>Payment:</strong> {{ order.payment.method }} 
            <span v-if="order.payment.cryptoType">({{ order.payment.cryptoType }})</span>
            - <span :class="'payment-status-' + order.paymentStatus">
              {{ order.paymentStatus }}
            </span>
          </p>
        </div>

        <div class="order-items">
          <h5>Items ({{ order.items.length }})</h5>
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h6>{{ item.name }}</h6>
              <p>Qty: {{ item.quantity }} × ₦{{ item.price }}</p>
            </div>
          </div>
        </div>

        <div class="order-actions">
          <select v-model="order.newStatus" class="status-select" @change="updateOrderStatus(order)">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button @click="viewOrderDetails(order)" class="btn btn-sm">
            View Details
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
      filterStatus: 'all',
      searchQuery: ''
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders
      
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(o => o.status === this.filterStatus)
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query)
        )
      }
      
      return filtered.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    }
  },
  methods: {
    loadOrders() {
      // In a real app, this would be an API call
      const orders = JSON.parse(localStorage.getItem('orders') || []
      this.orders = orders.map(order => ({
        ...order,
        newStatus: order.status,
        paymentStatus: order.payment?.verified ? 'verified' : 
                      order.status === 'payment_failed' ? 'failed' : 'pending'
      }))
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString()
    },
    updateOrderStatus(order) {
      order.status = order.newStatus
      
      // Update in localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const index = orders.findIndex(o => o.id === order.id)
      if (index !== -1) {
        orders[index].status = order.status
        localStorage.setItem('orders', JSON.stringify(orders))
      }
    },
    viewOrderDetails(order) {
      // In a real app, navigate to order detail page
      console.log('Viewing order:', order)
      alert(`Order details for #${order.id} would show here`)
    }
  },
  mounted() {
    this.loadOrders()
  }
}
</script>

<style scoped>
.order-management {
  max-width: 1200px;
  margin: 0 auto;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.status-pending {
  color: #ff9800;
  font-weight: bold;
}
.status-processing {
  color: #2196f3;
  font-weight: bold;
}
.status-shipped {
  color: #673ab7;
  font-weight: bold;
}
.status-delivered {
  color: #4caf50;
  font-weight: bold;
}
.status-cancelled {
  color: #f44336;
  font-weight: bold;
}

.payment-status-verified {
  color: #4caf50;
}
.payment-status-pending {
  color: #ff9800;
}
.payment-status-failed {
  color: #f44336;
}

.order-details p {
  margin: 5px 0;
  font-size: 14px;
}

.order-items {
  margin: 15px 0;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.order-items h5 {
  margin-top: 0;
  margin-bottom: 10px;
}

.order-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details h6 {
  margin: 0;
  font-size: 14px;
}

.item-details p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
}

.order-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.status-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 13px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
</style>