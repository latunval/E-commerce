<template>
  <div class="payment-verification">
    <h2>Payment Verification</h2>

    <div class="filters">
      <input type="date" v-model="startDate" class="form-control" />
      <input type="date" v-model="endDate" class="form-control" />
      <input v-model.number="minAmount" type="number" class="form-control" placeholder="Min Amount" />
      <input v-model.number="maxAmount" type="number" class="form-control" placeholder="Max Amount" />
      <select v-model="filterStatus" class="form-control">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="verified">Verified</option>
        <option value="rejected">Rejected</option>
      </select>
      <input v-model="searchQuery" placeholder="Search by Order ID or Name" class="form-control" />
      <button @click="exportToCSV" class="btn btn-secondary">Export</button>
      <button @click="bulkVerify" class="btn btn-success" :disabled="!selectedPayments.length">Verify Selected</button>
    </div>

    <div class="payments-list">
      <div v-for="payment in filteredPayments" :key="payment.id" class="payment-card">
        <input type="checkbox" v-model="selectedPayments" :value="payment.id" />
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
            <a v-else :href="payment.proofUrl" target="_blank">View Document</a>
          </div>
          <p v-else>No proof uploaded</p>
        </div>

        <div v-if="payment.status === 'pending'" class="payment-actions">
          <button @click="verifyPayment(payment.id, true)" class="btn btn-success">Verify</button>
          <button @click="verifyPayment(payment.id, false)" class="btn btn-danger">Reject</button>
        </div>
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
      payments: [],
      filterStatus: 'all',
      searchQuery: '',
      selectedPayments: [],
      modalImageUrl: '',
      showImageModal: false,
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    }
  },
  computed: {
    filteredPayments() {
      return this.payments.filter(p => {
        const matchesStatus = this.filterStatus === 'all' || p.status === this.filterStatus
        const matchesSearch = this.searchQuery === '' ||
          p.orderId.toString().includes(this.searchQuery) ||
          (p.customerName && p.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()))

        const placedAt = new Date(p.date)
        const startOK = !this.startDate || placedAt >= new Date(this.startDate)
        const endOK = !this.endDate || placedAt <= new Date(this.endDate + 'T23:59')

        const amountOK = (!this.minAmount || p.amount >= this.minAmount) &&
                         (!this.maxAmount || p.amount <= this.maxAmount)

        return matchesStatus && matchesSearch && startOK && endOK && amountOK
      })
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
    formatDate(str) {
      return new Date(str).toLocaleString()
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
    },
    openModal(url) {
      this.modalImageUrl = url
      this.showImageModal = true
    },
    verifyPayment(id, isVerified) {
      const index = this.payments.findIndex(p => p.id === id)
      if (index !== -1) {
        this.payments[index].status = isVerified ? 'verified' : 'rejected'
        this.payments[index].verifiedAt = new Date().toISOString()
        this.payments[index].verifiedBy = 'Admin'

        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        const i = orders.findIndex(o => o.id === id)
        if (i !== -1) {
          orders[i].status = isVerified ? 'processing' : 'payment_failed'
          orders[i].verifiedAt = this.payments[index].verifiedAt
          orders[i].verifiedBy = 'Admin'
          localStorage.setItem('orders', JSON.stringify(orders))
        }
      }
    },
    bulkVerify() {
      this.selectedPayments.forEach(id => this.verifyPayment(id, true))
      this.selectedPayments = []
    },
    exportToCSV() {
      const rows = [
        ['Order ID', 'Customer', 'Method', 'Crypto', 'Amount', 'Status', 'Date']
      ]
      this.filteredPayments.forEach(p => {
        rows.push([
          p.orderId,
          p.customerName,
          p.method,
          p.cryptoType || '-',
          p.amount,
          p.status,
          this.formatDate(p.date)
        ])
      })
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'payments.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.payment-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}
.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-verified {
  color: green;
  font-weight: bold;
}
.status-pending {
  color: orange;
  font-weight: bold;
}
.status-rejected {
  color: red;
  font-weight: bold;
}
.proof-image {
  max-width: 100px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.image-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
}
.modal-content img {
  max-width: 90vw;
  max-height: 80vh;
}
.close-modal {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #fff;
  border: none;
  font-size: 20px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
