<template>
    <nav v-if="totalPages > 1" class="mt-3 d-flex justify-content-between align-items-center">
        <button class="btn btn-outline-secondary btn-sm" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-outline-secondary btn-sm" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
    </nav>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['page-changed']);

const changePage = (newPage) => {
    if (newPage > 0 && newPage <= props.totalPages) {
        emit('page-changed', newPage);
    }
};
</script>
