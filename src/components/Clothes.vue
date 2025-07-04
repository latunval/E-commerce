<template>
  <div>
    <section>
      <div class="product" v-for="item in product" :key="item">
        <p>
          <span>{{ item.name }}</span> <span>₦{{ item.price }}</span>
        </p>
        <img :src="item.image" :alt="item.name" />
        <router-link :to="`/products/${item.id}`">View Details</router-link>
      </div>
    </section>
    <jewelry />
    <perfume />
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
    }
  },
  async mounted() {
    const response = await fetch('/product.json')
    const supply = await response.json()
    console.log(supply)
    this.product = supply.clothes
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
@media (max-width: 900px) {
  section {
    grid-template-columns: 48% 48%;
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
