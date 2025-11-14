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
                      <button class="btn btn-outline-danger btn-sm" @click="decreaseQuantity(item)">-</button>
                      <input type="text" class="form-control text-center" :value="item.cantidad" readonly>
                      <button class="btn btn-outline-danger btn-sm" @click="increaseQuantity(item)">+</button>
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
                      <span>$1500.00</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light fw-bold h5">
                      Total
                      <span>${{ cartStore.totalPrecio ? (cartStore.totalPrecio + 1500).toFixed(2) : '0.00' }}</span>
                    </li>
                  </ul>

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

    <div class="modal" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Dirección de Envío</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <label for="direccionSeleccion" class="form-label">Seleccionar dirección guardada (opcional):</label>
            <select id="direccionSeleccion" v-model="selectedAddressId" class="form-select mb-3">
              <option value="">-- Ingresar nueva dirección --</option>
              <option v-for="(addr, idx) in addresses" :key="idx" :value="addr.id ?? addr._id ?? addr.address_id">
                {{ addr.street_address }}{{ addr.city ? ', ' + addr.city : '' }}{{ addr.postal_code ? ' - ' + addr.postal_code : '' }}
              </option>
            </select>

            <div v-if="selectedAddress">
              <label class="form-label">Dirección seleccionada:</label>
              <input type="text" class="form-control" :value="selectedAddress.street_address + (selectedAddress.city ? ', ' + selectedAddress.city : '') + (selectedAddress.postal_code ? ', ' + selectedAddress.postal_code : '')" readonly />
            </div>

            <div v-else>
              <label for="direccion" class="form-label">Dirección:</label>
              <input
                id="direccion"
                v-model="direccionIngresada"
                class="form-control"
                placeholder="Calle y número">

              <label for="ciudad" class="form-label mt-3">Ciudad:</label>
              <input
                id="ciudad"
                v-model="ciudadIngresada"
                class="form-control"
                placeholder="Ciudad">

              <label for="codigoPostal" class="form-label mt-3">Código Postal:</label>
              <input
                id="codigoPostal"
                v-model="codigoPostalIngresado"
                class="form-control"
                placeholder="Código Postal">
            </div>

            <label class="form-label mt-3">Driver asignado</label>
            <div class="d-flex align-items-center gap-2">
              <span v-if="asignandoDriver" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <input disabled type="text" class="form-control" :value="driverAsignado" readonly />
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="obtenerDriverAleatorio" :disabled="asignandoDriver">
                Cambiar
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="procesarCompra"
              :disabled="cartStore.loading || !driverAsignado.trim() || (!selectedAddress && !(direccionIngresada.trim() && ciudadIngresada.trim()))">
              {{ cartStore.loading ? 'Procesando...' : 'Confirmar Compra' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/CartStore';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const cartStore = useCartStore();
const router = useRouter();
const mostrarModal = ref(false);
const direccionIngresada = ref('');
const ciudadIngresada = ref('');
const codigoPostalIngresado = ref('');
const driverAsignado = ref(''); // nuevo
const asignandoDriver = ref(false); // nuevo: estado mientras se elige
const addresses = ref([]);
const selectedAddressId = ref('');
const authStore = useAuthStore();

const selectedAddress = computed(() => {
  if (!selectedAddressId.value || !addresses.value) return null;
  return addresses.value.find(a => (a.id === selectedAddressId.value) || (a._id === selectedAddressId.value) || (a.address_id === selectedAddressId.value));
});

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

const obtenerDriverAleatorio = async () => {
  asignandoDriver.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/drivers');
    const drivers = Array.isArray(res.data) ? res.data : res.data?.drivers ?? [];
    if (drivers.length) {
      const elegido = drivers[Math.floor(Math.random() * drivers.length)];
      const id = elegido?.id ?? elegido?._id ?? elegido?.driverId ?? String(elegido);
      driverAsignado.value = String(id);
      return;
    }
  } catch (e) {
    console.warn('No se pudo obtener drivers desde API, usando fallback', e);
  } finally {
    asignandoDriver.value = false;
  }

  driverAsignado.value = 'driver_' + Math.random().toString(36).slice(2, 9);
};

const mostrarModalDireccion = async () => {
  direccionIngresada.value = '';
  ciudadIngresada.value = '';
  codigoPostalIngresado.value = '';
  driverAsignado.value = '';
  selectedAddressId.value = '';
  addresses.value = [];
  mostrarModal.value = true;
  await obtenerDriverAleatorio();
  await fetchAddressesForUser();
};

const fetchAddressesForUser = async () => {
  try {
    const userId = authStore.user?.id || localStorage.getItem('userId');
    if (!userId) return;
    const res = await axios.get(`http://localhost:3000/api/users/profile-with-addresses/${userId}`);
    const data = res.data;
    if (data && Array.isArray(data.addresses)) {
      addresses.value = data.addresses;
    }
  } catch (e) {
    console.warn('No se pudieron cargar direcciones del usuario', e);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const procesarCompra = async () => {
  try {
    let direccionCompleta = '';
    const useAddressId = selectedAddressId.value && selectedAddress.value;
    if (useAddressId) {
      direccionCompleta = `${selectedAddress.value.street_address || ''}${selectedAddress.value.city ? ', ' + selectedAddress.value.city : ''}${selectedAddress.value.postal_code ? ', ' + selectedAddress.value.postal_code : ''}`;
    } else {
      direccionCompleta = `${direccionIngresada.value}, ${ciudadIngresada.value}, ${codigoPostalIngresado.value}`;
    }

    const resultado = await cartStore.finalizarCompra(direccionCompleta, driverAsignado.value, useAddressId ? selectedAddressId.value : null);

    if (resultado && resultado.orderId) {
      cerrarModal();
      setTimeout(() => {
        router.push('/payments');
      }, 300);
    }
  } catch (err) {
    console.error('Error:', err);
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
