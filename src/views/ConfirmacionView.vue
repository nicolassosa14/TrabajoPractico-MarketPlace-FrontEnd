<template>
  <div class="container my-5">
    <div class="card shadow-lg border-0">
      <div class="card-body text-center py-5">
        <div style="font-size: 5rem; color: #28a745; margin-bottom: 20px;">
          ✅
        </div>

        <h1 class="card-title mb-2" style="color: var(--primary-red);">¡Pago Realizado Exitosamente!</h1>
        <p class="text-muted mb-4">Tu orden ha sido confirmada y está siendo preparada</p>

        <div v-if="orderData" class="alert alert-success mb-4">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Número de Orden:</strong><br>{{ orderData.orderId }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Método de Pago:</strong><br>{{ getNombreMetodoPago(orderData.metodoPago) }}</p>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-6">
              <p><strong>Total Pagado:</strong><br><span style="font-size: 1.5rem; color: var(--primary-red);">${{ orderData.monto.toFixed(2) }}</span></p>
            </div>
            <div class="col-md-6">
              <p><strong>Driver Asignado:</strong><br>{{ orderData.driverId }}</p>
            </div>
          </div>
          <hr>
          <p><strong>Dirección de Entrega:</strong><br>{{ orderData.direccion }}</p>
        </div>

        <div class="alert alert-info">
          <h6>📍 Tu pedido será entregado en aproximadamente <strong>30-45 minutos</strong></h6>
          <p class="mb-0">Recibirás una notificación cuando el driver esté en camino</p>
        </div>

        <button class="btn btn-primary btn-lg mt-4" @click="irAlInicio">
          Volver a la Tienda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const orderData = ref(null);

const getNombreMetodoPago = (metodo) => {
  const metodos = {
    tarjeta: '💳 Tarjeta de Crédito',
    efectivo: '💵 Efectivo',
    transferencia: '🏦 Transferencia Bancaria',
    billetera: '📱 Billetera Digital'
  };
  return metodos[metodo] || metodo;
};

onMounted(() => {
  const orderId = route.query.orderId;

  if (orderId) {
    const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
    const pago = pagos.find(p => p.orderId === orderId);

    if (pago) {
      orderData.value = pago;
    }
  }
});

const irAlInicio = () => {
  localStorage.removeItem('currentOrder');
  router.push('/');
};
</script>

<style scoped>
.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  color: white;
}

.btn-primary:hover {
  background-color: var(--dark-red);
}

.card {
  border-radius: 15px;
}

.alert {
  border-radius: 10px;
  border: none;
}
</style>
