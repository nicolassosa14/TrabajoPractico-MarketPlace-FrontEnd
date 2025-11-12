<template>
    <div class="card p-3 shadow-sm mb-4">
        <h5 class="card-title mb-3">Registrar nuevo pago</h5>

        <form @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label class="form-label">ID de Orden</label>
            <input v-model="orderId" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
            <label class="form-label">Monto</label>
            <input v-model.number="amount" type="number" class="form-control" required />
        </div>

        <div class="mb-3">
            <label class="form-label">Método de pago</label>
            <select v-model="paymentMethod" class="form-select" required>
            <option value="cash">Efectivo</option>
            <option value="mercado_pago">Mercado Pago</option>
            <option value="paypal">PayPal</option>
            <option value="credit_card">Tarjeta de Crédito</option>
            </select>
        </div>

        <button class="btn btn-primary w-100" :disabled="store.loading">
            {{ store.loading ? 'Enviando...' : 'Registrar Pago' }}
        </button>

        <p v-if="store.error" class="text-danger mt-2">{{ store.error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePaymentsStore } from '@/stores/payments'

const store = usePaymentsStore()

const orderId = ref('')
const amount = ref(0)
const paymentMethod = ref('cash')

const handleSubmit = async () => {
    await store.crearPago({
        orderId: orderId.value,
        amount: amount.value,
        paymentMethod: paymentMethod.value,
    })
    orderId.value = ''
    amount.value = 0
    paymentMethod.value = 'cash'
}
</script>
