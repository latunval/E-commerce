import "./assets/main.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import NavBar from './components/NavBar.vue'
import Clothes from './components/Clothes.vue'
import Jewelry from './components/Jewelry.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Perfume from './components/Perfume.vue'
import Footers from './components/Footer.vue'
import HeroSection from "./components/HeroSection.vue"

import '@fortawesome/fontawesome-free/css/all.css'
import WishList from "./components/WishList.vue"
const app = createApp(App)
app.component('wish-list', WishList)
app.component('nav-bar', NavBar)
app.component('hero-section', HeroSection)
app.component('footers', Footers)
app.component('perfume', Perfume)
app.component('cloth', Clothes)
app.component('jewelry', Jewelry)
app.use(createPinia())
app.use(router)

app.mount('#app')
