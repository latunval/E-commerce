<template>
  <div class="user-dashboard">
    <h2>👤 Welcome, {{ user.name }}</h2>
    <p><strong>Email:</strong> {{ user.email }}</p>

    <h3 class="mt-4">📦 My Orders</h3>
    <div v-if="orders.length === 0">
      <p>You have not placed any orders yet.</p>
    </div>

    <div v-else class="orders">
      <div v-for="(order, i) in orders" :key="order.id" class="order-card">
        <h4>Order #{{ order.id }}</h4>
        <p><strong>Date:</strong> {{ formatDate(order.placedAt) }}</p>
        <p><strong>Status:</strong>
          <span :class="'status-' + order.status">{{ orderStatus(order.status) }}</span>
        </p>
        <p><strong>Total:</strong> ₦{{ order.total }}</p>

        <div v-if="order.payment?.proofUrl">
          <p><strong>Payment Proof:</strong></p>
          <img
            v-if="isImage(order.payment.proofUrl)"
            :src="order.payment.proofUrl"
            class="proof-img"
            @click="openModal(order.payment.proofUrl)"
          />
          <a v-else :href="order.payment.proofUrl" target="_blank">View Document</a>
        </div>

        <div v-else-if="order.status === 'pending'" class="upload-section">
          <label><strong>Upload Payment Proof:</strong></label>
          <input type="file" @change="uploadProof($event, order.id)" />
        </div>

        <div v-if="order.status === 'payment_failed'" class="retry-box">
          <p class="error">Payment was rejected. Reason: {{ order.rejectionReason || 'Not provided' }}</p>
          <label>Re-upload Payment Proof:</label>
          <input type="file" @change="uploadProof($event, order.id)" />
        </div>
      </div>
    </div>

    <!-- Modal Preview -->
    <div v-if="showImageModal" class="image-modal" @click.self="showImageModal = false">
      <div class="modal-content">
        <img :src="modalImageUrl" />
        <button class="close-modal" @click="showImageModal = false">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      orders: [],
      showImageModal: false,
      modalImageUrl: ''
    }
  },
  mounted() {
    const stored = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser')
    if (!stored) {
      this.$router.push('/login')
      return
    }

    this.user = JSON.parse(stored)
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    this.orders = allOrders.filter(o => o.customer.email === this.user.email)
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|webp|gif)$/i.test(url)
    },
    openModal(url) {
      this.modalImageUrl = url
      this.showImageModal = true
    },
    orderStatus(code) {
      const map = {
        pending: 'Pending',
        processing: 'Verified',
        payment_failed: 'Rejected'
      }
      return map[code] || code
    },
    uploadProof(event, orderId) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const url = reader.result
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const index = allOrders.findIndex(o => o.id === orderId)
        if (index !== -1) {
          allOrders[index].payment = { ...allOrders[index].payment, proofUrl: url }
          allOrders[index].status = 'pending'
          delete allOrders[index].verifiedAt
          delete allOrders[index].verifiedBy
          delete allOrders[index].rejectionReason
          localStorage.setItem('orders', JSON.stringify(allOrders))
          this.orders = allOrders.filter(o => o.customer.email === this.user.email)
          alert('Payment proof uploaded successfully. Please wait for verification.')
        }
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
.user-dashboard {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.orders {
  margin-top: 20px;
}
.order-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}
.proof-img {
  max-width: 100px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.upload-section,
.retry-box {
  margin-top: 10px;
}
.retry-box .error {
  color: #d32f2f;
}
.status-pending {
  color: #ff9800;
}
.status-processing {
  color: #4caf50;
}
.status-payment_failed {
  color: #f44336;
}
.image-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  position: relative;
}
.modal-content img {
  max-width: 90vw;
  max-height: 80vh;
}
.close-modal {
  position: absolute;
  top: -30px;
  right: 0;
  background: white;
  border: none;
  font-size: 20px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
