<template>
  <div v-if="show" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Agregar Nuevo Vehículo</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addVehicle">
            <div class="mb-3">
              <label for="vehicleType" class="form-label">Tipo de Vehículo</label>
              <input
                type="text"
                class="form-control"
                id="vehicleType"
                v-model="vehicleType"
                placeholder="Ej: Moto, Auto, Camioneta"
                required
                :disabled="isAdding"
              >
            </div>
            <div class="mb-3">
              <label for="licensePlate" class="form-label">Patente</label>
              <input
                type="text"
                class="form-control"
                id="licensePlate"
                v-model="licensePlate"
                placeholder="Ej: ABC 123"
                required
                :disabled="isAdding"
              >
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isAdding">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-danger"
            @click="addVehicle"
            :disabled="!vehicleType || !licensePlate || isAdding"
          >
            <span v-if="isAdding" class="spinner-border spinner-border-sm me-2"></span>
            Agregar Vehículo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { usePostData } from '@/composables/postData';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'vehicle-added']);

const { PostData, error: postError, loading: isAdding } = usePostData();

const vehicleType = ref('');
const licensePlate = ref('');

const closeModal = () => {
  vehicleType.value = '';
  licensePlate.value = '';
  emit('close');
};

const addVehicle = async () => {
  if (!vehicleType.value || !licensePlate.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  console.log(vehicleType.value, licensePlate.value)

  try {
    const success = await PostData(`http://localhost:3000/api/logistics/`, {
      user_id: props.userId,
      vehicle_type: vehicleType.value,
      license_plate: licensePlate.value,
      is_available: true
    });

    if (success) {
      alert('Vehículo agregado con éxito.');
      emit('vehicle-added');
      closeModal();
    } else {
      throw new Error(postError.value ? postError.value.message : 'Error desconocido al agregar el vehículo.');
    }
  } catch (error) {
    console.error('Error al agregar vehículo:', error);
    alert('Error al agregar vehículo: ' + error.message);
  }
};
</script>

<style scoped>
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
</style>
