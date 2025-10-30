<template>
    <div class="mt-4 text-start">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="fw-bold mb-0">Direcciones Agregadas</h5>
            <button @click="showAddressModal = true" class="btn btn-danger btn-sm">
                <i class="bi bi-plus-circle me-1"></i> Agregar
            </button>
        </div>
        
        <div v-if="addresses && addresses.length">
            <div class="row">
                <div class="col-lg-6 mb-3 mb-lg-0">
                    <div class="mb-3">
                        <input type="search" v-model="searchQuery" placeholder="Buscar dirección..." class="form-control search-direcciones">
                    </div>
                    <ul class="list-group">
                        <li v-for="(address, index) in paginatedAddresses" :key="index" 
                            class="list-group-item direction-list-item list-group-item-action d-flex align-items-center"
                            @click="selectAddress(address)"
                            :class="{ active: selectedAddress === address }"
                            style="cursor: pointer;">
                            <i class="bi bi-geo-alt me-3"></i>
                            <div>
                                <div class="fw-bold">{{ address.street_address }}</div>
                                <small class="text-muted">{{ address.city }}, {{ address.postal_code }}</small>
                            </div>
                        </li>
                    </ul>
                    <ComponentePaginacion 
                        :current-page="currentPage" 
                        :total-pages="totalPages" 
                        @page-changed="handlePageChange"
                    />
                </div>
                <div class="col-lg-6">
                    <InteractiveMap :address="selectedAddress" style="height: 400px;" />
                </div>
            </div>
        </div>
        <div v-else class="alert alert-light text-center">
            No tienes ninguna dirección guardada.
        </div>

        <ModalAgregarDireccion v-if="userId" v-model="showAddressModal" :user-id="userId" @address-saved="handleAddressSaved" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import InteractiveMap from './InteractiveMap.vue';
import ModalAgregarDireccion from './ModalAgregarDireccion.vue';
import ComponentePaginacion from './ComponentePaginacion.vue';

const props = defineProps({
    addresses: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['addresses-updated']);

const selectedAddress = ref(null);
const showAddressModal = ref(false);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const filteredAddresses = computed(() => {
    if (!searchQuery.value) {
        return props.addresses;
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return props.addresses.filter(address => 
        (address.street_address?.toLowerCase().includes(lowerCaseQuery)) ||
        (address.city?.toLowerCase().includes(lowerCaseQuery)) ||
        (address.postal_code?.toLowerCase().includes(lowerCaseQuery))
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredAddresses.value.length / itemsPerPage.value);
});

const paginatedAddresses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredAddresses.value.slice(start, end);
});

const selectAddress = (address) => {
    selectedAddress.value = address;
};

const handleAddressSaved = () => {
    emit('addresses-updated');
};

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

watch(searchQuery, () => {
    currentPage.value = 1;
});

</script>

<style scoped>
.direction-list-item {
    font-size: 0.95rem;
    color: #495057;
}

.direction-list-item.active {
    z-index: 2;
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
}
.direction-list-item.active:hover {
    z-index: 2;
    color: black;
}

.direction-list-item:hover {
    transform: scale(1.005);
    background-color: #fcfcfc;
}

.search-direcciones:focus {
  border-color: var(--primary-red) !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25) !important;
}

.search-direcciones:focus + .input-group-append .btn-outline-danger {
  border-color: var(--primary-red) !important;
  color: var(--primary-red) !important;
}
</style>
