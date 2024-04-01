<template>
  <div class="q-page-container">
    <div class="flex">
      <img :src="images" class="inicio" alt="inicio" />
    </div>
  </div>
</template>

<script setup>
import images from "../assets/inicio.png";
</script>

<style>
.q-page-container {
  height: 90vh;
  width: 90vw;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}


img {
  max-width: 100%;
  height: auto;
}


@media only screen and (max-width: 600px) {
  img {
    max-width: 80%;
  }
}
</style>
