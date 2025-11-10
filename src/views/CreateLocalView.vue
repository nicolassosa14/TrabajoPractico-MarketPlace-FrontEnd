<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  address: '',
  image_url: ''
})

const loading = ref(false)
const error = ref(null)

const crearLocal = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.post('/vendor', form.value)
    console.log("Local creado:", data)
    router.push('/locales')   // volver al listado
  } catch (err) {
    error.value = "No se pudo crear el local."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Crear Nuevo Local</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="crearLocal">

      <div class="mb-3">
        <label class="form-label">Nombre del local</label>
        <input v-model="form.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea v-model="form.description" class="form-control" required></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Dirección</label>
        <input v-model="form.address" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">URL de la imagen</label>
        <input v-model="form.image_url" class="form-control" />
      </div>

      <button class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Crear Local
      </button>

      <RouterLink to="/locales" class="btn btn-secondary ms-2">
        Cancelar
      </RouterLink>
    </form>
  </div>
</template>
