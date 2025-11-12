<template>
    <div class="container mt-4">
    <h2 class="mb-3 text-center">Gestión de Pagos</h2>
    <p class="text-center text-muted">Esta es la vista principal de pagos.</p>

    <PaymentForm />
    <hr />
    <PaymentList />
    </div>
</template>

<script setup>
import PaymentForm from '@/components/payments/PaymentForm.vue'
import PaymentList from '@/components/payments/PaymentList.vue'
</script>
