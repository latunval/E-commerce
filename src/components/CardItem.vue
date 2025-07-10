<template>
  <div class="border">
    <h2 class="text-center my-4">Featured Products</h2>
    <div class="row g-4">
      <div
        class="col-md-4 col-lg-3"
        v-for="item in clothes.slice(0, 10)"
        :key="'clothes-' + item.id"
      >
        <div class="card h-100">
          <img
            :src="item.image"
            class="card-img-top"
            :alt="item.name"
            style="object-fit: cover; max-height: 180px"
          />
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">₦{{ item.price }}</p>
            <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm mb-2"
              >View Details</router-link
            >
            <button class="btn btn-primary btn-sm w-100" @click="addToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 col-lg-3"
        v-for="item in jewelry.slice(0, 10)"
        :key="'jewelry-' + item.id"
      >
        <div class="card h-100">
          <img
            :src="item.image"
            class="card-img-top"
            :alt="item.name"
            style="object-fit: cover; max-height: 180px"
          />
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">₦{{ item.price }}</p>
            <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm mb-2"
              >View Details</router-link
            >
            <button class="btn btn-primary btn-sm w-100" @click="addToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 col-lg-3"
        v-for="item in perfume.slice(0, 10)"
        :key="'perfume-' + item.id"
      >
        <div class="card h-100">
          <img
            :src="item.image"
            class="card-img-top"
            :alt="item.name"
            style="object-fit: cover; max-height: 200px"
          />
          <div class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">₦{{ item.price }}</p>
            <router-link :to="`/products/${item.id}`" class="btn btn-outline-primary btn-sm mb-2"
              >View Details</router-link
            >
            <button class="btn btn-primary btn-sm w-100" @click="addToCart(item)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clothes: [],
      jewelry: [],
      perfume: [],
    }
  },
  async mounted() {
    const response = await fetch('/product.json')
    const data = await response.json()
    this.clothes = data.clothes || []
    this.jewelry = data.jewelry || []
    this.perfume = data.perfume || []
  },
  methods: {
    addToCart(item) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const found = cart.find((p) => p.id === item.id)
      if (found) {
        found.quantity += 1
      } else {
        cart.push({ ...item, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      if (window.showToast) {
        window.showToast(`${item.name} added to cart!`)
      } else {
        alert(`${item.name} added to cart!`)
      }
    },
  },
}
</script>

<style scoped>
.border {
  width: 99% !important;
  padding: 10px !important;
  margin: 10px auto;
}
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
}
.card-img-top {
  border-radius: 12px 12px 0 0;
}
</style>
