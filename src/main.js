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

const app = createApp(App)
app.component('nav-bar', NavBar)
app.component('perfume', Perfume)
app.component('cloth', Clothes)
app.component('jewelry', Jewelry)
app.use(createPinia())
app.use(router)

app.mount('#app')
