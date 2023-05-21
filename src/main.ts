import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidadePlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon'
import progressBar from './includes/progress-bar'

import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

progressBar(router)

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
