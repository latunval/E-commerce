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
      path: '/account',
      name: 'Account',
      component: () => import('@/views/Account.vue'),
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
  ],
})

export default router
