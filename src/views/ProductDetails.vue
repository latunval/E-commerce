<template>
  <div v-if="product" class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-12">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body text-center">
            <h2 class="card-title mb-3">{{ product.name }}</h2>
            <p class="h5 mb-2 text-success"><strong>Price:</strong> ₦{{ product.price }}</p>
            <img :src="product.image" :alt="product.name" class="img-fluid rounded mb-3" style="max-width:350px;" />
            <p class="card-text mb-3">{{ product.description }}</p>
            <div v-if="product.moreImages && product.moreImages.length">
              <h5 class="mb-2">More Images:</h5>
              <div class="d-flex flex-wrap justify-content-center gap-3 mb-3">
                <img v-for="(img, i) in product.moreImages" :key="i" :src="img" class="rounded border bg-light" style="width:110px;height:110px;object-fit:cover;cursor:pointer;transition:box-shadow .2s,border .2s;" @mouseover="e=>e.target.style.boxShadow='0 2px 12px #f68b1e55'" @mouseleave="e=>e.target.style.boxShadow=''" />
              </div>
            </div>
            <router-link to="/product" class="btn btn-warning fw-bold px-4 py-2 mt-2">← Back to Shop</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container py-5">
    <div class="alert alert-warning text-center">
      <h2>Product not found 😢</h2>
      <router-link to="/product" class="btn btn-warning fw-bold mt-3">← Return to Shop</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null
    }
  },
  async mounted() {
    const response = await fetch('/product.json')
    const data = await response.json()

    // Combine all categories
    const allProducts = [
      ...(data.clothes || []),
      ...(data.jewelry || []),
      ...(data.perfume || [])
    ]

    const id = Number(this.$route.params.id)
    this.product = allProducts.find(p => p.id === id) || null
  }
}
</script>

<style scoped>
.card-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.card-text {
  font-size: 1.1rem;
  color: #444;
}
@media (max-width: 700px) {
  .card-body {
    padding: 1rem 0.3rem !important;
  }
  .card-title {
    font-size: 1.3rem;
  }
}
</style>
