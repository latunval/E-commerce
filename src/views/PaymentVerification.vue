<template>
  <div class="payment-verification">
    <h2>Payment Verification</h2>

    <div class="filters">
      <select v-model="filterStatus" class="form-control">
        <option value="all">All Payments</option>
        <option value="pending">Pending</option>
        <option value="verified">Verified</option>
        <option value="rejected">Rejected</option>
      </select>
      <input v-model="searchQuery" placeholder="Search by order ID..." class="form-control" />
    </div>

    <div class="payments-list">
      <div v-for="payment in filteredPayments" :key="payment.id" class="payment-card">
        <div class="payment-header">
          <h4>Order #{{ payment.orderId }}</h4>
          <span :class="'status-' + payment.status">{{ payment.status }}</span>
        </div>

        <div class="payment-details">
          <p><strong>Customer:</strong> {{ payment.customerName }}</p>
          <p><strong>Method:</strong> {{ payment.method }}</p>
          <p v-if="payment.cryptoType"><strong>Crypto:</strong> {{ payment.cryptoType }}</p>
          <p><strong>Amount:</strong> ₦{{ payment.amount.toLocaleString() }}</p>
          <p><strong>Date:</strong> {{ formatDate(payment.date) }}</p>
        </div>

        <div class="proof-section">
          <h5>Payment Proof</h5>
          <div v-if="payment.proofUrl" class="proof-preview">
            <img
              v-if="isImage(payment.proofUrl)"
              :src="payment.proofUrl"
              @click="openModal(payment.proofUrl)"
              class="proof-image"
            />
            <a v-else :href="payment.proofUrl" target="_blank" class="document-link">View Document</a>
          </div>
          <p v-else>No proof uploaded</p>
        </div>

        <div class="payment-actions" v-if="payment.status === 'pending'">
          <button @click="verifyPayment(payment.id, true)" class="btn btn-success">Verify</button>
          <button @click="verifyPayment(payment.id, false)" class="btn btn-danger">Reject</button>
        </div>

        <div class="verification-info" v-if="payment.status !== 'pending'">
          <p><strong>Verified by:</strong> {{ payment.verifiedBy || 'System' }}</p>
          <p><strong>Verified at:</strong> {{ formatDate(payment.verifiedAt) }}</p>
          <p v-if="payment.rejectionReason"><strong>Reason:</strong> {{ payment.rejectionReason }}</p>
        </div>

        <div v-if="showRejectionDialog && paymentToReject === payment.id" class="rejection-dialog">
          <textarea v-model="rejectionReason" placeholder="Enter rejection reason..."></textarea>
          <button @click="confirmRejection" class="btn btn-primary">Submit</button>
          <button @click="cancelRejection" class="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showImageModal" class="image-modal" @click.self="showImageModal = false">
      <div class="modal-content">
        <img :src="modalImageUrl" alt="Payment proof" />
        <button @click="showImageModal = false" class="close-modal">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payments: [],
      filterStatus: 'pending',
      searchQuery: '',
      showRejectionDialog: false,
      paymentToReject: null,
      rejectionReason: '',
      showImageModal: false,
      modalImageUrl: ''
    }
  },
  computed: {
    filteredPayments() {
      let filtered = this.payments

      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(p => p.status === this.filterStatus)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(p =>
          p.orderId.toLowerCase().includes(query) ||
          (p.customerName && p.customerName.toLowerCase().includes(query))
        )
      }

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  methods: {
    async fetchPayments() {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      this.payments = orders.map(order => ({
        id: order.id,
        orderId: order.id,
        customerName: order.customer?.name || 'Unknown',
        method: order.payment?.method || 'unknown',
        cryptoType: order.payment?.cryptoType,
        amount: parseFloat(order.total),
        date: order.placedAt,
        status: order.status === 'processing' ? 'verified' :
               order.status === 'payment_failed' ? 'rejected' : 'pending',
        proofUrl: order.payment?.proofUrl,
        verifiedBy: order.verifiedBy,
        verifiedAt: order.verifiedAt,
        rejectionReason: order.rejectionReason
      }))
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString()
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    },
    openModal(url) {
      this.modalImageUrl = url
      this.showImageModal = true
    },
    verifyPayment(paymentId, isVerified) {
      if (!isVerified) {
        this.paymentToReject = paymentId
        this.showRejectionDialog = true
        return
      }

      this.updatePaymentStatus(paymentId, true)
    },
    confirmRejection() {
      if (this.rejectionReason.trim()) {
        this.updatePaymentStatus(this.paymentToReject, false, this.rejectionReason)
      }
      this.cancelRejection()
    },
    cancelRejection() {
      this.showRejectionDialog = false
      this.paymentToReject = null
      this.rejectionReason = ''
    },
    updatePaymentStatus(paymentId, isVerified, reason = '') {
      const paymentIndex = this.payments.findIndex(p => p.id === paymentId)
      if (paymentIndex !== -1) {
        const newStatus = isVerified ? 'verified' : 'rejected'
        this.payments[paymentIndex].status = newStatus
        this.payments[paymentIndex].verifiedBy = 'Admin User'
        this.payments[paymentIndex].verifiedAt = new Date().toISOString()
        if (reason) {
          this.payments[paymentIndex].rejectionReason = reason
        }

        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        const orderIndex = orders.findIndex(o => o.id === paymentId)
        if (orderIndex !== -1) {
          orders[orderIndex].status = isVerified ? 'processing' : 'payment_failed'
          orders[orderIndex].verifiedBy = this.payments[paymentIndex].verifiedBy
          orders[orderIndex].verifiedAt = this.payments[paymentIndex].verifiedAt
          if (reason) {
            orders[orderIndex].rejectionReason = reason
          }
          localStorage.setItem('orders', JSON.stringify(orders))
        }
      }
    }
  },
  mounted() {
    this.fetchPayments()
  }
}
</script>




<style scoped>
.admin-verification-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.order-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #f9f9f9;
}
img {
  max-width: 200px;
  margin-top: 10px;
  border-radius: 4px;
}
.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-success {
  background: #4caf50;
  color: white;
}
.btn-danger {
  background: #f44336;
  color: white;
}
</style>
