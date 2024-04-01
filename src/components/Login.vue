<template>

  <div class="q">
    <div class="contenedores">
      <img :src="images1" class="fondo12">
      <h1>Bodega WareSpace</h1>
      <h2>Servicio Nacional de Educación</h2>
    </div>
    <q-card class="card" flat bordered>
      <q-card-section>




        <div class="cuadro">
          <div class="contenedor">
      <q-card class="my-card"><br>
        <div class="card-title">
          <img :src="images2" class="fondo1" alt="Logo">
          <h3 class="log">Login</h3>
        </div>
        <div class="containerData" v-if="MostrarData">
          <q-card-actions vertical class="texto">
            <q-input color="green" filled v-model="data.usuario" label="Nombre">
              
            </q-input>
            <q-input color="green" filled v-model="data.password" label="Contraseña" type="password">
             
            </q-input>
           
          </q-card-actions>
        </div>
        <button @click="Login()" class="btn">Aceptar</button> <br>
        <router-link to="/Recuperar">
              <p>¿Olvidaste tu clave? recuperala aquí.</p>
            </router-link>   
        <div class="containerError" v-if="mostrarError || error2">
          <h5 v-if="mostrarError">Por favor digite el Nombre o Contraseña</h5>
          <h4 v-if="error2">{{ msj }}</h4>
          
        </div>
       
      </q-card>
    </div>
        <div class="texto">
        </div>

      </div>
      </q-card-section>
    </q-card>
  </div>


 

</template> 



<script setup>

import images1 from "../assets/fondo.png"
import images2 from "../assets/fondo12.png"

import { ref, onMounted } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
const usuarioStore = useUsuarioStore();
const $q = useQuasar();
let mostrarError = ref(false);
let MostrarData = ref(true);
const router = useRouter();
let usuario= ref ("");
let password= ref ("");
let notification = ref()
let greatMessage = ref("");
let badMessage = ref("");
let red = ref(null);
let error2 = ref(null);
let msj = ref(null)
const data = ref({
  usuario: "",
  password: "",
})
const useUsuario = useUsuarioStore();

async function obtenerInfo(){
  try {
    await usuarioStore.obtenerusuario();
    usuario.value= useUsuario.usuarios;
    rows.value=useUsuario.usuarios;
  } catch (error) {
    console.log(error);
  }
}

async function Login() {
  if (data.value.usuario.trim() === "" || data.value.password.trim() === "") {
    mostrarError.value = true;
    setTimeout(() => {
      mostrarError.value = false;
    }, 2200);
    return;
  } else {
    try {
      showDefault();
      console.log("data: ", data.value);
      const res = await useUsuario.login(data.value);
      console.log('r',res);
      if (notification) {
        notification();
      }
      if (res.msg) {
        mostrarErrores(res.msg)
        console.log('maluco, user o contra maluca');
      } else {
        console.log(useUsuario.usuario)
        router.push('/inicio');
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  }
  console.log(data.value);
}


const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

function mostrarErrores (msg) {
  notification = $q.notify({
    type: 'negative',
    message: msg,
    timeout: 1500,
  });
};

</script>

<style scoped>

.q {
  margin: 0;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 100%; /* Cambiar a una sola columna en dispositivos móviles */
  background-color: #2e7d32;
  background-size: contain;
  background-repeat: no-repeat;
}


#app {
  height: 100%;
}

.no-shadow {
  box-shadow: none !important;
  background-color: #2e7d32;
}

.q-card--bordered {
  border: 0px solid rgba(0, 0, 0, 0.12);
  background-color: white;
}

.card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

a {
  text-decoration: none;
}

.text-h5 {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9%;
  color: rgb(255, 255, 255);
}


.fondo12 {
  width: 100%;
  max-width: 300px; /* Ajusta el tamaño máximo de la imagen en dispositivos móviles */
}

.contenedores {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

h2 {
  color: white;
  font-size: 25px; /* Reduce el tamaño de la fuente para dispositivos móviles */
  margin: 0%;
  font-family: sans-serif;
  font-weight: bolder;
  text-align: center;
}

h1 {
  margin: 0%;
  color: white;
  font-family: sans-serif;
  font-weight: bolder;
  font-size: 30px; /* Tamaño de fuente más grande para dispositivos grandes */
}

.card {
  display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
}


.q-field--filled {
    padding: 0 12px;
    border-radius: 4px 4px 0 0;
    width: 300px;
}

.my-card{
    width: 80vw;
    max-width: 400px;
    min-height: 500px;
    display: flex;
    align-items: center;
    background-color: #ededed;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    border-radius: 11px;
    border: 2px solid #ffffff;
    flex-direction: column;
    overflow: hidden;
}

.card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.fondo1 {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.texto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.btn {
  background-color: #2e7d32;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.containerError {
  text-align: center;
}

h5 {
  font-size: 15px;
  color: rgb(255, 0, 0);
}

h3 {
  font-size: 35px;
  color: rgb(0, 0, 0);
}

/* Media query para dispositivos móviles */
@media only screen and (min-width: 600px) {
  .q {
    grid-template-columns: 70% 30%;
  }

  .my-card {
    width: 80vw;
    max-width: 400px;
  }

  h2 {
    font-size: 35px; /* Tamaño de fuente más grande para dispositivos grandes */
  }

  h1 {
    font-size: 65px; /* Reduce el tamaño de la fuente para dispositivos móviles */
  }

  .fondo12 {
  width: 100%;
  max-width: 500px; 
}
}

</style>
