<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px;">Usuarios</h1>
      <hr />
    </div>
    <div style="width: 1000px;">
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar usuario" @click="agregarUsuario()" style=" background-color: #2e7d32 !important;"/>
      </div> <br>

      <q-table class="my-sticky-virtscroll-table" virtual-scroll flat bordered v-model:pagination="pagination"
        :rows-per-page-options="[0]" :virtual-scroll-sticky-size-start="48" row-key="index" :rows="rows"
        :columns="columns" style="height: 600px;">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <label for="" v-if="props.row.estado == 1" style="color: green">Activo</label>
            <label for="" v-else style="color: red">Inactivo</label>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <!-- <q-btn color="white" text-color="black" label="🖋️" @click="(props.row)" /> -->
            <q-btn glossy label="❌" @click="inactivarUsuario(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn glossy label="✔️" @click="activarUsuario(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
      <!--   <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
  
        </q-table> -->
    </div>
  </div>
</template>
  
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useUsuarioStore } from "../stores/usuario.js";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
const UsuarioStore = useUsuarioStore();
const $q = useQuasar();
const router = useRouter();

let rows = ref([]);
let pagination = ref({ rowsPerPage: 0 })
let usuarios = ref([]);
let notification = ref(null);
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};
async function obtenerInfo() {
  try {
    await UsuarioStore.obtenerusuario();
    usuarios.value = UsuarioStore.usuarios;
    rows.value = UsuarioStore.usuarios;
    console.log(UsuarioStore.usuarios);
  } catch (error) {
    console.log(error);
  }
}


const columns = [

  { name: "usuario", label: "Usuario", field: "usuario", sortable: true, align: "left" },

  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },

  { name: "cedula", label: "Cedula", field: "cedula", sortable: true, align: "left" },

  { name: "telefono", label: "Telefono", field: "telefono", sortable: true, align: "left" },

  { name: "correo", label: "correo", field: "correo", sortable: true, align: "left" },

  { name: "rol", label: "Rol", field: "rol", sortable: true, align: "left" },

  {
    name: "estado",
    label: "Estado",
    field: "estado",
    sortable: true,
    align: "left",
    format: (val) => (val ? "Activo" : "Inactivo"),
  },
  {
    name: "opciones",
    label: "Opciones",
    field: (row) => null,
    sortable: false,
    align: "center",
  },
];

let idRuta = ref("");

function agregarUsuario() {
  router.push('/Registrar');
}

onMounted(async () => {
  obtenerInfo();
});

async function inactivarUsuario(id) {
  try {
    showDefault();
    await UsuarioStore.putusuarioInactivar(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Usuario Inactivo",
      timeout: 2000,
      type: "negative",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      // message: ${error.response.data.error.errors[0].msg},
      timeout: 2000,
      type: "negative",
    });
  }
}

async function activarUsuario(id) {
  try {
    showDefault();
    await UsuarioStore.putusuarioActivar(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Usuario Activo",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      // message: ${error.response.data.error.errors[0].msg},
      timeout: 2000,
      type: "negative",
    });
  }
}
</script> 
  
<style scoped>
.contorno {
  background-color: white;
  height: 90%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: left;
  color: white;
  margin-left: 19px;
}

.body {
  padding: 30px;
  margin: 0;
  text-transform: capitalize;
}

.containerBoton {
  display: flex;
  justify-content: center;
}

hr {
  background-color: green;
  height: 2px;
  border: none;
  width: 363px;
  margin-bottom: 1%;
}

.containerError {
  background-color: rgba(255, 0, 0, 0.429);
  padding: 15px;
  text-align: center;
  font-family: "Letra";
  font-weight: bold;
  width: 310px;
  border: 3px solid red;
  margin-bottom: 5px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
}

.containerError h4 {
  font-size: 25px;
  margin: 0;
  padding: 0;
}

h1 {
  font-family: "Letra";
  text-align: center;
  margin: 0;
  align-items: center;
  margin-top: 2%;
}

.text-h6 {
  font-size: 28px;
  font-family: "Letra";
  margin-bottom: 10px;
}

.botones .edi {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px;
  background-color: transparent;
}

.botones .edi:hover {
  transform: scale(1.05);
  transition: all 0.5s;
}

.botones .act {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 7px;
  background-color: transparent;
}

.act i {
  font-size: 22px;
  color: green;
}

.inac {
  /*   display: flex;
    align-items: center; */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  margin: 0;
  background-color: transparent;
}

.botones .edi i {
  font-size: 20px;
}

.inac i {
  font-size: 25px;
  color: red;
}

.btn {
  font-family: "Letra";
  width: 100px;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  padding: 10px;
  cursor: pointer;
  background: -webkit-linear-gradient(bottom, #2dbd6e, #a6f77b);
}
</style>
<style lang="sass">
  
  </style>
  