import { defineStore } from 'pinia'
import { auth, usersCollections } from '@/includes/firebase'
import type { RegisterFormType } from '@/types/formTypes'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values: RegisterFormType) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )

      await usersCollections.doc(userCredentials.user?.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await userCredentials.user?.updateProfile({
        displayName: values.name
      })

      this.userLoggedIn = true
    }
  }
})
