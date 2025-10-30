<template>
  <section class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Categorías Destacadas</h2>
      <div class="row justify-content-center mt-4">
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="text-center bg-white shadow-sm p-3 rounded categorycard">
            <a  class="text-decoration-none text-dark">
              <i class="bi bi-question-square-fill"></i>
              <h4 class="mt-2">Comida Rapida</h4>
            </a>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="text-center bg-white shadow-sm p-3 rounded categorycard">
            <a  class="text-decoration-none text-dark">
              <i class="bi bi-question-square-fill"></i>
              <h4 class="mt-2">Comida Rapida</h4>
            </a>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="text-center bg-white shadow-sm p-3 rounded categorycard">
            <a  class="text-decoration-none text-dark">
              <i class="bi bi-question-square-fill"></i>
              <h4 class="mt-2">Comida Rapida</h4>
            </a>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="text-center bg-white shadow-sm p-3 rounded categorycard">
            <a  class="text-decoration-none text-dark">
              <i class="bi bi-question-square-fill"></i>
              <h4 class="mt-2">Comida Rapida</h4>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categorycard {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.categorycard:hover{
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    cursor:pointer
}
.categorycard i {
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
</style>
