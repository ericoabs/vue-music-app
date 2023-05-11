<template>
  <div v-if="showAlert" class="text-white text-center font-bold p-4 mb-4" :class="alertVariant">
    {{ alertMessage }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'AlertBox',
  props: {
    showAlert: {
      type: Boolean,
      required: true
    },
    alertVariant: {
      type: String,
      required: true
    },
    alertMessage: {
      type: String,
      required: true
    }
  }
}
</script>
