<template>
  <div class="container mt-5">
    <h1 class="mb-4">Órdenes de Mi Local</h1>
    <div v-if="orders.length === 0" class="alert alert-info">
      Aún no tienes órdenes.
    </div>
    <div v-else>
      <div class="accordion" id="ordersAccordion">
        <div v-for="order in orders" :key="order.orderId" class="accordion-item mb-3">
          <h2 class="accordion-header" :id="'heading' + order.orderId">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + order.orderId" aria-expanded="false" :aria-controls="'collapse' + order.orderId">
              <div class="d-flex justify-content-between w-100">
                <span>Orden #{{ order.orderId }} - Estado: <span class="badge bg-primary me-3">{{ order.status }}</span></span>
                <span>Total: ${{ order.totalAmount }}</span>
              </div>
            </button>
          </h2>
          <div :id="'collapse' + order.orderId" class="accordion-collapse collapse" :aria-labelledby="'heading' + order.orderId"
            data-bs-parent="#ordersAccordion">
            <div class="accordion-body">
              <p><strong>Fecha:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
              <p><strong>Dirección de Envío:</strong> {{ order.direccion }}</p>
              <h5>Productos</h5>
              <ul class="list-group">
                <li v-for="(item, idx) in order.items" :key="item.id || idx"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  <span>{{ item.nombre || 'Producto' }}</span>
                  <span>Cantidad: {{ item.cantidad }}</span>
                  <span>Precio: ${{ item.precio }}</span>
                </li>
              </ul>
              <h5 class="mt-3">Subtotal: ${{ order.subtotal }}</h5>
              <h6>Envío: ${{ order.deliveryFee }}</h6>
              <h6>Descuento: ${{ order.discountApplied }}</h6>
              <h6>Impuestos: ${{ order.taxes }}</h6>
              <h5 class="mt-2">Total: ${{ order.totalAmount }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);

onMounted(() => {
  const stored = localStorage.getItem('ordenes');
  if (stored) {
    try {
      orders.value = JSON.parse(stored);
    } catch (e) {
      orders.value = [];
    }
  }
});

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
