<template>
  <div class="user-management">
    <h2>User Management</h2>

    <div class="filters mb-3">
      <input v-model="userSearchQuery" placeholder="Search users..." class="form-control" />
    </div>

    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || 'N/A' }}</td>
            <td>
              <span :class="'status-' + (user.isActive ? 'active' : 'inactive')">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ userOrdersCount(user.id) }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="viewUserDetails(user)">View</button>
              <button
                class="btn btn-sm"
                :class="user.isActive ? 'btn-warning' : 'btn-success'"
                @click="toggleUserStatus(user)"
              >
                {{ user.isActive ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedUser" class="user-details-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>User Details</h3>
          <button class="close-modal" @click="selectedUser = null">&times;</button>
        </div>
        <div class="modal-body">
          <div class="profile-section">
            <h4>Basic Info</h4>
            <p><strong>Name:</strong> {{ selectedUser.name }}</p>
            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
            <p><strong>Phone:</strong> {{ selectedUser.phone || 'N/A' }}</p>
            <p><strong>Status:</strong>
              <span :class="'status-' + (selectedUser.isActive ? 'active' : 'inactive')">
                {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>

          <div class="profile-section">
            <h4>Address</h4>
            <p v-if="selectedUser.address">
              {{ selectedUser.address.street }}<br>
              {{ selectedUser.address.city }}, {{ selectedUser.address.state }}<br>
              {{ selectedUser.address.country }} {{ selectedUser.address.postalCode }}
            </p>
            <p v-else>No address provided.</p>
          </div>

          <div class="profile-section">
            <h4>Recent Orders ({{ userOrdersCount(selectedUser.id) }})</h4>
            <div v-if="getUserOrders(selectedUser.id).length">
              <div
                class="order-item"
                v-for="order in getUserOrders(selectedUser.id).slice(0, 3)"
                :key="order.id"
              >
                <p><strong>Order #{{ order.id }}</strong> - ₦{{ order.total.toLocaleString() }}</p>
                <p>{{ formatDate(order.placedAt) }} - {{ order.status }}</p>
              </div>
            </div>
            <p v-else>No orders found.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="toggleUserStatus(selectedUser)" class="btn" :class="selectedUser.isActive ? 'btn-warning' : 'btn-success'">
            {{ selectedUser.isActive ? 'Deactivate' : 'Activate' }} User
          </button>
          <button @click="selectedUser = null" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userSearchQuery: '',
      users: [],
      selectedUser: null
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      const stored = localStorage.getItem('users') || '[]'
      this.users = JSON.parse(stored)
    },
    viewUserDetails(user) {
      this.selectedUser = { ...user }
    },
    toggleUserStatus(user) {
      const index = this.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        this.users[index].isActive = !this.users[index].isActive
        localStorage.setItem('users', JSON.stringify(this.users))
        if (this.selectedUser?.id === user.id) {
          this.selectedUser.isActive = this.users[index].isActive
        }
      }
    },
    getUserOrders(userId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      return orders.filter(o => o.customerId === userId)
    },
    userOrdersCount(userId) {
      return this.getUserOrders(userId).length
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    }
  },
  computed: {
    filteredUsers() {
      const q = this.userSearchQuery.toLowerCase()
      return this.users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q))
      )
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.users-table {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  margin-top: 20px;
}
.users-table table {
  width: 100%;
  border-collapse: collapse;
}
.users-table th,
.users-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}
.status-active {
  color: #28a745;
  font-weight: 500;
}
.status-inactive {
  color: #dc3545;
  font-weight: 500;
}
.user-details-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  border-radius: 8px;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
.profile-section {
  flex: 1;
  min-width: 280px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}
.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.close-modal {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.order-item {
  background: #fff;
  padding: 10px;
  border-left: 3px solid #42b983;
  margin-top: 10px;
  border-radius: 5px;
}
</style>
