import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidadePlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon'
import { registerSW } from 'virtual:pwa-register'

import './assets/base.css'
import './assets/main.css'

registerSW({ immediate: true })

let app: null | AppType

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidadePlugin)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
