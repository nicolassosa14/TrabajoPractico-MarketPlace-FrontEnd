<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Carrito de Compras</h1>

    <div v-if="cartStore.items.length === 0" class="alert alert-danger text-center">
      Tu carrito está vacío.
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.items" :key="item.id">
              <td>
                <div class="d-flex align-items-center">
                  <img :src="item.imagen" :alt="item.nombre" class="img-fluid rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
                  <div>
                    <h5 class="mb-0">{{ item.nombre }}</h5>
                    <p class="mb-0 text-muted">Local que lo vende</p>
                    <small class="text-muted">{{ item.descripcion }}</small>
                  </div>
                </div>
              </td>
              <td>${{ item.precio }}</td>
              <td>
                <div class="input-group" style="width: 120px;">
                  <button class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity(item)">-</button>
                  <input type="text" class="form-control text-center" :value="item.cantidad" readonly>
                  <button class="btn btn-outline-secondary btn-sm" @click="increaseQuantity(item)">+</button>
                </div>
              </td>
              <td>${{ (item.precio * item.cantidad) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="cartStore.eliminarDelCarrito(item.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="row justify-content-end mt-4">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Resumen del Pedido</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Subtotal
                  <span>${{ cartStore.totalPrecio }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Envío
                  <span>Gratis</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
                  Total
                  <span>${{ cartStore.totalPrecio }}</span>
                </li>
              </ul>
              <div class="d-grid gap-2 mt-3">
                <button class="btn btn-primary">Proceder al Pago</button>
                <button class="btn btn-outline-danger" @click="cartStore.vaciarCarrito()">Vaciar Carrito</button>
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

const cartStore = useCartStore();

const increaseQuantity = (item) => {
  item.cantidad++;
  cartStore.actualizarCantidad(item.id, item.cantidad);
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
.table > tbody > tr > td {
  vertical-align: middle;
}
</style>
