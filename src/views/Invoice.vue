<template>
  <div class="invoice-page" ref="invoice">
    <h2>🧾 Invoice</h2>
    <p><strong>Order #{{ orderId }}</strong></p>
    <p>Date: {{ formatDate(order?.placedAt) }}</p>

    <hr />
    <p><strong>Customer:</strong> {{ order?.shippingInfo?.name }}</p>
    <p><strong>Address:</strong> {{ order?.shippingInfo?.address }}</p>

    <table class="table table-bordered mt-4">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in order.items" :key="i">
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>₦{{ item.price }}</td>
          <td>₦{{ (item.price * item.quantity).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <h4 class="mt-3">Grand Total: ₦{{ order.total }}</h4>

    <button class="btn btn-dark mt-4" @click="printInvoice">🖨️ Print</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
      orderId: this.$route.params.orderId
    }
  },
  mounted() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    this.order = orders[this.orderId]
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    printInvoice() {
      window.print()
    }
  }
}
</script>

<style scoped>
.invoice-page {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  background: #fff;
}
@media print {
  button {
    display: none;
  }
}
</style>
