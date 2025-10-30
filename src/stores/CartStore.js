import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('carrito', () => {
    const items = ref([]);

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

    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.cantidad, 0);
    });

    const totalPrecio = computed(() => {
        return items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    });

    return {
        items,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
        totalItems,
        totalPrecio
    };
});
