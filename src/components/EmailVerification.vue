<template>
  <div class="card">
    <div class="card-body">
      <h3 class="text-center mb-4">Verificación de Email</h3>
      
      <div v-if="!isVerified">
        <div class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          Por favor, verifica tu correo electrónico. Hemos enviado un enlace de verificación a tu email.
        </div>

        <div class="text-center mb-3">
          <p class="mb-2">¿No recibiste el correo de verificación?</p>
          <button 
            @click="handleResendEmail" 
            class="btn btn-outline-primary"
            :disabled="resendCooldown > 0">
            {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar email de verificación' }}
          </button>
        </div>

        <div v-if="verificationForm">
          <hr>
          <h4 class="text-center mb-3">Ingresa al enlace de verificación enviado al email</h4>
        </div>
      </div>

      <div v-else class="text-center">
        <div class="alert alert-success" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          ¡Tu email ha sido verificado exitosamente!
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePostData } from '@/composables/postData';

const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const { PostData } = usePostData();

const isVerified = ref(false);
const verificationCode = ref('');
const error = ref('');
const resendCooldown = ref(0);
const verificationForm = ref(true);

const startCooldown = () => {
  resendCooldown.value = 60;
  const timer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleResendEmail = async () => {
  try {
    const { error } = await PostData(`http://localhost:3000/api/users/resend-email/${email}`);
    
    if (error) {
      error.value = error;
      return;
    }
    
    startCooldown();
  } catch (err) {
    error.value = 'Error al reenviar el código de verificación';
  }
};

// Verificar estado inicial
onMounted(async () => {
  try {
    const { data, error } = await PostData('http://localhost:3000/api/users/verification-status', {
      email: props.email
    });

    if (error) {
      error.value = error;
      return;
    }

    isVerified.value = data.isVerified;
  } catch (err) {
    error.value = 'Error al verificar el estado del email';
  }
});
</script>