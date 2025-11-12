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
                  <td class="text-center">${{ item.price }}</td>
                  <td>
                    <div class="input-group justify-content-center" style="width: 120px; margin: auto;">
                      <button class="btn btn-outline-primary btn-sm" @click="decreaseQuantity(item)">-</button>
                      <input type="text" class="form-control text-center" :value="item.cantidad" readonly>
                      <button class="btn btn-outline-primary btn-sm" @click="increaseQuantity(item)">+</button>
                    </div>
                  </td>
                  <td class="text-end fw-bold">${{ (item.price * item.cantidad).toFixed(2) }}</td>
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
                      <span>${{ cartStore.totalPrecio.toFixed(2) }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                      Costo de envío
                      <span class="text-success">Gratis</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light fw-bold h5">
                      Total
                      <span>${{ cartStore.totalPrecio.toFixed(2) }}</span>
                    </li>
                  </ul>
                  <div class="d-grid gap-2 mt-4">
                    <button class="btn btn-primary btn-lg">Finalizar Compra</button>
                    <button class="btn btn-outline-danger" @click="cartStore.vaciarCarrito()">Vaciar Carrito</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/CartStore';
import { RouterLink } from 'vue-router';

const cartStore = useCartStore();

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
}

.btn-primary:hover {
  background-color: var(--dark-red);
  border-color: var(--dark-red);
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>
