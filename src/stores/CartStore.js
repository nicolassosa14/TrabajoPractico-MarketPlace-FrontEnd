import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import orderService from '@/services/orderService';

export const useCartStore = defineStore('carrito', () => {
    const items = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Recuperar del localStorage al inicializar
    if (localStorage.getItem('carrito')) {
        items.value = JSON.parse(localStorage.getItem('carrito'));
    }

    const agregarAlCarrito = (producto) => {
        const itemExistente = items.value.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            items.value.push({ ...producto, cantidad: 1 });
        }
        actualizarLocalStorage();
    };
    const actualizarCantidad = (productoId, nuevaCantidad) => {
        const item = items.value.find(item => item.id === productoId);
        if (item) {
            item.cantidad = nuevaCantidad;
            actualizarLocalStorage();
        }
    };


    const eliminarDelCarrito = (productoId) => {
        const index = items.value.findIndex(item => item.id === productoId);
        if (index !== -1) {
            items.value.splice(index, 1);
            actualizarLocalStorage();
        }
    };

    const vaciarCarrito = () => {
        items.value = [];
        actualizarLocalStorage();
    };

    const actualizarLocalStorage = () => {
        localStorage.setItem('carrito', JSON.stringify(items.value));
    };

    const finalizarCompra = async (direccion) => {
        if (items.value.length === 0) {
            error.value = 'Tu carrito está vacío';
            return null;
        }

        if (!direccion || direccion.trim() === '') {
            error.value = 'Debes ingresar una dirección de envío';
            return null;
        }

        loading.value = true;
        error.value = null;

        try {
            // calcular montos
            const subtotal = items.value.reduce((s, item) => {
                const price = Number(item.precio ?? item.price ?? 0);
                const qty = Number(item.cantidad ?? 0);
                return s + (Number.isFinite(price) && Number.isFinite(qty) ? price * qty : 0);
            }, 0);

            const deliveryFee = 0; // ajustar si corresponde
            const discountApplied = 0; // ajustar si corresponde
            const taxes = 0; // ajustar si corresponde
            const totalAmount = subtotal + deliveryFee - discountApplied + taxes;

            // obtener userId/vendorId/addressId según tu app
            const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = userFromStorage?.id ? String(userFromStorage.id) : 'guest';
            const vendorId = String(items.value[0]?.vendorId ?? items.value[0]?.vendor ?? 'unknown-vendor');
            const addressId = 'manual-' + Date.now(); // si tienes IDs reales, úsalos

            // payload ajustado a lo que acepta la API (sin address, createdAt, items)
            const pedido = {
                userId: String(userId),
                vendorId: String(vendorId),
                addressId: String(addressId),
                subtotal: Number(subtotal),
                deliveryFee: Number(deliveryFee),
                discountApplied: Number(discountApplied),
                taxes: Number(taxes),
                totalAmount: Number(totalAmount),
                status: 'pending' // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
            };

            const respuesta = await orderService.crearOrden(pedido);

            vaciarCarrito();
            loading.value = false;

            return respuesta;
        } catch (err) {
            error.value = 'Error al procesar la compra: ' + (err.response?.data?.message || err.message);
            loading.value = false;
            throw err;
        }
    };

    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.cantidad, 0);
    });

    const totalPrecio = computed(() => {
        return items.value.reduce((total, item) => {
            const price = Number(item.precio ?? item.price ?? 0);
            const qty = Number(item.cantidad ?? 0);
            const line = (Number.isFinite(price) && Number.isFinite(qty)) ? price * qty : 0;
            return total + line;
        }, 0);
    });

    return {
        items,
        loading,
        error,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
        finalizarCompra,
        totalItems,
        totalPrecio
    };
});
