<template>
  <footer class="bg-light border-top py-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <img style="height: 70px;" src="/logo.png" alt="">
            </div>
            <span class="fs-5 fw-bold text-dark">MandaditosApp</span>
          </div>
          <p class="text-muted small">
            Tu mandado, en minutos. Pedí de tus comercios favoritos y seguí el envío en
            tiempo real.
          </p>
        </div>

        <div class="col-md-3 mb-4">
          <h3 class="fw-semibold text-dark mb-4">Legal</h3>
          <ul class="list-unstyled">
            <li v-for="link in legalLinks" :key="link.label" class="mb-2">
              <router-link :to="link.href" class="text-muted text-decoration-none hover-primary">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h3 class="fw-semibold text-dark mb-4">Contacto</h3>
          <ul class="list-unstyled text-muted small">
            <li class="mb-2">soporte@mandaditosapp.com</li>
            <li class="mb-2">0800-MANDADITOS</li>
            <li class="mb-2">Lun a Dom, 24 horas</li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h3 class="fw-semibold text-dark mb-4">Seguinos</h3>
          <div class="d-flex gap-3 mb-4">
            <a v-for="social in socialLinks" :key="social.label" :href="social.href" :aria-label="social.label" class="d-flex align-items-center justify-content-center rounded-3 bg-secondary-subtle text-dark hover-primary" style="width: 40px; height: 40px; text-decoration: none;">
              <i :class="social.icon" class="fs-5"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-4 border-top text-center text-muted small">
        <p>&copy; {{ new Date().getFullYear() }} MandaditosApp. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const socialLinks = ref([
  { icon: 'bi bi-facebook', href: '', label: 'Facebook' },
  { icon: 'bi bi-instagram', href: '', label: 'Instagram' },
  { icon: 'bi bi-twitter-x', href: '', label: 'Twitter' },
]);

const legalLinks = ref([
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Política de Privacidad', href: '/privacidad' },
]);
</script>

<style scoped>
.hover-primary {
  transition: color 0.2s ease-in-out;
}
.hover-primary:hover {
  color: var(--bs-primary) !important;
}

.bg-secondary-subtle.hover-primary:hover {
    background-color: var(--bs-primary) !important;
    color: var(--bs-light) !important;
}
</style>
