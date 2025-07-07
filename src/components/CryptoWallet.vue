<template>
  <div class="crypto-wallet-page">
    <h2>💸 Crypto Wallet Payment</h2>
    <div class="wallet-info">
      <p><strong>Accepted Coins:</strong> USDT (TRC20), BTC, ETH</p>
      <div class="wallet-address">
        <label>Wallet Address:</label>
        <div class="address-box">
          <span>{{ walletAddress }}</span>
          <button class="btn btn-outline-secondary btn-sm ms-2" @click="copyAddress">Copy</button>
        </div>
      </div>
      <div class="qr-section mt-3">
        <label>Scan QR to Pay:</label>
        <img :src="qrCodeUrl" alt="Wallet QR Code" class="qr-img" />
      </div>
      <div class="mt-4">
        <label for="proof">Upload Payment Proof (screenshot):</label>
        <input type="file" id="proof" @change="handleProofUpload" accept="image/*" />
        <div v-if="proofUrl" class="mt-2">
          <img :src="proofUrl" alt="Proof Preview" class="proof-preview" />
        </div>
      </div>
      <button class="btn btn-success mt-3" :disabled="!proofUrl" @click="submitProof">
        Submit Payment Proof
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      walletAddress: 'TQ2v1Xy7Qw8Z9pL3k6J8h2F5g7B9c1D2e3',
      qrCodeUrl:
        'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TQ2v1Xy7Qw8Z9pL3k6J8h2F5g7B9c1D2e3',
      proofUrl: '',
    }
  },
  methods: {
    copyAddress() {
      navigator.clipboard.writeText(this.walletAddress)
      window.showToast('Wallet address copied!', 'success')
    },
    handleProofUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.proofUrl = ev.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    submitProof() {
      // In a real app, this would send the proof to the backend
      window.showToast('Payment proof submitted! Awaiting admin verification.', 'success')
      this.$emit('proof-submitted', this.proofUrl)
    },
  },
}
</script>

<style scoped>
.crypto-wallet-page {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
}
.wallet-info label {
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
}
.address-box {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 1.1rem;
}
.qr-img {
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: #f5f7fa;
  margin-top: 8px;
}
.proof-preview {
  max-width: 180px;
  border-radius: 8px;
  margin-top: 6px;
  border: 1px solid #ddd;
}
.btn {
  min-width: 120px;
}
</style>
