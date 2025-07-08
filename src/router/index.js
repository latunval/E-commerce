import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/Product.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-details',
      component: () => import('../views/ProductDetails.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/Cart.vue'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/CheckOut.vue'),
    },
    {
      path: '/thank-you',
      name: 'ThankYou',
      component: () => import('@/views/ThankYou.vue'), // or './pages/ThankYou.vue'
    },
    {
      path: '/invoice/:orderId',
      name: 'Invoice',
      component: () => import('@/views/Invoice.vue'),
    },
     {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminDashBoard.vue'),
    },
    {
      path: '/forget',
      name: 'forget',
      component: () => import('@/components/ForgotPassword.vue'),
    },
      {
      path: '/user-dash',
      name: 'user-dash',
      component: () => import('@/views/UserDashBoard.vue'),
    },
  ],
})

export default router
