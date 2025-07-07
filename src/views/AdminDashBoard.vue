<template>
  <div class="admin-dashboard">
    <div class="sidebar">
      <h3>Elysian Admin</h3>
      <ul>
        <li :class="{ active: activeTab === 'payments' }" @click="activeTab = 'payments'">Payment Verification</li>
        <li :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">Order Management</li>
      </ul>
    </div>

    <div class="main-content">
      <!-- Payment Verification -->
      <div v-if="activeTab === 'payments'">
        <h2>Payment Verification</h2>

        <div class="filters">
          <select v-model="filterStatus" class="form-control">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <input v-model="searchQuery" placeholder="Search by Order ID..." class="form-control" />
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
              <div v-if="payment.proofUrl">
                <img v-if="isImage(payment.proofUrl)" :src="payment.proofUrl" @click="openModal(payment.proofUrl)" class="proof-image" />
                <a v-else :href="payment.proofUrl" target="_blank" class="document-link">View Document</a>
              </div>
              <p v-else>No proof uploaded</p>
            </div>

            <div v-if="payment.status === 'pending'" class="payment-actions">
              <button @click="verifyPayment(payment.id, true)" class="btn btn-success">Verify</button>
              <button @click="verifyPayment(payment.id, false)" class="btn btn-danger">Reject</button>
            </div>

            <div v-if="payment.status !== 'pending'" class="verification-info">
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
      </div>

      <!-- Placeholder for OrderManagement -->
      <div v-if="activeTab === 'orders'">
        <h2>Order Management</h2>
        <p>Coming soon...</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showImageModal" class="image-modal" @click.self="showImageModal = false">
      <div class="modal-content">
        <img :src="modalImageUrl" />
        <button @click="showImageModal = false" class="close-modal">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'payments',
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
      let list = this.payments
      if (this.filterStatus !== 'all') {
        list = list.filter(p => p.status === this.filterStatus)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(p => p.orderId.toLowerCase().includes(q) || (p.customerName && p.customerName.toLowerCase().includes(q)))
      }
      return list.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  mounted() {
    this.fetchPayments()
  },
  methods: {
    fetchPayments() {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      this.payments = orders.map(o => ({
        id: o.id,
        orderId: o.id,
        customerName: o.customer?.name || 'Unknown',
        method: o.payment?.method || 'Unknown',
        cryptoType: o.payment?.cryptoType,
        amount: parseFloat(o.total),
        date: o.placedAt,
        status: o.status === 'processing' ? 'verified' : o.status === 'payment_failed' ? 'rejected' : 'pending',
        proofUrl: o.payment?.proofUrl,
        verifiedBy: o.verifiedBy,
        verifiedAt: o.verifiedAt,
        rejectionReason: o.rejectionReason
      }))
    },
    verifyPayment(id, isVerified) {
      if (!isVerified) {
        this.paymentToReject = id
        this.showRejectionDialog = true
        return
      }
      this.updateStatus(id, true)
    },
    confirmRejection() {
      if (this.rejectionReason.trim()) {
        this.updateStatus(this.paymentToReject, false, this.rejectionReason)
      }
      this.cancelRejection()
    },
    cancelRejection() {
      this.showRejectionDialog = false
      this.paymentToReject = null
      this.rejectionReason = ''
    },
    updateStatus(id, isVerified, reason = '') {
      const i = this.payments.findIndex(p => p.id === id)
      if (i !== -1) {
        const newStatus = isVerified ? 'verified' : 'rejected'
        const verifiedAt = new Date().toISOString()
        const verifiedBy = 'Admin'

        this.payments[i].status = newStatus
        this.payments[i].verifiedBy = verifiedBy
        this.payments[i].verifiedAt = verifiedAt
        if (reason) this.payments[i].rejectionReason = reason

        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        const oi = orders.findIndex(o => o.id === id)
        if (oi !== -1) {
          orders[oi].status = isVerified ? 'processing' : 'payment_failed'
          orders[oi].verifiedBy = verifiedBy
          orders[oi].verifiedAt = verifiedAt
          if (reason) orders[oi].rejectionReason = reason
          localStorage.setItem('orders', JSON.stringify(orders))
        }
      }
    },
    formatDate(str) {
      return new Date(str).toLocaleString()
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    },
    openModal(url) {
      this.modalImageUrl = url
      this.showImageModal = true
    }
  }
}
</script>




<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #42b983;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar li:hover {
  background: #34495e;
}

.sidebar li.active {
  background: #42b983;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 30px;
}
</style>
