<template>
  <div class="payment-selection">
    <h3>💳 Payment Method</h3>
    <div class="payment-options">
      <div
        v-for="method in paymentMethods"
        :key="method.id"
        class="payment-option"
        :class="{ active: selectedMethod === method.id }"
        @click="selectedMethod = method.id"
      >
        <span class="icon">{{ method.icon }}</span>
        <span class="name">{{ method.name }}</span>
      </div>
    </div>

    <!-- Card Payment Section -->
    <div v-if="selectedMethod === 'card'" class="card-details">
      <div class="form-group">
        <label>Card Number</label>
        <input
          v-model="card.number"
          type="text"
          placeholder="1234 5678 9012 3456"
          @input="formatCardNumber"
          @blur="validateCardNumber"
        />
        <span class="error" v-if="cardErrors.number">{{ cardErrors.number }}</span>
      </div>

      <div class="form-group">
        <label>Cardholder Name</label>
        <input v-model="card.name" type="text" placeholder="John Doe" @blur="validateCardName" />
        <span class="error" v-if="cardErrors.name">{{ cardErrors.name }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Expiry Date</label>
          <input
            v-model="card.expiry"
            type="text"
            placeholder="MM/YY"
            @input="formatExpiry"
            @blur="validateExpiry"
          />
          <span class="error" v-if="cardErrors.expiry">{{ cardErrors.expiry }}</span>
        </div>
        <div class="form-group">
          <label>CVV</label>
          <input
            v-model="card.cvv"
            type="password"
            placeholder="123"
            maxlength="4"
            @blur="validateCVV"
          />
          <span class="error" v-if="cardErrors.cvv">{{ cardErrors.cvv }}</span>
        </div>
      </div>
    </div>

    <!-- Bank Transfer Section (Your Added Code) -->
    <div v-if="selectedMethod === 'bank_transfer'" class="bank-details">
      <h4>Bank Transfer Instructions</h4>
      <p><strong>Bank Name:</strong> Access Bank</p>
      <p><strong>Account Number:</strong> 0123456789</p>
      <p><strong>Account Name:</strong> Elysian Fashion Hub</p>
      <p class="note">⚠️ Please use your full name or order ID as the payment reference.</p>

      <div class="payment-upload">
        <label>Upload Transfer Proof</label>
        <input type="file" id="transferProof" accept="image/*,.pdf" @change="handleFileUpload" />
        <div v-if="paymentProof" class="file-preview">
          <span>{{ paymentProof.name }}</span>
          <button @click="removeFile" class="btn btn-sm btn-danger">×</button>
        </div>
      </div>
    </div>

    <!-- Crypto Payment Section -->
    <div v-if="selectedMethod === 'crypto'" class="crypto-payment">
      <div class="crypto-options">
        <select v-model="selectedCrypto" class="crypto-select">
          <option v-for="crypto in cryptoOptions" :value="crypto" :key="crypto">
            {{ crypto }}
          </option>
        </select>
      </div>

      <div class="qr-code-container">
        <div ref="qrCodeElement" class="qr-code"></div>
        <p class="crypto-address">{{ cryptoAddresses[selectedCrypto] }}</p>
        <button @click="copyAddress" class="btn btn-sm">
          {{ copyButtonText }}
        </button>
      </div>

      <div class="payment-upload">
        <label>Upload Transaction Proof</label>
        <input type="file" id="paymentProof" accept="image/*,.pdf" @change="handleFileUpload" />
        <div v-if="paymentProof" class="file-preview">
          <span>{{ paymentProof.name }}</span>
          <button @click="removeFile" class="btn btn-sm btn-danger">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode-generator'

export default {
  data() {
    return {
      selectedMethod: 'pay_on_delivery',
      paymentMethods: [
        { id: 'pay_on_delivery', name: 'Pay on Delivery', icon: '🏷️' },
        { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
        { id: 'crypto', name: 'Crypto', icon: '₿' },
      ],
      // Card Payment Data
      card: {
        number: '',
        name: '',
        expiry: '',
        cvv: '',
      },
      cardErrors: {
        number: '',
        name: '',
        expiry: '',
        cvv: '',
      },
      // Crypto Payment Data
      selectedCrypto: 'Bitcoin',
      cryptoOptions: ['Bitcoin', 'Ethereum', 'USDT', 'BNB'],
      cryptoAddresses: {
        Bitcoin: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
        Ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        USDT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        BNB: 'bnb1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      },
      // Payment Proof
      paymentProof: null,
      copyButtonText: 'Copy Address',
    }
  },
  methods: {
    // Card Payment Methods
    formatCardNumber() {
      this.card.number = this.card.number.replace(/\D/g, '')
      this.card.number = this.card.number.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    formatExpiry() {
      this.card.expiry = this.card.expiry.replace(/\D/g, '')
      if (this.card.expiry.length > 2) {
        this.card.expiry = this.card.expiry.replace(/^(\d{2})/, '$1/')
      }
    },
    validateCardNumber() {
      const cleaned = this.card.number.replace(/\s/g, '')
      let sum = 0
      let shouldDouble = false

      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10)

        if (shouldDouble) {
          digit *= 2
          if (digit > 9) digit -= 9
        }

        sum += digit
        shouldDouble = !shouldDouble
      }

      const isValid = sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19
      this.cardErrors.number = isValid ? '' : 'Please enter a valid card number'
      return isValid
    },
    validateCardName() {
      const isValid = this.card.name.trim().length >= 3
      this.cardErrors.name = isValid ? '' : 'Please enter cardholder name'
      return isValid
    },
    validateExpiry() {
      if (!this.card.expiry) {
        this.cardErrors.expiry = 'Please enter expiry date'
        return false
      }

      const [month, year] = this.card.expiry.split('/')
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        this.cardErrors.expiry = 'Please use MM/YY format'
        return false
      }

      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(year, 10)
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (monthNum < 1 || monthNum > 12) {
        this.cardErrors.expiry = 'Invalid month'
        return false
      }

      if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        this.cardErrors.expiry = 'Card has expired'
        return false
      }

      this.cardErrors.expiry = ''
      return true
    },
    validateCVV() {
      const isValid = /^\d{3,4}$/.test(this.card.cvv)
      this.cardErrors.cvv = isValid ? '' : 'Please enter valid CVV'
      return isValid
    },
    validateCardDetails() {
      const validations = [
        this.validateCardNumber(),
        this.validateCardName(),
        this.validateExpiry(),
        this.validateCVV(),
      ]
      return validations.every((v) => v)
    },

    // Crypto Payment Methods
    generateQRCode() {
      if (this.$refs.qrCodeElement) {
        this.$refs.qrCodeElement.innerHTML = ''
        const qr = QRCode(0, 'L')
        qr.addData(this.cryptoAddresses[this.selectedCrypto])
        qr.make()
        this.$refs.qrCodeElement.innerHTML = qr.createImgTag(4)
      }
    },
    copyAddress() {
      navigator.clipboard.writeText(this.cryptoAddresses[this.selectedCrypto]).then(() => {
        this.copyButtonText = 'Copied!'
        setTimeout(() => (this.copyButtonText = 'Copy Address'), 2000)
      })
    },

    // Payment Proof Handling
    handleFileUpload(event) {
      this.paymentProof = event.target.files[0]
    },
    removeFile() {
      this.paymentProof = null
      document.getElementById('paymentProof').value = ''
      document.getElementById('transferProof').value = ''
    },

    // Get Payment Data for Order Submission
    getPaymentData() {
      if (this.selectedMethod === 'card') {
        if (!this.validateCardDetails()) {
          return { error: 'Please fix card errors' }
        }

        return {
          method: this.selectedMethod,
          details: {
            last4: this.card.number.slice(-4),
            brand: this.detectCardBrand(),
            expiry: this.card.expiry,
          },
        }
      }

      if (this.selectedMethod === 'bank_transfer') {
        return {
          method: this.selectedMethod,
          bankDetails: {
            bankName: 'Access Bank',
            accountNumber: '0123456789',
            accountName: 'Elysian Fashion Hub',
          },
          paymentProof: this.paymentProof,
        }
      }

      if (this.selectedMethod === 'crypto') {
        return {
          method: this.selectedMethod,
          cryptoType: this.selectedCrypto,
          cryptoAddress: this.cryptoAddresses[this.selectedCrypto],
          paymentProof: this.paymentProof,
        }
      }

      return {
        method: this.selectedMethod,
      }
    },

    detectCardBrand() {
      const num = this.card.number.replace(/\s/g, '')
      if (/^4/.test(num)) return 'Visa'
      if (/^5[1-5]/.test(num)) return 'Mastercard'
      if (/^3[47]/.test(num)) return 'American Express'
      if (/^6(?:011|5)/.test(num)) return 'Discover'
      if (/^3(?:0[0-5]|[68])/.test(num)) return 'Diners Club'
      if (/^(?:2131|1800|35)/.test(num)) return 'JCB'
      return 'Unknown'
    },
  },
  mounted() {
    if (this.selectedMethod === 'crypto') {
      this.generateQRCode()
    }
  },
  watch: {
    selectedMethod(newVal) {
      if (newVal === 'crypto') {
        this.$nextTick(() => {
          this.generateQRCode()
        })
      }
    },
    selectedCrypto() {
      this.generateQRCode()
    },
  },
}
</script>

<style scoped>
.payment-selection {
  margin-top: 20px;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.payment-option {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.payment-option:hover {
  border-color: #888;
}

.payment-option.active {
  border-color: #4caf50;
  background-color: #f0fff0;
}

.icon {
  font-size: 1.5em;
}

/* Card Details */
.card-details {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.error {
  color: #f44336;
  font-size: 0.8em;
  margin-top: 4px;
  display: block;
}

/* Bank Transfer */
.bank-details {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.bank-details h4 {
  margin-top: 0;
  color: #333;
}

.bank-details p {
  margin: 8px 0;
}

.note {
  color: #ff9800;
  font-style: italic;
  margin-top: 15px;
}

/* Crypto Payment */
.crypto-payment {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.crypto-select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  width: 100%;
}

.qr-code-container {
  text-align: center;
  margin: 20px 0;
}

.qr-code img {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.crypto-address {
  word-break: break-all;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  margin: 15px 0;
}

/* Payment Proof Upload */
.payment-upload {
  margin-top: 20px;
}

.payment-upload label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.8em;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
}
</style>
