<template>
  <div class="admin-dashboard">
    <div class="sidebar">
      <h3>Elysian Admin</h3>
      <ul>
        <li :class="{ active: activeTab === 'payments' }" @click="activeTab = 'payments'">Payment Verification</li>
        <li :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">Order Management</li>
        <li :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">User Management</li>
      </ul>
    </div>

    <div class="main-content">
      <PaymentVerification v-if="activeTab === 'payments'" />
      <OrderManagement v-if="activeTab === 'orders'" />
      <UserManagement v-if="activeTab === 'users'" />
    </div>
  </div>
</template>

<script>
import PaymentVerification from '@/components/admin/PaymentVerification.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import OrderManagement from '@/components/admin/OrderManagement.vue'

export default {
  components: {
    PaymentVerification,
    UserManagement,
    OrderManagement,
  },
  data() {
    return {
      activeTab: 'payments',
    }
  },
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
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
</style>
