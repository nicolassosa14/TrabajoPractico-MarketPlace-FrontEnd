<template>
  <div class="container my-5">
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <h1 class="card-title text-center mb-4" style="color: var(--primary-red);">Resumen de tu Orden</h1>

        <div v-if="orderActual">
          <!-- Resumen de Orden -->
          <div class="card mb-4 border-0 bg-light">
            <div class="card-body">
              <h5 class="card-title">📦 Detalles de tu Pedido</h5>
              <hr>
              <p><strong>Número de Orden:</strong> {{ orderActual.orderId }}</p>
              <p><strong>Dirección de Entrega:</strong> {{ orderActual.direccion }}</p>
              <p><strong>Driver Asignado:</strong> {{ orderActual.driverId }}</p>
              <hr>
              <p><strong>Subtotal:</strong> ${{ orderActual.subtotal.toFixed(2) }}</p>
              <p><strong>Costo de envío:</strong> $1500.00</p>
              <p class="fw-bold" style="font-size: 1.2rem; color: var(--primary-red);">
                Total: ${{ (orderActual.totalAmount + 1500).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Métodos de Pago -->
          <div class="mb-4">
            <h5 class="mb-3">💳 Selecciona un método de pago:</h5>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div
                  class="card payment-method"
                  :class="{ 'selected': metodoPago === 'tarjeta' }"
                  @click="metodoPago = 'tarjeta'">
                  <div class="card-body text-center">
                    <i class="bi bi-credit-card" style="font-size: 2.5rem; color: var(--primary-red);"></i>
                    <p class="mt-3 mb-0"><strong>Tarjeta de Crédito</strong></p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div
                  class="card payment-method"
                  :class="{ 'selected': metodoPago === 'efectivo' }"
                  @click="metodoPago = 'efectivo'">
                  <div class="card-body text-center">
                    <i class="bi bi-cash-coin" style="font-size: 2.5rem; color: var(--primary-red);"></i>
                    <p class="mt-3 mb-0"><strong>Efectivo</strong></p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div
                  class="card payment-method"
                  :class="{ 'selected': metodoPago === 'transferencia' }"
                  @click="metodoPago = 'transferencia'">
                  <div class="card-body text-center">
                    <i class="bi bi-bank" style="font-size: 2.5rem; color: var(--primary-red);"></i>
                    <p class="mt-3 mb-0"><strong>Transferencia</strong></p>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <div
                  class="card payment-method"
                  :class="{ 'selected': metodoPago === 'billetera' }"
                  @click="metodoPago = 'billetera'">
                  <div class="card-body text-center">
                    <i class="bi bi-wallet2" style="font-size: 2.5rem; color: var(--primary-red);"></i>
                    <p class="mt-3 mb-0"><strong>Billetera Virtual</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="d-grid gap-2 mt-4">
            <button
              class="btn btn-primary btn-lg"
              @click="confirmarPago"
              :disabled="!metodoPago || procesando">
              <span v-if="procesando" class="spinner-border spinner-border-sm me-2"></span>
              {{ procesando ? 'Procesando...' : 'Pagar Ahora' }}
            </button>
            <button class="btn btn-outline-secondary" @click="volver">Volver al Carrito</button>
          </div>
        </div>

        <div v-else class="alert alert-warning text-center">
          <p>No hay orden pendiente</p>
          <RouterLink to="/" class="btn btn-primary">Volver a la tienda</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

const router = useRouter();
const orderActual = ref(null);
const metodoPago = ref('');
const procesando = ref(false);

onMounted(() => {
  const orden = localStorage.getItem('currentOrder');
  if (orden) {
    orderActual.value = JSON.parse(orden);
  }
});

const confirmarPago = async () => {
  if (!metodoPago.value) return;

  procesando.value = true;

  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Guardar pago
  const pago = {
    orderId: orderActual.value.orderId,
    metodoPago: metodoPago.value,
    monto: orderActual.value.totalAmount + 1500,
    estado: 'completado',
    fecha: new Date().toISOString(),
    driverId: orderActual.value.driverId,
    direccion: orderActual.value.direccion
  };

  const pagos = JSON.parse(localStorage.getItem('pagos') || '[]');
  pagos.push(pago);
  localStorage.setItem('pagos', JSON.stringify(pagos));

  procesando.value = false;

  // Redirigir a confirmación
  router.push(`/confirmacion?orderId=${orderActual.value.orderId}`);
};

const volver = () => {
  router.push('/cart');
};
</script>

<style scoped>
.payment-method {
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: var(--primary-red);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.payment-method.selected {
  border-color: var(--primary-red);
  background-color: rgba(255, 0, 0, 0.05);
}

.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  color: black;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--dark-red);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
