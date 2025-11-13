<template>
  <div class="container mt-5">
    <h1 class="mb-4">Órdenes de Mi Local</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      Error al cargar las órdenes: {{ error.message }}
    </div>
    <div v-else-if="!orders || orders.length === 0" class="alert alert-info">
      Aún no tienes órdenes.
    </div>
    <div v-else>
      <div class="accordion" id="ordersAccordion">
        <div v-for="order in orders" :key="order.id" class="accordion-item mb-3">
          <h2 class="accordion-header" :id="'heading' + order.id">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + order.id" aria-expanded="false" :aria-controls="'collapse' + order.id">
              <div class="d-flex justify-content-between w-100">
                <span>Orden #{{ order.id }} - Cliente: {{ order.user.name }}</span>
                <span class="badge bg-primary me-3">{{ order.status }}</span>
              </div>
            </button>
          </h2>
          <div :id="'collapse' + order.id" class="accordion-collapse collapse" :aria-labelledby="'heading' + order.id"
            data-bs-parent="#ordersAccordion">
            <div class="accordion-body">
              <p><strong>Fecha:</strong> {{ new Date(order.createdAt).toLocaleDateString() }}</p>
              <p><strong>Dirección de Envío:</strong> {{ order.address }}</p>
              <h5>Productos</h5>
              <ul class="list-group">
                <li v-for="item in order.items" :key="item.productId"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  {{ item.product.name }}
                  <span>Cantidad: {{ item.quantity }}</span>
                  <span>Precio: ${{ item.price }}</span>
                </li>
              </ul>
              <h5 class="mt-3">Total: ${{ order.total }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useGetData } from '@/composables/getData';

const authStore = useAuthStore();
const { getData, data: orders, loading, error } = useGetData();
orders.value = [];
const { getData: getUserData, data: userData } = useGetData();

const localId = ref(null);

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    await getUserData(`http://localhost:3000/api/users/profile/${userId}`);
    if (userData.value && userData.value.localId) {
      localId.value = userData.value.localId;
      await getData(`http://localhost:3000/api/orders/local/${localId.value}`);
    }
  }
});
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  color: #fff;
  background-color: #dc3545;
}

.accordion-button:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
