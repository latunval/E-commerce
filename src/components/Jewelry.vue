<template>
  <div>
    <section>
      <div class="product" v-for="item in product" :key="item.id">
        <p>
          <span>{{ item.name }}</span> <span>₦{{ item.price }}</span>
        </p>

        <img :src="item.image" :alt="item.name" @click="view(item.id)" />

        <p @click="view(item.id)" style="cursor: pointer; color: #007bff" class="view-link">
          View Details
          <span
            v-if="loadingId === item.id"
            class="spinner-grow spinner-grow-sm"
            role="status"
            style="
              background-color: red;
              display: inline-block;
              margin-left: 8px;
              vertical-align: middle;
            "
          >
            <span class="visually-hidden text-danger">Loading...</span>
          </span>
        </p>
        <button class="btn btn-primary btn-sm mt-2" @click.stop="addToCart(item)">
          Add to Cart
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
      loadingId: null,
    }
  },
  async mounted() {
    const response = await fetch('/product.json')
    const supply = await response.json()
    console.log(supply)
    this.product = supply.jewelry
  },
  methods: {
    view(item) {
      this.loadingId = item
      setTimeout(() => {
        this.loadingId = null
      }, 15000) // Spinner will show for 1.5 seconds
      this.$router.push(`/products/${item}`)
    },
    addToCart(item) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')

      const found = cart.find((p) => p.id === item.id)
      if (found) {
        found.quantity += 1
      } else {
        cart.push({ ...item, quantity: 1 })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      window.showToast(`${item.name} added to cart!`)
    },
  },
}
</script>

<style scoped>
section {
  background: #ccc;
  display: grid;
  grid-template-columns: 31.5% 31.5% 31.5%;
  padding: 10px;
  border-radius: 20px;
  gap: 25px;
}
.product {
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  background: #ffffffbe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 18px 12px 24px 12px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  align-items: center;
  transition: box-shadow 0.2s;
}
.product:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
  border-color: #b3b3b3;
}
.product img {
  width: 100%;
  max-width: 220px;
  height: auto;
  border-radius: 12px;
  margin-bottom: 12px;
  object-fit: cover;
}
.product p {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 1.1rem;
  margin: 0 0 8px 0;
}
.product span {
  font-weight: 500;
}
@media (max-width: 1200px) {
  section {
    grid-template-columns: 48% 48%;
  }
}
@media (max-width: 900px) {
  section {
    grid-template-columns: 48% 48%;
  }
}
@media (max-width: 700px) {
  section {
    grid-template-columns: 100%;
    padding: 5px;
    gap: 12px;
  }
  .product {
    padding: 10px 6px 16px 6px;
  }
  .product img {
    max-width: 100%;
    height: auto;
  }
  .product p {
    font-size: 1rem;
  }
}
@media (max-width: 600px) {
  section {
    grid-template-columns: 100%;
  }
  .product img {
    max-width: 100%;
  }
}
</style>
