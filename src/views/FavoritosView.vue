<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="mb-0">Mis Favoritos</h2>
            <small class="text-muted">Locales que marcaste como favoritos</small>
        </div>

        <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'" role="alert">
            {{ message }}
        </div>

        <div v-if="loading" class="loading-wrapper text-center py-5">
            <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando tus favoritos...</p>
        </div>

        <div v-else>
            <div v-if="favorites.length === 0" class="empty-state text-center py-5">
                <i class="bi bi-heart fs-1 text-danger mb-3"></i>
                <h5>No tienes locales favoritos aún</h5>
                <p class="text-muted">Explora locales y agrégalos a tus favoritos para encontrarlos rápido.</p>
                <router-link to="/locales" class="btn btn-outline-primary mt-2">Explorar Locales</router-link>
            </div>

            <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div v-for="(vendor, idx) in favorites" :key="vendor.id" class="col">
                    <div class="fav-card card h-100 shadow-sm">
                        <div class="card-img-top img-wrapper">
                            <img class="w-75 mx-auto" :src="vendor.Image_url" :alt="vendor.name" />
                            <button :class="['fav-btn', { 'is-fav': true }]" @click="removeFavorite(vendor.id, idx)" title="Quitar de favoritos">
                                <i class="bi bi-heart-fill heart-fill" aria-hidden="true"></i>
                                <i class="bi bi-heart heart-outline" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">{{ vendor.name }}</h5>
                                <small class="text-muted">{{ vendor.category || '' }}</small>
                            </div>
                            <p class="card-text text-muted mb-3">{{ (vendor.description || '').slice(0, 110) }}{{ (vendor.description || '').length > 110 ? '...' : '' }}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <router-link :to="{ name: 'ProductsByLocal', params: { vendorId: vendor.id } }" class="btn btn-danger btn-sm w-100">Ver Local</router-link>
                                
                                <small class="text-muted">{{ vendor.city || '' }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/api';

const favorites = ref([]);
const message = ref('');
const messageType = ref('success');
const loading = ref(true);

const userId = localStorage.getItem('userId');

const loadFavorites = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/users/favorite-vendors/${userId}`);
        favorites.value = response.data || [];
    } catch (error) {
        console.error('Error al cargar los favoritos:', error);
        message.value = 'No se pudieron cargar los favoritos.';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

onMounted(loadFavorites);

const removeFavorite = async (vendorId, index) => {
    if (!confirm('¿Quitar este local de tus favoritos?')) return;
    try {
        await api.delete(`/users/favorite-vendors/${userId}/${vendorId}`);
        favorites.value.splice(index, 1);
        message.value = 'Local eliminado de favoritos.';
        messageType.value = 'success';
        setTimeout(() => { message.value = ''; }, 2500);
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        message.value = 'Error al eliminar favorito.';
        messageType.value = 'error';
    }
};

    </script>

<style scoped>
.fav-card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.fav-card:hover { transform: translateY(-1px); box-shadow: 0 14px 40px rgba(18,18,18,0.08); }
.img-wrapper { position: relative; height: 180px; overflow: hidden; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fav-btn {
    position: absolute; top: 10px; right: 10px; z-index: 5;
    background: transparent; border: 0; padding: 6px; width: auto; height: auto; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
    color: #fa5252; box-shadow: none;
}
.fav-btn i { font-size: 1.05rem; line-height: 1; }

.fav-btn .heart-fill, .fav-btn .heart-outline { display: none; }

.fav-btn.is-fav .heart-fill { display: inline-block; }
.fav-btn.is-fav .heart-outline { display: none; }
.fav-btn.is-fav:hover .heart-fill { display: none; }
.fav-btn.is-fav:hover .heart-outline { display: inline-block; }

.fav-btn:not(.is-fav) .heart-fill { display: none; }
.fav-btn:not(.is-fav) .heart-outline { display: inline-block; }
.fav-btn:not(.is-fav):hover .heart-fill { display: inline-block; }
.fav-btn:not(.is-fav):hover .heart-outline { display: none; }
.fav-btn .heart-fill, .fav-btn .heart-outline { transition: transform 0.12s ease, opacity 0.12s ease; }
.fav-btn:hover { background: transparent; }
.empty-state { background: #fff; border-radius: 12px; padding: 40px 20px; }

.card-title { font-weight: 700; }

.loading-wrapper { background: #fff; border-radius: 12px; padding: 36px 16px; }

.fav-btn i:hover { transform: scale(1.08); }
</style>
