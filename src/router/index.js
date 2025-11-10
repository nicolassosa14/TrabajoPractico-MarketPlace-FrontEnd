import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/terminos',
      name: 'terminos',
      component: () => import('../views/TerminosView.vue'),
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: () => import('../views/PrivacidadView.vue'),
    },
    {
      path: '/confirm-email',
      name: 'confirm-email',
      component: () => import('../views/ConfirmEmailView.vue'),
    },
    {
      path: '/locales',
      name: 'locales',
      component: () => import('../views/LocalListView.vue'),
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriaListView.vue'),
    },
    {
      path: '/driver-dashboard',
      name: 'driver-dashboard',
      component: () => import('../views/DriverDashboardView.vue'),
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilUsuarioView.vue'),
    },
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('../views/CartView.vue'),
    },



{
  path: '/locales/crear',
  name: 'CreateLocal',
  component: () => import('../views/CreateLocalView.vue'),

},
{
  path: '/productos/crear',
  name: 'CreateProduct',
  component: () => import('../views/CrearProducto.vue'),

},
{
  path: "/local/:vendorId/productos",
  name: "ProductsByLocal",
  component: () => import("../views/ProductsByLocalView.vue"),
  props: true
}


  ],
})

export default router
