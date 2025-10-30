<template>
  <div class="container mt-4">
    <h2 class="mb-4">Panel de Conductor</h2>

    <div v-if="loading" class="loading-container d-flex justify-content-center align-items-center">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="errorAPI" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ errorAPI }}
    </div>

    <div v-else-if="vehicles && vehicles.length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Mis Vehículos</h5>
            <button @click="openAddVehicleModal" class="btn btn-danger btn-sm">
                <i class="bi bi-plus-circle me-1"></i> Agregar Vehículo
            </button>
        </div>
      <ul class="list-group">
        <li v-for="vehicle in vehicles" :key="vehicle.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <p class="mb-1"><strong>Vehículo:</strong> {{ vehicle.vehicle_type.toUpperCase() }}</p>
            <p class="mb-0 text-muted"><strong>Patente:</strong> {{ vehicle.license_plate }}</p>
          </div>
          <div class="d-flex align-items-center">
            <span class="me-3">{{ vehicle.is_available ? 'Disponible' : 'No Disponible' }}</span>
            <switchMotion v-model="vehicle.is_available" @update:modelValue="val => handleAvailabilityChange(vehicle, val)" />
          </div>
        </li>
      </ul>
      
    </div>

    <div v-else>
      <p class="text-center">No tienes vehículos registrados.</p>
      <div class="text-center mt-3">
        <button @click="openAddVehicleModal" class="btn btn-danger">
            <i class="bi bi-plus-circle me-1"></i> Agregar tu primer Vehículo
        </button>
      </div>
    </div>

    <!-- Modal para agregar vehículo -->
    <ModalAgregarVehiculo
      :show="showAddVehicleModal"
      :userId="userId"
      @close="closeAddVehicleModal"
      @vehicle-added="refreshVehicles"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useGetData } from '@/composables/getData';
import { usePatchData } from '@/composables/patchData';
import switchMotion from '../components/switchMotion.vue';
import ModalAgregarVehiculo from '../components/ModalAgregarVehiculo.vue';

const { getData, data: vehicles, error: errorAPI, loading } = useGetData();
const { patchData, error: patchError } = usePatchData();

const showAddVehicleModal = ref(false);
const userId = ref(null);

const openAddVehicleModal = () => {
  showAddVehicleModal.value = true;
};

const closeAddVehicleModal = () => {
  showAddVehicleModal.value = false;
};

const refreshVehicles = () => {
  if (userId.value) {
    getData(`http://localhost:3000/api/logistics/${userId.value}`);
  }
};

const handleAvailabilityChange = async (vehicle, newValue) => {
  const originalValue = !newValue;
  
  try {
    const success = await patchData(`http://localhost:3000/api/logistics/status/`, {
      id: vehicle.id,
      is_available: newValue,
      user_id: vehicle.user_id
    }, true);

    if (!success) {
      throw new Error(patchError.value ? patchError.value.message : 'Error desconocido al actualizar la disponibilidad.');
    }

  } catch (error) {
    console.error('Error al actualizar la disponibilidad del vehículo:', error);
    alert('No se pudo actualizar la disponibilidad. Inténtalo de nuevo.');
    // Revertir el cambio en la UI si la API falla
    vehicle.is_available = originalValue;
  }
};

onMounted(() => {
  userId.value = localStorage.getItem('userId');
  refreshVehicles();
});
</script>

<style scoped>
.loading-container {
  min-height: 200px;
}
.list-group-item {
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
</style>
