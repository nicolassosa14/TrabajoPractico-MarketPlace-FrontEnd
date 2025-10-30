<template>
    <div v-if="modelValue" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agregar Nueva Dirección</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <form @submit.prevent="addAddress" id="add-address-form">
                                <div class="mb-3">
                                    <label for="street_address" class="form-label">Dirección</label>
                                    <input type="text" class="form-control" id="street_address" v-model="newAddress.street_address" required>
                                </div>
                                <div class="mb-3">
                                    <label for="city" class="form-label">Ciudad</label>
                                    <input type="text" class="form-control" id="city" v-model="newAddress.city" required>
                                </div>
                                <div class="mb-3">
                                    <label for="postal_code" class="form-label">Código Postal</label>
                                    <input type="text" class="form-control" id="postal_code" v-model="newAddress.postal_code" required>
                                </div>
                                <div class="mb-3">
                                    <label for="details" class="form-label">Detalles (opcional)</label>
                                    <textarea class="form-control" id="details" v-model="newAddress.details" rows="2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-6">
                            <InteractiveMap 
                                :address="addressForModalMap" 
                                :isEditable="true"
                                @address-updated="updateAddressForm"
                                style="height: 300px;" 
                            />
                            <div v-if="isGeocoding" class="d-flex align-items-center justify-content-center mt-2 text-muted">
                                <div class="spinner-border spinner-border-sm text-danger" role="status"></div>
                                <span class="ms-2">Buscando ubicación...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isAddingAddress">Cancelar</button>
                    <button type="submit" form="add-address-form" class="btn btn-danger" :disabled="isAddingAddress">
                        <span v-if="isAddingAddress" class="spinner-border spinner-border-sm me-2"></span>
                        Guardar Dirección
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { usePostData } from '../composables/postData';
import InteractiveMap from './InteractiveMap.vue';

const props = defineProps({
    modelValue: Boolean,
    userId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'address-saved']);

const { PostData } = usePostData();

const newAddress = ref({
    street_address: '',
    city: '',
    postal_code: '',
    details: ''
});
const isAddingAddress = ref(false);
const addressForModalMap = ref(null);
const isGeocoding = ref(false);
let debounceTimer = null;

const closeModal = () => {
    emit('update:modelValue', false);
};

const updateAddressForm = (addressData) => {
    newAddress.value.street_address = addressData.street_address;
    newAddress.value.city = addressData.city;
    newAddress.value.postal_code = addressData.postal_code;
};

watch(newAddress, (currentAddress) => {
    clearTimeout(debounceTimer);
    if (!currentAddress.street_address || !currentAddress.city) {
        return;
    }
    debounceTimer = setTimeout(async () => {
        isGeocoding.value = true;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(currentAddress.street_address)}&city=${encodeURIComponent(currentAddress.city)}&postalcode=${encodeURIComponent(currentAddress.postal_code)}`);
            const geocodingData = await response.json();

            if (geocodingData && geocodingData.length > 0) {
                const { lat, lon } = geocodingData[0];
                addressForModalMap.value = { 
                    ...currentAddress, 
                    latitude: lat, 
                    longitude: lon 
                };
            } else {
                addressForModalMap.value = null;
            }
        } catch (error) {
            console.error('Error during live geocoding:', error);
            addressForModalMap.value = null;
        } finally {
            isGeocoding.value = false;
        }
    }, 700);
}, { deep: true });

const addAddress = async () => {
    isAddingAddress.value = true;
    try {
        let lat, lon;

        if (addressForModalMap.value && addressForModalMap.value.latitude) {
            lat = addressForModalMap.value.latitude;
            lon = addressForModalMap.value.longitude;
        } else {
            const addressToGeocode = newAddress.value;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(addressToGeocode.street_address)}&city=${encodeURIComponent(addressToGeocode.city)}&postalcode=${encodeURIComponent(addressToGeocode.postal_code)}`);
            const geocodingData = await response.json();

            if (!geocodingData || geocodingData.length === 0) {
                throw new Error('No se pudieron encontrar las coordenadas para la dirección ingresada. Por favor, verifica los datos.');
            }
            const coords = geocodingData[0];
            lat = coords.lat;
            lon = coords.lon;
        }

        const payload = {
            ...newAddress.value,
            user_id: props.userId,
            lat: lat,
            long: lon
        };

        const postResponse = await PostData('http://localhost:3000/api/address', payload);

        if (postResponse.error) {
            throw new Error(postResponse.error);
        }

        emit('address-saved');
        closeModal();

    } catch (error) {
        console.error('Error al agregar la dirección:', error);
        alert('Error al agregar la dirección: ' + error.message);
    } finally {
        isAddingAddress.value = false;
    }
};

</script>
