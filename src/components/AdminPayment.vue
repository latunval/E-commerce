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
      <input v-model="searchQuery" placeholder="Search by order ID..." class="form-control">
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
            >
            <a v-else :href="payment.proofUrl" target="_blank" class="document-link">
              View Document
            </a>
          </div>
          <p v-else>No proof uploaded</p>
        </div>

        <div class="payment-actions" v-if="payment.status === 'pending'">
          <button @click="verifyPayment(payment.id, true)" class="btn btn-success">
            Verify
          </button>
          <button @click="verifyPayment(payment.id, false)" class="btn btn-danger">
            Reject
          </button>
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
        <img :src="modalImageUrl" alt="Payment proof">
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
      // In a real app, this would be an API call
      const orders = JSON.parse(localStorage.getItem('orders') || [])
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
        this.payments[paymentIndex].verifiedBy = 'Admin User' // Replace with actual admin
        this.payments[paymentIndex].verifiedAt = new Date().toISOString()
        if (reason) {
          this.payments[paymentIndex].rejectionReason = reason
        }
        
        // Update orders in localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || [])
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
.payment-verification {
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.payments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.payment-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

.payment-header {
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
.status-verified {
  color: #4caf50;
  font-weight: bold;
}
.status-rejected {
  color: #f44336;
  font-weight: bold;
}

.payment-details p {
  margin: 5px 0;
  font-size: 14px;
}

.proof-section {
  margin: 15px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.proof-section h5 {
  margin-top: 0;
}

.proof-image {
  max-width: 100%;
  max-height: 200px;
  cursor: pointer;
  border: 1px solid #eee;
}

.document-link {
  color: #2196f3;
  text-decoration: none;
}

.payment-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ddd;
}

.verification-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-size: 13px;
}

.rejection-dialog {
  margin-top: 15px;
  padding: 15px;
  background: #fff8e1;
  border-radius: 4px;
}

.rejection-dialog textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
}

.close-modal {
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}
</style>