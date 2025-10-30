<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <EmailVerification :email="userEmail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EmailVerification from '@/components/EmailVerification.vue';

const router = useRouter();
const userEmail = ref('');

onMounted(() => {
  // Recuperar el email del usuario del almacenamiento local o estado
  const tempEmail = localStorage.getItem('tempEmail');
  if (!tempEmail) {
    router.push('/login');
    return;
  }
  userEmail.value = tempEmail;
});
</script>