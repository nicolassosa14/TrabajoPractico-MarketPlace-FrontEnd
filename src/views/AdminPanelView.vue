<template>
    <div class="admin-panel-view container mt-4">
    <h2 class="mb-1">Panel de Administración</h2>
    <p class="text-muted mb-0">Gestiona usuarios, productos y pedidos desde aquí.</p>

    <section class="stats-section mt-4">
            <h3 class="section-title">Estadísticas de Usuarios</h3>

            <div class="row g-3 mt-3 stats-grid">
                <div class="col-6 col-md-4 col-lg-2" v-for="card in cards" :key="card.label">
                    <div class="stat-card p-3 h-100 d-flex align-items-center">
                        <div class="stat-icon me-3 d-flex align-items-center justify-content-center">
                            <i :class="card.icon"></i>
                        </div>
                        <div class="stat-body">
                            <div class="stat-number h4 mb-0">{{ displayed[card.label] ?? card.count }}</div>
                            <div class="stat-label small text-muted">{{ card.label }}</div>
                        </div>
                    </div>
                </div>
            </div>
    </section>
    </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '@/api/api';
import router from '@/router';

const users = ref([]);
const clientes = ref(0);
const vendedores = ref(0);
const drivers = ref(0);
const admins = ref(0);

onMounted(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        router.push('/login');
        return;
    };

    const user = await api.get(`/users/profile/${userId}`);
    if (user.data.role !== 'backoffice') {
        alert('No tienes permiso de entrar a este enlace. Redirigiendo al inicio.');
        router.push('/');
        return;
    }

    try {
    const response = await api.get('/admin/list/all-users');
    users.value = response.data;
    // Contar roles
    vendedores.value = users.value.filter(user => user.role === 'vendor').length;
    clientes.value = users.value.filter(user => user.role === 'customer').length;
    drivers.value = users.value.filter(user => user.role === 'driver').length;
    admins.value = users.value.filter(user => user.role === 'backoffice').length;
    } catch (error) {
    console.error('Error al cargar los usuarios:', error);
    }
});

const cards = computed(() => [
        { label: 'Total de Usuarios', count: users.value.length, icon: 'bi bi-people' },
        { label: 'Clientes', count: clientes.value, icon: 'bi bi-person' },
        { label: 'Vendedores', count: vendedores.value, icon: 'bi bi-shop' },
        { label: 'Conductores', count: drivers.value, icon: 'bi bi-truck' },
        { label: 'Administradores', count: admins.value, icon: 'bi bi-shield-lock' }
]);
import { reactive, watch } from 'vue';

const displayed = reactive({});
const _anims = {};

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateNumber(key, toValue, duration = 800) {
    const from = Number(displayed[key] ?? 0);
    const to = Number(toValue ?? 0);
    const start = performance.now();

    if (_anims[key]) cancelAnimationFrame(_anims[key]);

    function frame(now) {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        const current = Math.round(from + (to - from) * eased);
        displayed[key] = current;
        if (t < 1) {
            _anims[key] = requestAnimationFrame(frame);
        } else {
            displayed[key] = to;
            delete _anims[key];
        }
    }

    if (typeof displayed[key] === 'undefined') displayed[key] = 0;
    _anims[key] = requestAnimationFrame(frame);
}

watch(cards, (newCards) => {
    newCards.forEach(c => {
        if (typeof displayed[c.label] === 'undefined') displayed[c.label] = 0;
        animateNumber(c.label, c.count, 900);
    });
}, { immediate: true, deep: true });

</script>
<style scoped>
.stats-section {
    background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.85));
}

.section-title {
    font-weight: 600;
    color: #333;
}

.stats-grid {
    align-items: stretch;
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(22, 23, 24, 0.06);
    border: 1px solid rgba(20,20,20,0.03);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.stat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(22, 23, 24, 0.09);
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
    color: #fff;
    font-size: 1.25rem;
}

.stat-icon i {
    font-size: 1.3rem;
}

.stat-number {
    color: #111;
    font-weight: 700;
}

.stat-label {
    color: #6b6b6b;
}

@media (min-width: 992px) {
    .stats-grid .col-lg-2 {
    max-width: 17%;
    }
}

</style>

