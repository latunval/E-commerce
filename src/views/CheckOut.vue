<template>
  <div class="checkout-page">
    <h2>🧾 Checkout</h2>
    
    <div class="checkout-steps">
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        :class="{ active: currentStep === index, completed: currentStep > index }"
        @click="goToStep(index)"
      >
        {{ step.label }}
      </div>
    </div>

    <div v-if="currentStep === 0" class="shipping-form">
      <form @submit.prevent="goToNextStep">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="form.phone" type="tel" required />
        </div>

        <div class="form-group">
          <label>Delivery Address</label>
          <textarea v-model="form.address" rows="3" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Continue to Payment</button>
        </div>
      </form>
    </div>

    <div v-if="currentStep === 1" class="payment-section">
      <PaymentSelection ref="paymentComponent" />
      
      <div class="wishlist-section" v-if="wishlist.length > 0">
        <h4>⭐ Items from your Wishlist</h4>
        <div class="wishlist-items">
          <div v-for="item in wishlist" :key="item.id" class="wishlist-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-info">
              <h5>{{ item.name }}</h5>
              <p>₦{{ item.price.toFixed(2) }}</p>
              <button 
                @click="addFromWishlist(item)" 
                class="btn btn-sm btn-success"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="goToPrevStep" class="btn btn-outline">Back</button>
        <button @click="goToNextStep" class="btn btn-primary">Review Order</button>
      </div>
    </div>

    <div v-if="currentStep === 2" class="review-section">
      <div class="order-summary">
        <h4>Order Summary</h4>
        <div class="shipping-info">
          <h5>Shipping Information</h5>
          <p>{{ form.name }}</p>
          <p>{{ form.address }}</p>
          <p>{{ form.phone }}</p>
          <p>{{ form.email }}</p>
        </div>
        
        <div class="payment-info">
          <h5>Payment Method</h5>
          <p>{{ paymentMethodDisplay }}</p>
        </div>

        <div class="order-items">
          <h5>Items ({{ cart.length }})</h5>
          <div v-for="item in cart" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-details">
              <h6>{{ item.name }}</h6>
              <p>Quantity: {{ item.quantity }}</p>
              <p>₦{{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="order-total">
          <p>Subtotal: ₦{{ subtotal.toFixed(2) }}</p>
          <p>Shipping: ₦{{ shippingFee.toFixed(2) }}</p>
          <p class="total">Total: ₦{{ totalPrice }}</p>
        </div>
      </div>

      <div class="review-actions">
        <button @click="goToPrevStep" class="btn btn-outline">Back</button>
        <button @click="placeOrder" class="btn btn-success" :disabled="isLoading">
          {{ isLoading ? 'Processing...' : 'Place Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentSelection from '@/components/PaymentSelection.vue'

export default {
  components: {
    PaymentSelection
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        { id: 'shipping', label: 'Shipping' },
        { id: 'payment', label: 'Payment' },
        { id: 'review', label: 'Review' }
      ],
      form: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      cart: [],
      wishlist: [],
      shippingFee: 1500,
      isLoading: false
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    totalPrice() {
      return (this.subtotal + this.shippingFee).toFixed(2)
    },
    paymentMethodDisplay() {
      const method = this.$refs.paymentComponent?.selectedMethod
      if (!method) return ''
      
      const found = this.$refs.paymentComponent.paymentMethods.find(m => m.id === method)
      return found ? found.name : ''
    }
  },
  mounted() {
    this.loadCart()
    this.loadWishlist()
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      const user = 
        localStorage.getItem('loggedInUser') ||
        sessionStorage.getItem('loggedInUser')

      if (!user) {
        window.showToast('Please log in to proceed to checkout.')
        this.$router.push('/auth')
      }
    },
    loadCart() {
      const storedCart = localStorage.getItem('cart')
      this.cart = storedCart ? JSON.parse(storedCart) : []
    },
    loadWishlist() {
      const storedWishlist = localStorage.getItem('wishlist')
      this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : []
    },
    addFromWishlist(item) {
      const existingItem = this.cart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({ ...item, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))
      window.showToast(`${item.name} added to cart!`)
    },
    goToStep(index) {
      if (index < this.currentStep) {
        this.currentStep = index
      }
    },
    goToNextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },
    goToPrevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    validateForm() {
      if (!this.form.name.trim()) return 'Name is required'
      if (!this.form.email.trim()) return 'Email is required'
      if (!this.form.phone.trim()) return 'Phone number is required'
      if (!this.form.address.trim()) return 'Address is required'
      return true
    },
    async placeOrder() {
      if (this.isLoading) return
      
      const validation = this.validateForm()
      if (validation !== true) {
        window.showToast(validation)
        return
      }

      if (!this.cart.length) {
        window.showToast('Your cart is empty.')
        return
      }

      this.isLoading = true

      try {
        const loggedInUser = 
          JSON.parse(localStorage.getItem('loggedInUser')) ||
          JSON.parse(sessionStorage.getItem('loggedInUser'))

        const paymentData = this.$refs.paymentComponent.getPaymentData()

        const order = {
          id: Date.now().toString(),
          customer: loggedInUser,
          shippingInfo: { ...this.form },
          paymentInfo: paymentData,
          items: [...this.cart],
          subtotal: this.subtotal,
          shippingFee: this.shippingFee,
          total: this.totalPrice,
          placedAt: new Date().toISOString(),
          status: 'processing'
        }

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        orders.push(order)
        localStorage.setItem('orders', JSON.stringify(orders))
        
        // Clear cart
        localStorage.removeItem('cart')
        this.cart = []

        window.showToast('🎉 Order placed successfully!')
        this.$router.push('/thank-you')
      } catch (error) {
        console.error('Order placement failed:', error)
        window.showToast('Failed to place order. Please try again.')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.checkout-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.checkout-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
}

.checkout-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ddd;
  z-index: 0;
}

.checkout-steps > div {
  position: relative;
  text-align: center;
  padding: 10px 15px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
}

.checkout-steps > div.active {
  border-color: #4CAF50;
  background: #4CAF50;
  color: white;
}

.checkout-steps > div.completed {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.form-group {
  margin-bottom: 16px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #4CAF50;
  color: #4CAF50;
}

.btn-success {
  background: #4CAF50;
  color: white;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.8em;
}

.wishlist-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.wishlist-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.wishlist-item {
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.wishlist-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  margin-top: 10px;
}

.order-summary {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.shipping-info, .payment-info, .order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.order-total {
  text-align: right;
  margin-top: 20px;
}

.order-total .total {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 5px;
}

.review-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>