<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px">Area</h1>
      <hr />
      <br />
    </div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section
            class="row items-center q-pb-none"
            style="color: black"
          >
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />
          <div v-if="mostrarData">
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input v-model="nombre" label="nombre" style="width: 300px" />
            </q-card-section>
          </div>
          <q-separator />
          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="editarAgregarArea()" class="btn">Aceptar</button>
            <div class="containerError" v-if="mostrarError">
              <h4>{{ error }}</h4>
            </div>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div>
      <div style="width: 40vw">
        <div class="btn-agregar-area">
          <q-btn
            class="btn-agregar"
            label="Agregar Área"
            @click="agregarRuta()" style=" background-color: #2e7d32 !important;"/>
        </div>
        <div class="q-pa-md">
          <q-table
            class="my-sticky-virtscroll-table"
            virtual-scroll
            flat
            bordered
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
            :virtual-scroll-sticky-size-start="48"
            row-key="index"
            :rows="rows"
            :columns="columns"
          >
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <label for="" v-if="props.row.estado == 1" style="color: green"
                  >Activo</label
                >
                <label for="" v-else style="color: red">Inactivo</label>
              </q-td>
            </template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props" class="botones">
                <q-btn
                  color="white"
                  text-color="black"
                  label="🖋️"
                  @click="editarArea(props.row)"
                />
                <q-btn
                  glossy
                  label="❌"
                  @click="inactivarArea(props.row._id)"
                  v-if="props.row.estado == 1"
                />
                <q-btn
                  glossy
                  label="✔️"
                  @click="activarArea(props.row._id)"
                  v-else
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useAreaStore } from "../stores/area.js";
import { useQuasar } from "quasar";
const AreaStore = useAreaStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
let text = ref("");
let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let ficha = ref("");
let nombre = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 });
let areas = ref([]);
async function obtenerInfo() {
  try {
    await AreaStore.obtenerInfoAreas();
    areas.value = AreaStore.areas;
    rows.value = AreaStore.areas;
  } catch (error) {
    console.log(error);
  }
}

const columns = [
  {
    name: "nombre",
    label: "Nombre",
    field: "nombre",
    sortable: true,
    align: "left",
  },

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

function agregarRuta() {
  fixed.value = true;
  text.value = "Agregar Area";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (nombre.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el nombre del Area porfavor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}
async function editarAgregarArea() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      if (nombre.value.trim() === "") {
        mostrarData.value = false;
        mostrarError.value = true;
        error.value = "Por favor digite un nombre";
        setTimeout(() => {
          mostrarData.value = true;
          mostrarError.value = false;
          error.value = "";
        }, 2200);
        return;
      }
      try {
        showDefault();
        await AreaStore.postArea({
          nombre: nombre.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Area Agregada",
          timeout: 2000,
          type: "positive",
        });
        console.log("a");
        obtenerInfo();
      } catch (error) {
        if (notification) {
          notification();
        }
        $q.notify({
          spinner: false,
          // message: `${error.response.data.error.errors[0].msg}`,
          timeout: 2000,
          type: "negative",
        });
      }
    } else {
      let id = idArea.value;
      if (id) {
        try {
          showDefault();
          await AreaStore.putEditarArea(id, {
            nombre: nombre.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Area Actualizada",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
        } catch (error) {
          if (notification) {
            notification();
            console.log(notification);
          }
          $q.notify({
            spinner: false,
            /*  message: `${error.response.data.error.errors[0].msg}`, */
            timeout: 2000,
            type: "negative",
          });
        }
      }
    }
    validacion.value = false;
  }
}

let idArea = ref("");

function editarArea(data) {
  fixed.value = true;
  idArea.value = String(data._id);
  nombre.value = data.nombre;
  cambio.value = 1;
}

async function inactivarArea(id) {
  try {
    showDefault();
    await AreaStore.putInactivarArea(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Area Inactiva",
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

async function activarArea(id) {
  try {
    showDefault();
    await AreaStore.putActivarArea(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Area Activa",
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

function limpiar() {
  nombre.value = "";
  ficha.value = "";
}

let validacion = ref(false);
let notification = ref(null);
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

onMounted(async () => {
  obtenerInfo();
});
</script>

<style scoped>
.modal-content {
  width: 480px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: #2e7d32;
  border-radius: 3%;
}

.contorno {
  background-color: rgb(255, 255, 255);
  height: 95%;
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.botones button {
  margin: 2px;
}

.btn-agregar-area {
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
  background-color: #2e7d32;
  height: 2px;
  border: none;
  width: 320px;
  margin-bottom: 1%;
}

.containerError {
  background-color: rgba(255, 0, 0, 0.429);
  padding: 15px;
  text-align: center;
  font-family: "Letra";
  font-weight: bold;
  border: 3px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
}

.containerError h4 {
  font-size: 15px;
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
  color: #2e7d32;
}

.inac {
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
  background-color: rgba(0, 128, 0, 0.53);
}
</style>
