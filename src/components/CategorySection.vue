<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const visibleCategories = ref([])
const showMore = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data


    visibleCategories.value = categories.value.slice(0, 4)


    showMore.value = categories.value.length > 4
  } catch (error) {
    console.error('Error al cargar las categorías:', error)
  }
})

function goToAllCategories() {
  router.push('/categorias')
}
</script>

<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Categorías Destacadas</h2>

      <div class="row justify-content-center mt-4">
        <div v-for="cat in visibleCategories" :key="cat.id" class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="text-center bg-white shadow-sm p-3 rounded categorycard"
            @click="router.push({ path: '/categorias', query: { categoria: cat.name } })">


            <a class="text-decoration-none text-dark">
              <img v-if="cat.image_url" :src="String(cat.image_url)" :alt="cat.name" class="img-fluid mb-2 rounded"
                style="max-height: 120px; object-fit: cover" />

              <h4 class="mt-2">{{ cat.name.toUpperCase() }}</h4>
            </a>
          </div>
        </div>
      </div>

      <div v-if="showMore" class="text-center mt-3">
        <button class="btn btn-outline-primary" @click="goToAllCategories">
          Ver más categorías
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categorycard {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.categorycard:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  cursor: pointer;
}

.categorycard i {
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
</style>
