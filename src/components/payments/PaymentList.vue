<template>
    <div class="card p-3 shadow-sm">
    <h5 class="card-title mb-3">Pagos registrados</h5>

    <p v-if="store.loading" class="text-muted">Cargando...</p>
    <p v-if="store.error" class="text-danger">{{ store.error }}</p>

    <ul v-if="store.pagos.length && !store.loading" class="list-group">
        <li v-for="p in store.pagos" :key="p.id" class="list-group-item">
        <strong>{{ p.paymentMethod }}</strong> — ${{ p.amount }}  
        <span class="badge bg-info text-dark ms-2">{{ p.status }}</span>
        </li>
    </ul>

    <p v-else-if="!store.loading" class="text-muted">No hay pagos registrados todavía.</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePaymentsStore } from '@/stores/payments'

const store = usePaymentsStore()

onMounted(() => {
    store.fetchPagos()
})
</script>
