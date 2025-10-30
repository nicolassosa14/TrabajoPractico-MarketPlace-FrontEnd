<script setup>
import { ref, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { loginSchema, registerSchema } from '../schemas/auth.schemas';
import { usePostData } from '@/composables/postData';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { useGetData } from '@/composables/getData';

const { PostData, data: responseData, errorpost: responseError } = usePostData();
const authStore = useAuthStore();
const route = useRoute();

const isLogin = ref(true);

onMounted(() => {
  if (localStorage.getItem('userId')) {
    router.push('/');
  }
  if (route.query.action === 'register') {
    isLogin.value = false;
  }
});

const onSubmit = async (values) => {
  
  if (isLogin.value) {
    const loginValues = {
      email: values.email,
      password: values.password
    };
    // Lógica de inicio de sesión
    await PostData('http://localhost:3000/api/users/login', loginValues);
    authStore.login(responseData.value.user);
    router.push('/');
    return;
  }
  // Lógica de registro
  const registerValues = {
    first_name: values.nombre,
    last_name: values.apellido,
    email: values.email,
    password: values.password
  };
  const response = await PostData('http://localhost:3000/api/users', registerValues);
    localStorage.setItem('tempEmail', values.email);
    router.push('/confirm-email');
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};
</script>

<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">{{ isLogin ? 'Iniciar Sesión' : 'Registro' }}</h2>
            
            <Form @submit="onSubmit" :validation-schema="isLogin ? loginSchema : registerSchema" v-slot="{ errors }">
              <!-- Campos solo para registro -->
              <template v-if="!isLogin">
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <Field name="nombre" type="text" class="form-control" :class="{ 'is-invalid': errors.nombre }" />
                  <ErrorMessage name="nombre" class="invalid-feedback" />
                </div>

                <div class="mb-3">
                  <label for="apellido" class="form-label">Apellido</label>
                  <Field name="apellido" type="text" class="form-control" :class="{ 'is-invalid': errors.apellido }" />
                  <ErrorMessage name="apellido" class="invalid-feedback" />
                </div>
              </template>

              <!-- Campos comunes -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <Field name="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
                <ErrorMessage name="email" class="invalid-feedback" />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                <ErrorMessage name="password" class="invalid-feedback" />
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3">
                {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
              </button>

              <div class="text-center">
                <a href="#" @click.prevent="toggleForm" class="text-decoration-none">
                  {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
