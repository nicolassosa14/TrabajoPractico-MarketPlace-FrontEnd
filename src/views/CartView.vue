<template>
  <div class="container my-5">
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <h1 class="card-title text-center mb-4" style="color: var(--primary-red);">Tu Carrito de Compras</h1>

        <div v-if="cartStore.items.length === 0" class="text-center py-5">
          <i class="bi bi-cart-x" style="font-size: 4rem; color: var(--text-light);"></i>
          <h3 class="mt-3">Tu carrito está vacío</h3>
          <p class="text-muted">Añade productos para verlos aquí.</p>
          <RouterLink to="/" class="btn btn-primary mt-3">Ir a la tienda</RouterLink>
        </div>

        <div v-else>
          <div class="table-responsive">
            <table class="table align-middle table-hover">
              <thead class="table-light">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" class="text-center">Precio</th>
                  <th scope="col" class="text-center">Cantidad</th>
                  <th scope="col" class="text-end">Subtotal</th>
                  <th scope="col" class="text-center">Quitar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartStore.items" :key="item.id" class="fade-enter-active">
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="item.image_url" :alt="item.name" class="img-fluid rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
                      <div>
                        <h6 class="mb-0">{{ item.name }}</h6>
                        <small class="text-muted">{{ item.description }}</small>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">${{ (item.price ?? item.precio) }}</td>
                  <td>
                    <div class="input-group justify-content-center" style="width: 120px; margin: auto;">
                      <button class="btn btn-outline-primary btn-sm" @click="decreaseQuantity(item)">-</button>
                      <input type="text" class="form-control text-center" :value="item.cantidad" readonly>
                      <button class="btn btn-outline-primary btn-sm" @click="increaseQuantity(item)">+</button>
                    </div>
                  </td>
                  <td class="text-end fw-bold">${{ ((Number(item.price ?? item.precio) || 0) * (Number(item.cantidad) || 0)).toFixed(2) }}</td>
                  <td class="text-center">
                    <button class="btn btn-danger btn-sm rounded-circle" @click="cartStore.eliminarDelCarrito(item.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row justify-content-end mt-4">
            <div class="col-md-5">
              <div class="card border-0 bg-light">
                <div class="card-body">
                  <h5 class="card-title">Resumen del Pedido</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                      Subtotal
                      <span>${{ cartStore.totalPrecio ? cartStore.totalPrecio.toFixed(2) : '0.00' }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                      Costo de envío
                      <span class="text-success">Gratis</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light fw-bold h5">
                      Total
                      <span>${{ cartStore.totalPrecio ? cartStore.totalPrecio.toFixed(2) : '0.00' }}</span>
                    </li>
                  </ul>

                  <!-- Mostrar errores -->
                  <div v-if="cartStore.error" class="alert alert-danger mt-3" role="alert">
                    {{ cartStore.error }}
                  </div>

                  <div class="d-grid gap-2 mt-4">
                    <button
                      class="btn btn-primary btn-lg text-success"
                      @click="mostrarModalDireccion"
                      :disabled="cartStore.loading">
                      <span v-if="cartStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ cartStore.loading ? 'Procesando...' : 'Finalizar Compra' }}
                    </button>
                    <button class="btn btn-outline-danger" @click="cartStore.vaciarCarrito()">Vaciar Carrito</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ingresar dirección -->
    <div class="modal" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Dirección de Envío</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <label for="direccion" class="form-label">Ingresa tu dirección de envío:</label>
            <textarea
              id="direccion"
              v-model="direccionIngresada"
              class="form-control"
              rows="3"
              placeholder="Calle, número, apartamento, ciudad...">
            </textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="procesarCompra"
              :disabled="cartStore.loading">
              {{ cartStore.loading ? 'Procesando...' : 'Confirmar Compra' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop del modal -->
    <div v-if="mostrarModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/CartStore';
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();
const mostrarModal = ref(false);
const direccionIngresada = ref('');

const increaseQuantity = (item) => {
  cartStore.actualizarCantidad(item.id, item.cantidad + 1);
};

const decreaseQuantity = (item) => {
  if (item.cantidad > 1) {
    cartStore.actualizarCantidad(item.id, item.cantidad - 1);
  } else {
    cartStore.eliminarDelCarrito(item.id);
  }
};

const mostrarModalDireccion = () => {
  direccionIngresada.value = '';
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const procesarCompra = async () => {
  try {
    await cartStore.finalizarCompra(direccionIngresada.value);
    cerrarModal();
    // Redirigir a página de confirmación o inicio
    router.push('/confirmacion'); // Ajusta según tu ruta
  } catch (err) {
    console.error('Error en compra:', err);
  }
};
</script>

<style scoped>
.table > thead {
  color: var(--text-dark);
}

.table-hover tbody tr:hover {
  background-color: var(--super-light-red);
}

.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  color: green;
}

.btn-primary:hover {
  background-color: var(--dark-red);
  border-color: var(--dark-red);
}

.modal-footer .btn-secondary {
  background-color: var(--text-light);
  border-color: var(--text-light);
  color: black;
}

.modal-footer .btn-secondary:hover {
  background-color: var(--text-dark);
  border-color: var(--text-dark);
}
</style>
