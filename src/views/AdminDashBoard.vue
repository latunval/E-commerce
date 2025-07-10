<template>
  <div class="admin-dashboard">
    <!-- Hamburger button for mobile -->
    <button class="hamburger d-md-none" @click="sidebarOpen = !sidebarOpen">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="sidebar" :class="{ open: sidebarOpen }">
      <h3>Elysian Admin</h3>
      <ul>
        <li :class="{ active: activeTab === 'payments' }" @click="setTab('payments')">Payment Verification</li>
        <li :class="{ active: activeTab === 'orders' }" @click="setTab('orders')">Order Management</li>
        <li :class="{ active: activeTab === 'users' }" @click="setTab('users')">User Management</li>
        <li :class="{ active: activeTab === 'products' }" @click="setTab('products')">Products Management</li>
      </ul>
    </div>

    <div class="main-content" @click="closeSidebarOnMobile">
      <PaymentVerification v-if="activeTab === 'payments'" />
      <OrderManagement v-if="activeTab === 'orders'" />
      <UserManagement v-if="activeTab === 'users'" />
      <Products v-if="activeTab === 'products'" />
    </div>
  </div>
</template>

<script>
import PaymentVerification from '@/components/admin/PaymentVerification.vue'
import Products from '@/components/admin/ProductManagement.vue'

import UserManagement from '@/components/admin/UserManagement.vue'
import OrderManagement from '@/components/admin/OrderManagement.vue'

export default {
  components: {
    PaymentVerification,
    UserManagement,
    OrderManagement,
    Products,
  },
  data() {
    return {
      activeTab: 'payments',
      sidebarOpen: false,
    }
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab;
      this.sidebarOpen = false; // close sidebar on mobile after selection
    },
    closeSidebarOnMobile() {
      if (window.innerWidth < 768) {
        this.sidebarOpen = false;
      }
    },
  },
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.hamburger {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  width: 40px;
  height: 40px;
  background: #2c3e50;
  border: none;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
  transition: transform 0.3s ease;
}

/* Hide sidebar on mobile by default */
@media (max-width: 767.98px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1050;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    padding: 20px 5px;
  }
}

.sidebar h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #42b983;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar li:hover {
  background: #34495e;
}

.sidebar li.active {
  background: #42b983;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 30px;
  overflow-x: auto;
}

/* Hide hamburger on desktop */
@media (min-width: 768px) {
  .hamburger {
    display: none;
  }
  .sidebar {
    position: static;
    transform: none !important;
    height: auto;
    box-shadow: none;
  }
}
</style>
