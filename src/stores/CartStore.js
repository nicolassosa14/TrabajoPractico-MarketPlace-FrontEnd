import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

    const finalizarCompra = async (direccionCompleta, driverId, addressId = null) => {
        if (items.value.length === 0) {
            error.value = 'Tu carrito está vacío';
            return null;
        }

        const direccionTrim = String(direccionCompleta ?? '').trim();
        if (!direccionTrim) {
            error.value = 'Debes ingresar una dirección de envío';
            return null;
        }

        if (!driverId || String(driverId).trim() === '') {
            error.value = 'Debes asignar un driver';
            return null;
        }

        loading.value = true;
        error.value = null;

        try {
            // Simular delay de procesamiento
            await new Promise(resolve => setTimeout(resolve, 1500));

            // calcular montos
            const subtotal = items.value.reduce((s, item) => {
                const price = Number(item.precio ?? item.price ?? 0);
                const qty = Number(item.cantidad ?? 0);
                return s + (Number.isFinite(price) && Number.isFinite(qty) ? price * qty : 0);
            }, 0);

            const deliveryFee = 1500;
            const discountApplied = 0;
            const taxes = 0;
            const totalAmount = subtotal + deliveryFee - discountApplied + taxes;

            // Generar orden simulada
            const orderId = 'ORD-' + Date.now();
            const pedido = {
                orderId,
                userId: localStorage.getItem('userId') || 'user-123',
                vendorId: String(items.value[0]?.vendorId ?? 'vendor-001'),
                addressId: addressId || ('addr-' + Date.now()),
                subtotal: Number(subtotal),
                deliveryFee: Number(deliveryFee),
                discountApplied: Number(discountApplied),
                taxes: Number(taxes),
                totalAmount: Number(totalAmount),
                status: 'pending',
                driverId: String(driverId),
                direccion: direccionCompleta,
                items: items.value.map(item => ({
                    id: item.id,
                    nombre: item.name,
                    precio: Number(item.precio ?? item.price ?? 0),
                    cantidad: item.cantidad,
                    subtotal: (Number(item.precio ?? item.price ?? 0) * item.cantidad)
                })),
                createdAt: new Date().toISOString()
            };

            console.log('📦 Orden creada:', pedido);

            // Guardar orden en localStorage (simulación de BD)
            const ordenes = JSON.parse(localStorage.getItem('ordenes') || '[]');
            ordenes.push(pedido);
            localStorage.setItem('ordenes', JSON.stringify(ordenes));

            console.log('✅ Orden guardada en localStorage');

            // Guardar orden actual para usar en pagos
            localStorage.setItem('currentOrder', JSON.stringify(pedido));

            console.log('✅ currentOrder guardado en localStorage');
            console.log('Contenido currentOrder:', localStorage.getItem('currentOrder'));

            vaciarCarrito();
            loading.value = false;

            return { apiResponse: pedido, orderId };
        } catch (err) {
            error.value = 'Error al procesar la compra: ' + err.message;
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
