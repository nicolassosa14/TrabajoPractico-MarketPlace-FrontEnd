<script setup>
import { ref } from 'vue';

import IconFastDelivery from '@/components/icons/IconCommunity.vue';
import IconSafePayment from '@/components/icons/IconSupport.vue';
import IconTopRestaurants from '@/components/icons/IconEcosystem.vue';

const heroImage = new URL('@/assets/hero.png', import.meta.url).href;

</script>

<template>
  <section class="py-5">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-md-6">
          <div class="mb-4">
            <h1 class="display-4 fw-bold lh-sm">
              Tu mandado, en minutos
            </h1>
            <p class="fs-5 text-muted">
              Pedí de tus comercios favoritos al mejor precio del mercado.
            </p>
          </div>
          <div class="d-flex flex-wrap gap-3 mb-4 text-danger">
            <div class="d-flex align-items-center border border-danger rounded p-2">
              <i class="bi bi-lightning-charge-fill me-1"></i> 
              <span>
                Envios Rapidos
              </span>
            </div>
            <div class="d-flex align-items-center border border-danger rounded p-2">
              <i class="bi bi-file-lock2-fill me-1"></i> 
              <span>
                Compras Seguras
              </span>
            </div>
            <div class="d-flex align-items-center border border-danger rounded p-2">
              <i class="bi bi-cash me-1"></i> 
              <span>
                Mejores Precios
              </span>
            </div>
          </div>

          
        </div>

        <div class="col-md-6">
          <div class="ratio ratio-1x1 rounded-3 shadow-lg overflow-hidden">
            <img
              :src="heroImage"
              alt="Repartidor de MandaditosApp en bicicleta con bolsas de compras"
              class="img-fluid"
              style="object-fit: cover;"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style >

</style>