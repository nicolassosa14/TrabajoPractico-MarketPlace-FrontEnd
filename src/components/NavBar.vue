<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useGetData } from '@/composables/getData';

const router = useRouter();
const authStore = useAuthStore();
const { getData, data, error} = useGetData();


const isAuthenticated = computed(() => authStore.isAuthenticated);

getData('http://localhost:3000/api/users/profile/'+localStorage.getItem('userId'));
console.log(data);
const isDriver = computed(() => data.value.role === 'driver');

onMounted(() => {
  authStore.checkAuthStatus();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const goToRegister = () => {
  router.push({ name: 'login', query: { action: 'register' } });
};

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img style="max-width: 45px; margin-right: -7px;" src="/logo.png" alt="">
        <span class="brand-text ms-0">andaditosApp</span>
      </router-link>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/locales">
              Locales
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/categorias">
              Categorías
            </router-link>
          </li>
        </ul>

        <form class="d-flex me-3 search-form">
          <div class="input-group">
            <input
              class="form-control search-input custom-search"
              type="search"
              placeholder="Buscar Locales..."
              aria-label="Search"
            >
            <button class="btn btn-outline-danger" type="submit">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </form>

        <div class="d-flex align-items-center">
          <template v-if="isAuthenticated">
            <div class="dropdown">
              <button
                class="btn btn-link text-dark text-decoration-none dropdown-toggle"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i>
                Mi Cuenta
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li>
                  <router-link class="dropdown-item" to="/perfil">
                    <i class="bi bi-person me-2"></i><span>Perfil</span>
                  </router-link>
                </li>
                <li v-if="isDriver">
                  <router-link class="dropdown-item" to="/driver-dashboard">
                    <i class="bi bi-truck me-2"></i><span>Panel de Conductor</span>
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/pedidos">
                    <i class="bi bi-bag me-2"></i><span>Mis Pedidos</span>
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/wishlist">
                    <i class="bi bi-heart me-2"></i><span>Lista de Deseos</span>
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i><span>Cerrar Sesión</span>
                  </button>
                </li>
              </ul>
            </div>
            <router-link to="/carrito" class="btn btn-link text-dark position-relative ms-2">
              <i class="bi bi-cart3 fs-5"></i>
              <span class="position-absolute top-0 start-100 badge rounded-pill bg-danger cart-badge">
                0
                <span class="visually-hidden">productos en carrito</span>
              </span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-danger me-2">
              Iniciar Sesión
            </router-link>
            <button class="btn btn-danger" @click="goToRegister">
              Registrarse
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
i {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}
:root {
  --primary-red: #ff6b6b;
  --dark-red: #fa5252;
  --light-red: #ffe3e3;
  --hover-red: #ff8787;
}


.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1030; /* A common z-index for navbars */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background-color: var(--light-red) !important;
  border-bottom: 1px solid rgba(255, 107, 107, 0.1);
}



.brand-text {
  font-weight: 600;
  font-size: 1.4rem;
  background: linear-gradient(45deg, #ff0000, #8b0000);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient 2s ease infinite;
  background-size: 200% 200%;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link {
  position: relative;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  transition: color 0.3s ease;
  color: var(--dark-red) !important;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #ff0000, #8b0000);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 80%;
}

.search-form {
  min-width: 300px;
}

.search-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item > i,
.dropdown-item > span {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.2s ease;
}

.dropdown-item:hover > i {
  transform: translateX(5px) scale(1.1);
}

.dropdown-item:hover > span {
  transform: translateX(5px);
}

@media (max-width: 991.98px) {
  .search-form {
    margin: 1rem 0;
    width: 100%;
  }
}

.custom-search:focus {
  border-color: var(--primary-red) !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25) !important;
}

.custom-search:focus + .input-group-append .btn-outline-danger {
  border-color: var(--primary-red) !important;
  color: var(--primary-red) !important;
}

.cart-badge {
  transform: translate(-75%, -5%);
}
</style>