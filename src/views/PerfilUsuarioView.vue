<script setup>
import { onMounted, ref } from 'vue';
import { useGetData } from '@/composables/getData';
import { usePatchData } from '@/composables/patchData';
import SeccionDirecciones from '../components/SeccionDirecciones.vue';

const { getData, data, error: errorAPI, loading } = useGetData();
const { patchData } = usePatchData();

const defaultImageUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
const imageError = ref(false);
const showPhoneModal = ref(false);
const phoneNumber = ref(null);
const isUpdating = ref(false);

const handleImageError = () => {
    imageError.value = true;
};

const openPhoneModal = () => {
    showPhoneModal.value = true;
};

const closePhoneModal = () => {
    showPhoneModal.value = false;
    phoneNumber.value = '';
};

const updatePhoneNumber = async () => {
    if (!phoneNumber.value) return;
    
    isUpdating.value = true;
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await patchData(`http://localhost:3000/api/users/profile`, {
            phone_number: phoneNumber.value,
            user_id: userId
        });
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        await refreshUserData();
        closePhoneModal();
    } catch (error) {
        console.error('Error al actualizar el número de teléfono:', error);
        alert('Error al actualizar el número de teléfono: ' + error.message);
    } finally {
        isUpdating.value = false;
    }
};

const refreshUserData = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        getData(`http://localhost:3000/api/users/profile-with-addresses/${userId}`);
    }
};

onMounted(() => {
    refreshUserData();
});

</script>

<template>
    <div class="container mt-4">
        <div v-if="loading" class="loading-container d-flex justify-content-center align-items-center">
            <div class="spinner-border text-danger text-center" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        <div v-else-if="data" class="card">
            <div class="card-body text-center">
                <div class="mb-4">
                    <img
                        :src="imageError ? defaultImageUrl : (data.image_url || defaultImageUrl)"
                        :alt="data.first_name"
                        class="rounded-circle profile-image mb-3"
                        @error="handleImageError"
                    >
                </div>
                <h3 class="card-title mb-3 fw-bold">{{ data.first_name }} {{ data.last_name }}</h3>
                <div class="user-info">
                    <p class="mb-2 border border-secondary-subtle">
                        <i class="bi bi-person-badge me-2"></i>
                        <strong>Tipo de Usuario: </strong> {{ data.role.toUpperCase() }}
                    </p>
                    <p class="mb-2 border border-secondary-subtle">
                        <i class="bi bi-telephone me-2"></i>
                        <strong>Número: </strong>
                        <template v-if="data.phone_number">
                            {{ data.phone_number }}
                            <button v-if="!data.phone_number" @click="openPhoneModal" class="btn btn-link btn-sm text-danger">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </template>
                        <template v-else>
                            <button @click="openPhoneModal" class="btn btn-link btn-sm text-danger">
                                <i class="bi bi-plus-circle"></i> Agregar número
                            </button>
                        </template>
                    </p>
                    
                    <!-- Modal para agregar/editar número de teléfono -->
                    <div v-if="showPhoneModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">{{ data.phone_number ? 'Editar' : 'Agregar' }} Número de Teléfono</h5>
                                    <button type="button" class="btn-close" @click="closePhoneModal"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label for="phoneNumber" class="form-label">Número de teléfono:</label>
                                        <input
                                            type="tel"
                                            class="form-control"
                                            id="phoneNumber"
                                            v-model="phoneNumber"
                                            placeholder="Ingresa tu número de teléfono"
                                            :disabled="isUpdating"
                                        >
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="closePhoneModal" :disabled="isUpdating">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-danger" 
                                        @click="updatePhoneNumber"
                                        :disabled="!phoneNumber || isUpdating"
                                    >
                                        <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="mb-2 border border-secondary-subtle">
                        <i class="bi bi-envelope me-2"></i>
                        <strong>Email: </strong> {{ data.email || 'No Agregado' }}
                    </p>
                </div>
                
                <SeccionDirecciones 
                    v-if="data.addresses && data.user_id"
                    :addresses="data.addresses" 
                    :user-id="data.user_id" 
                    @addresses-updated="refreshUserData"
                />

            </div>
        </div>
        <div v-else-if="errorAPI" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorAPI }}
        </div>
    </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}
.profile-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border: 4px solid #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.card {
    border: none;
    box-shadow: 0 0 20px rgba(0,0,0,0.08);
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.user-info {
    max-width: 400px;
    margin: 0 auto;
}

.user-info p {
    padding: 10px;
    border-radius: 8px;
    background-color: #f8f9fa;
    transition: background-color 0.3s ease;
}

.user-info p:hover {
    background-color: #e9ecef;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
}

.modal-dialog {
    margin: 1.75rem auto;
}

.btn-link {
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    margin-left: 0.5rem;
}

.btn-link.text-danger:hover {
    background-color: rgba(220, 53, 69, 0.1);
    border-radius: 4px;
}

.btn-link:hover {
    background-color: rgba(0, 123, 255, 0.1);
    border-radius: 4px;
}
</style>