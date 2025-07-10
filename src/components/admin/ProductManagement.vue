<template>
  <div class="product-management">
    <h2>Manage Products</h2>

    <!-- Add/Edit Product Form -->
    <form @submit.prevent="submitForm" class="form">
      <input v-model="form.name" placeholder="Product Name" required />
      <input v-model.number="form.price" type="number" placeholder="Price (₦)" required />
      <select v-model="form.category" required>
        <option disabled value="">Select Category</option>
        <option value="Perfume">Perfume</option>
        <option value="Shoes">Shoes</option>
        <option value="Clothing">Clothing</option>
      </select>
      <textarea
        v-model="form.description"
        placeholder="Product description"
        rows="3"
        required
      ></textarea>
      <input type="file" accept="image/*" multiple @change="handleImageUpload" />
      <div class="image-preview" v-if="form.images.length">
        <div v-for="(img, i) in form.images" :key="i" class="img-box">
          <img :src="img" />
          <button @click.prevent="removeImage(i)" class="remove-btn">×</button>
        </div>
      </div>
      <button type="submit">{{ editIndex !== null ? 'Update' : 'Add' }}</button>
    </form>

    <!-- Product Table -->
    <h3 class="mt-4">Product List</h3>
    <div v-if="paginatedProducts.length">
      <div class="product-list">
        <div v-for="(product, i) in paginatedProducts" :key="product.id" class="product-card">
          <div v-for="(img, idx) in product.images" :key="idx">
            <img :src="img" @click="showPreviewModal({ ...product, image: img })" />
          </div>
          <p><strong>{{ product.name }}</strong></p>
          <p>₦{{ product.price.toLocaleString() }}</p>
          <p class="category">{{ product.category }}</p>
          <p>{{ product.description }}</p>

          <button @click="editProduct(i)">Edit</button>
          <button @click="deleteProduct(i)">Delete</button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1">Prev</button>
        Page {{ currentPage }} of {{ totalPages }}
        <button @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <p v-else>No products available.</p>

    <!-- Preview Modal -->
    <div v-if="previewProduct" class="preview-modal" @click.self="previewProduct = null">
      <div class="modal-box">
        <img :src="previewProduct.image" />
        <h3>{{ previewProduct.name }}</h3>
        <p>₦{{ previewProduct.price.toLocaleString() }}</p>
        <p>Category: {{ previewProduct.category }}</p>
        <p>Description: {{ previewProduct.description }}</p>
        <button @click="previewProduct = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        price: '',
        images: [],
        category: '',
        description: '',
      },
      products: [],
      editIndex: null,
      previewProduct: null,
      currentPage: 1,
      pageSize: 10,
    }
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.products.slice(start, start + this.pageSize)
    },
    totalPages() {
      return Math.ceil(this.products.length / this.pageSize)
    },
  },
  mounted() {
    const stored = localStorage.getItem('products')
    this.products = stored ? JSON.parse(stored) : []
  },
  methods: {
    submitForm() {
      const newProduct = {
        ...this.form,
        id: this.editIndex !== null ? this.products[this.editIndex].id : Date.now().toString(),
      }
      if (this.editIndex !== null) {
        this.products.splice(this.editIndex, 1, newProduct)
        this.editIndex = null
      } else {
        this.products.unshift(newProduct)
      }
      localStorage.setItem('products', JSON.stringify(this.products))
      this.resetForm()
    },
    resetForm() {
      this.form = {
        name: '',
        price: '',
        images: [],
        category: '',
        description: '',
      }
    },
    handleImageUpload(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          this.form.images.push(reader.result)
        }
        reader.readAsDataURL(file)
      })
    },
    removeImage(index) {
      this.form.images.splice(index, 1)
    },
    editProduct(index) {
      this.editIndex = index + (this.currentPage - 1) * this.pageSize
      this.form = JSON.parse(JSON.stringify(this.products[this.editIndex]))
    },
    deleteProduct(index) {
      const realIndex = index + (this.currentPage - 1) * this.pageSize
      if (confirm('Are you sure you want to delete this product?')) {
        this.products.splice(realIndex, 1)
        localStorage.setItem('products', JSON.stringify(this.products))
      }
    },
    showPreviewModal(product) {
      this.previewProduct = product
    },
  },
}
</script>

<style scoped>
.product-management {
  padding: 20px;
  max-width: 960px;
  margin: auto;
}
.form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px #ccc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form input,
.form select,
.form textarea,
.form button {
  padding: 10px;
  font-size: 1rem;
}
.image-preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.img-box {
  position: relative;
  width: 80px;
  height: 80px;
}
.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
.product-card {
  width: 30%;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}
.product-card img {
  max-width: 100%;
  border-radius: 8px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 8px;
}
.product-card .category {
  color: #888;
  font-size: 0.9rem;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
}
.modal-box img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
}
</style>
