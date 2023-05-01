import { defineStore } from 'pinia'
import { auth, usersCollections } from '@/includes/firebase'
import type { RegisterFormType } from '@/types/formTypes'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values: RegisterFormType) {
      await auth.createUserWithEmailAndPassword(values.email, values.password)

      await usersCollections.add({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      this.userLoggedIn = true
    }
  }
})
