<template>
  <nav-bar />
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
              <button @click="addFromWishlist(item)" class="btn btn-sm btn-success">
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
          <p v-if="paymentMethodNotes" class="payment-note">{{ paymentMethodNotes }}</p>
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
      isLoading: false,
      formErrors: {}
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
    },
    paymentMethodNotes() {
      const method = this.$refs.paymentComponent?.selectedMethod
      if (method === 'bank_transfer') {
        return 'Please make transfer to Access Bank - 0123456789 (Elysian Fashion Hub)'
      }
      if (method === 'crypto') {
        return 'Please complete payment and upload proof'
      }
      return ''
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
      // Validate form before proceeding from step 0
      if (this.currentStep === 0) {
        const valid = this.validateForm()
        if (valid !== true) {
          window.showToast(valid)
          return
        }
      }

      // Validate payment before proceeding from step 1
      if (this.currentStep === 1 && this.$refs.paymentComponent?.selectedMethod === 'card') {
        const valid = this.$refs.paymentComponent.validateCardDetails()
        if (!valid) {
          window.showToast('Please fix payment details')
          return
        }
      }

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
      this.formErrors = {}
      let isValid = true

      if (!this.form.name.trim()) {
        this.formErrors.name = 'Name is required'
        isValid = false
      }

      if (!this.form.email.trim()) {
        this.formErrors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.formErrors.email = 'Please enter a valid email'
        isValid = false
      }

      if (!this.form.phone.trim()) {
        this.formErrors.phone = 'Phone number is required'
        isValid = false
      } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(this.form.phone)) {
        this.formErrors.phone = 'Please enter a valid phone number'
        isValid = false
      }

      if (!this.form.address.trim()) {
        this.formErrors.address = 'Address is required'
        isValid = false
      } else if (this.form.address.trim().length < 10) {
        this.formErrors.address = 'Address is too short'
        isValid = false
      }

      return isValid ? true : Object.values(this.formErrors)[0]
    },
    async placeOrder() {
      console.log('Attempting to place order...') // Debug log

      if(this.isLoading) return

      // Final form validation
      const formValid = this.validateForm()
      if (formValid !== true) {
        window.showToast(formValid)
        return
      }

      // Check cart not empty
      if (!this.cart.length) {
        window.showToast('Your cart is empty.')
        return
      }

      // Payment validation
      if (this.$refs.paymentComponent?.selectedMethod === 'card') {
        const paymentValid = this.$refs.paymentComponent.validateCardDetails()
        if (!paymentValid) {
          window.showToast('Please fix payment details')
          return
        }
      }

      this.isLoading = true
      console.log('All validations passed, creating order...') // Debug log

      try {
        // Get user data
        const userData =
          JSON.parse(localStorage.getItem('loggedInUser')) ||
          JSON.parse(sessionStorage.getItem('loggedInUser'))

        if (!userData) {
          throw new Error('User session expired. Please log in again.')
        }

        // Get payment data
        const paymentData = this.$refs.paymentComponent?.getPaymentData() || {}
        if (paymentData.error) {
          throw new Error(paymentData.error)
        }

        // Create order object
        const order = {
          id: 'ORD-' + Date.now().toString(),
          customer: {
            id: userData.id,
            name: userData.name,
            email: userData.email
          },
          shippingInfo: { ...this.form },
          payment: {
            ...paymentData,
            status: paymentData.method === 'pay_on_delivery' ? 'pending' : 'pending_verification'
          },
          items: this.cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal: this.subtotal,
          shippingFee: this.shippingFee,
          total: this.totalPrice,
          status: 'pending',
          placedAt: new Date().toISOString()
        }

        console.log('Order object:', order) // Debug log

        // Save order to localStorage (replace with API call in production)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        orders.push(order)
        localStorage.setItem('orders', JSON.stringify(orders))

        // Clear cart
        localStorage.removeItem('cart')
        this.cart = []

        console.log('Order saved, navigating to thank you page...') // Debug log
        window.showToast('🎉 Order placed successfully!')

        // Navigate to thank you page
        this.$router.push('/thank-you').catch(err => {
          console.error('Navigation error:', err)
          this.$router.push('/account') // Fallback
        })

      } catch (error) {
        console.error('Order placement error:', error)
        window.showToast(error.message || 'Failed to place order. Please try again.')
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
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.checkout-steps > div.completed {
  border-color: #4caf50;
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
  transition: background 0.3s;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover {
  background: #3d8b40;
}

.btn-outline {
  background: transparent;
  border: 1px solid #4caf50;
  color: #4caf50;
}

.btn-outline:hover {
  background: #f0fff0;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #3d8b40;
}

.btn-success:disabled {
  background: #cccccc;
  cursor: not-allowed;
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

.shipping-info,
.payment-info,
.order-items {
  margin-bottom: 20px;
}

.payment-note {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
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

.error-message {
  color: #f44336;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
