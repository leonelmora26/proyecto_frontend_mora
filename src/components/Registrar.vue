<template>
  <div class="container">
    <form class="form" @submit.prevent="registrarUsuario">
      <div class="center-img">
        <img :src="images" class="fondo" />
      </div>
      <p class="title">Registro</p>
      <p class="message">
        Regístrate ahora y obtén acceso completo a nuestra aplicación.
      </p>

      <div class="flex">
        <label>
          <input v-model="nombre" required placeholder="" type="text" class="input" />
          <span>Nombre</span>
        </label>

        <label>
          <input v-model="cedula" required placeholder="" type="text" class="input" />
          <span>Cedula</span>
        </label>

        <label>
          <input v-model="telefono" required placeholder="" type="number" class="input" />
          <span>Telefono</span>
        </label>

        <label>
          <input v-model="correo" required placeholder="" type="text" class="input" />
          <span>gmail</span>
        </label>

        <label>
          <input v-model="usuario" required placeholder="" type="text" class="input" />
          <span>Usuario</span>
        </label>
        <label>
          <input v-model="password" required placeholder="" type="password" class="input" />
          <span>password</span>
        </label>

        <label>
          <select v-model="rol" required class="input select">
            <option value="">Selecciona un rol</option>
            <option value="instructor">Instructor</option>
            <option value="bodega">Bodega</option>
            <option value="administrador">Administrador</option>
            <option value="superAdmin">super Admin</option>
          </select>
        </label>
      </div>
      <div class="bot">
      <button class="button2">
        <router-link to="/Usuario">
          <span class="lable">Cancelar</span>
            </router-link>
      </button>
      <button type="submit" class="submit">Registrar</button>
    </div><br>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import images from "../assets/fondo12.png";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from "quasar";
const $q = useQuasar();


let notification = ref(null);
const notify = (message, type) => {
  notification = $q.notify({
    message: message,
    timeout: 1500,
    type: type
  
  });
};

let nombre = '';
let cedula = '';
let telefono = '';
let usuario = '';
let correo = '';
let password = '';
let rol = '';

const usuarioAgregado = ref(false);
const router = useRouter();

function mostrarErrores(msg) {
  notification = $q.notify({
    type: 'negative',
    message: msg,
    timeout: 2000,
  });
};

const validarTelefono = (telefono) => {
  const telefonoRegex = /^\d{10}$/; // Expresión regular para validar 10 dígitos numéricos
  return telefonoRegex.test(telefono);
};

const validarCedula = (telefono) => {
  const cedulaRegex = /^\d{10}$/; // Expresión regular para validar 10 dígitos numéricos
  return cedulaRegex.test(telefono);
};

const validarCorreo = (correo) => {
  return correo.includes('@'); // Verificar si el correo contiene al menos una arroba
};


const registrarUsuario = async () => {
  try {

    if (!validarTelefono(telefono)){
      mostrarErrores("el numero de telefono debe tener 10 caracteres")
      return;
    } 

    if (!validarCedula(cedula)) {
      mostrarErrores("La cédula debe tener exactamente 10 dígitos");
      return;
    }

    if (!validarCorreo(correo)) {
      mostrarErrores("El correo electrónico debe contener al menos una arroba");
      return;
    }
    const response = await axios.post('https://backend-abxx.onrender.com/usuario/agregar', {
      nombre,
      cedula,
      telefono,
      correo,
      usuario,
      password,
      rol
    });

    if (registrarUsuario.error) {
          setTimeout(() => {
          mostrarErrores(registrarUsuario.error.errors[0].msg);
            error.value = ""; // Limpiar el mensaje de error después de 2 segundos
          }, 2000);
          return;
        }


    notify("Usuario Agregado", "positive")
    console.log(response.data);

    nombre = '';
    cedula = '';
    telefono = '';
    correo = '';
    usuario = '';
    password = '';
    rol = '';
    
    usuarioAgregado.value = true;
    router.push('/Usuario');
  } catch (error) {
    notify("La cedula ya se encuentra registrada en la base de datos", "negative")

    console.error(error);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #2e7d32;
  align-items: center;
  justify-content: center;
}

.centeimg {
  display: flex;
  justify-content: center;
}

.fondo {
  height: 100px;
  width: 100px;
  margin: 25px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 60vh;
  background-color: #fff;
  border-radius: 20px;
  align-items: center;
}

.title {
  font-size: 28px;
  color: #2e7d32;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0;
  background-color: #2e7d32;
}

.title::before {
  width: 18px;
  height: 18px;
  background-color: royalblue;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.flex {
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.form label {
  position: relative;
}

.form label .input {
  width: 200px;
  height: 50px;
  padding: 10px 10px 20px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input + span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

select {
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
  font-weight: 600;
}

.form label .input:placeholder-shown + span {
  top: 15px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
}

.form label .input:valid + span {
  color: #2e7d32;
}

.submit {
  border: none;
  outline: none;
  background-color: #2e7d32;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: 0.3s ease;
}

.submit:hover {
  background-color: rgb(56, 90, 194);
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

label .select {
  width: 100%;
  padding: 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
  
}

label .select + span {
  position: absolute;
  left: 10px;
  top: 15px;
  color: grey;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
  
}

label .select:placeholder-shown + span {
  top: 15px;
  font-size: 0.9em;
  
}

label .select:focus + span,
label .select:valid + span {
  top: 30px;
  font-size: 0.7em;
  font-weight: 600;
  
}

label .select:valid + span {
  color: green;
  
}


.button2 {
  border: none;
  outline: none;
  background-color: #2e7d32;
  padding: 10px;
  border-radius: 10px;
  color: fff;
  font-size: 16px;
  transform: 0.3s ease;
  
}

.lable {
  color: #fff;
}
a{
  text-decoration: none;
}
.button2:hover {
  background: #264cf8e1;
}

.bot {
    display: flex;
    gap: 25px;
}


</style>