<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px">Lotes</h1>
      <hr />
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
              <q-input v-model="nombre" label="Nombre" style="width: 300px" />
              <q-input
                type="number"
                v-model="codigo"
                label="codigo"
                style="width: 300px"
              />
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator />

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="editarAgregarLote()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px">
      <div class="btn-agregar">
        <q-btn
          class="bg-secondary"
          label="Agregar Lote"
          @click="agregarLote()" style=" background-color: #2e7d32 !important;"
        />
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
          style="height: 600px"
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
                @click="editarLote(props.row)"
              />
              <q-btn
                glossy
                label="❌"
                @click="inactivarLote(props.row._id)"
                v-if="props.row.estado == 1"
              />
              <q-btn
                glossy
                label="✔️"
                @click="activarLote(props.row._id)"
                v-else
              />
            </q-td>
          </template>
        </q-table>
      </div>
      <!--   <q-table title="Rutas" :rows="rows" :columns="columns" row-key="name">
  
        </q-table> -->
    </div>
  </div>
</template>
  
  <script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useLoteStore } from "../stores/lote.js";
import { useQuasar } from "quasar";
const loteStore = useLoteStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
let text = ref("");
let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let nombre = ref("");
let codigo = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 });
let lotes = ref([]);
async function obtenerInfo() {
  try {
    await loteStore.obtenerInfoLotes();
    lotes.value = loteStore.lotes;
    rows.value = loteStore.lotes;
    console.log(rows.value);
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
    name: "codigo",
    label: "codigo",
    field: "codigo",
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

function mostrarErrores(msg) {
  notification = $q.notify({
    type: 'negative',
    message: msg,
    timeout: 2000,
  });
};

function agregarLote() {
  fixed.value = true;
  text.value = "Agregar Lote";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (nombre.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el nombre del Lote por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (codigo.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el codigo del Lote por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}
async function editarAgregarLote() {
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
        const respuestas = await loteStore.postLote({
          nombre: nombre.value,
          codigo: codigo.value,
        });

        console.log(respuestas);

        if (respuestas.error) {
          setTimeout(() => {
          mostrarErrores(respuestas.error.errors[0].msg);
            error.value = ""; // Limpiar el mensaje de error después de 2 segundos
          }, 2000);
          return;
        }

        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Lote Agregado",
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
      let id = idLote.value;
      if (id) {
        try {
          showDefault();
          const respuesta =await loteStore.putEditarLote(id, {
            _id: idLote.value,
            nombre: nombre.value,
            codigo: codigo.value,
          });

          if (respuesta.error) {
          setTimeout(() => {
          mostrarErrores(respuesta.error.errors[0].msg);
            error.value = ""; // Limpiar el mensaje de error después de 2 segundos
          }, 2000);
          return;
        }
        console.log(respuesta);
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Lote Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          console.log(error);
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
let idLote = ref("");
function editarLote(data) {
  idLote.value = String(data._id);
  fixed.value = true;
  nombre.value = data.nombre;
  codigo.value = data.codigo;
  cambio.value = 1;
}

function limpiar() {
  nombre.value = "";
  codigo.value = "";
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

async function inactivarLote(id) {
  try {
    showDefault();
    await loteStore.putInactivarLote(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Lote Inactivo",
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

async function activarLote(id) {
  try {
    showDefault();
    await loteStore.putActivarLote(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Lote Activo",
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
  background-color: white;
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
  background-color: #2e7d32;
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
  background: #2e7d3281;
}
</style>
  <style lang="sass">
</style>
  