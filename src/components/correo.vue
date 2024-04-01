<template>
    <div class="body">
      <div class="container">
        <h2>Codigo de verificacion</h2>
        <p v-if="!correoValido" class="texto1">Por favor ingrese un correo</p>
        <form @submit.prevent="verificarCodigo">
          <div class="contenedor1">
            <div class="contenedor_input">
              <input type="text" class="input1" placeholder="Código de verificación" v-model="codigoVerificacion" required />
            </div>
            <div class="contenedor2">
              <p v-if="!codigoValido" class="texto1">Por favor ingrese un código válido </p>
              <button class="enviar" style="height: 40px; width:150px;" type="submit" :disabled="!codigoValido">Verificar Código</button>
              <router-link to="/" class="volver">Volver</router-link>
            </div>
          </div>
        </form>
        <router-link to="/cambiar-contrasena" class="forgot-password">
          <span class="forgot-password">¿Olvidaste la contraseña?</span>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useusuariostore } from "../stores/usuario.js";
  import { Cookies } from 'quasar';
  
  const correoElectronico = ref('');
  const codigoVerificacion = ref('');
  const useUsuario = useusuariostore();
  const router = useRouter();
  
  const correoValido = computed(() => {
    return !!correoElectronico.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico.value);
  });
  
  const codigoValido = computed(() => {
    return !!codigoVerificacion.value;
  });
  
  async function verificarCodigo() {
    try {
      // Hacer una solicitud al servidor para verificar el código
      const response = await useUsuario.verificarCodigo(codigoVerificacion.value);
  
      if (response.status === 200) {
        Cookies.set('codigo', codigoVerificacion.value, {expires: 1})
        router.push('/NuevaContrasena');
      } else {
        // Manejar el caso en el que el código no es válido
        console.log('Código no válido');
      }
    } catch (error) {
      console.log(error);
    }
  }


async function enviarCorreo() {
  try {
    const response = await useUsuario.sendemail({ Correo: correoElectronico.value });

    if (response.status === 200) {
      Cookies.set('correo', correoElectronico.value, { expires: 1 });
      activar.value = true;
      router.push('/codigo-recuperacion');
    }
  } catch (error) {
    console.log(error);
  }
}
  </script>
<style>

</style>