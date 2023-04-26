import { Form as VeeForm, Field as VeeField } from 'vee-validate'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
  }
}
