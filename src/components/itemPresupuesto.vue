<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px;">Presupuesto</h1>
      <hr />
    </div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <div class="contorno">
          <q-card-section class="row items-center q-pb-none" style="color: black">
            <div class="text-h6">{{ text }}</div>
            <q-space />
          </q-card-section>
          <q-separator />
          <div v-if="mostrarData">
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input v-model="nombre" label="Nombre" type="text" style="width: 300px" />
              <q-input v-model="presupuesto" label="Presupuesto" type="number" style="width: 300px" />
              <q-input v-model="año" label="Año" type="date" style="width: 300px" :min="getTodayDate()" />
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator />

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" @click="fixed = false">Cancelar</button>
            <button @click="editaragregarItem()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px;">
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar item" @click="agregarItem()" style=" background-color: #2e7d32 !important;"/>
      </div>
      <div class="q-pa-md">
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
              <q-btn color="white" text-color="black" label="🖋️" @click="editarFicha(props.row)" />
              <q-btn glossy label="❌" @click="inactivarItem(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn glossy label="✔️" @click="ActivarItem(props.row._id)" v-else />
              <router-link to="/distriPresupuesto">
                <q-btn color="white" text-color="black" label="lotes" />
              </router-link>
              
            </q-td>
          </template>
        </q-table>

      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { format } from "date-fns";
import { useItemStore } from "../stores/itempresupuesto.js";
import { useQuasar } from "quasar";
const ItemStore = useItemStore();
const $q = useQuasar();
let error = ref("");
let text = ref("");
let rows = ref([]);
let fixed = ref(false);
let nombre = ref("");
let presupuesto = ref("");
let presupuestoDisponible = ref("");
let año = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 })
let items = ref([]);
async function obtenerInfo() {
  try {
    await ItemStore.obtenerInfoitem();
    items.value = ItemStore.items;
    rows.value = ItemStore.items;
    console.log(rows.value);
  } catch (error) {
    console.log(error);
  }
}

function formatCurrency(amount) {
  // Formatear el número con separadores de miles y decimales
  const formattedAmount = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);

  return formattedAmount;
}


const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },
  { name: "año", label: "Fecha creacion", field: "año", sortable: true, align: "left" },
  { name: "presupuesto", label: "Presupuesto", field: "presupuesto", sortable: true, align: "left", format: (val) => formatCurrency(val) },
  { name: "presupuestoDisponible", label: "presupuesto disponible", field: "presupuestoDisponible", sortable: true, align: "left", format: (val) => formatCurrency(val)  },
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

function agregarItem() {
  fixed.value = true;
  text.value = "Agregar Ficha";
  cambio.value = 0;
  limpiar();
}

function validar() {
  if (nombre.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el nombre por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);

  } else if (presupuesto.value <0) {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "El presupuesto no puede ser menor a 0";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (presupuesto.value.length === 0) {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "El presupuesto no puede estar vacio";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (año.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Indique el año por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
} else {
    const añoIngresado = parseInt(año.value.trim());
    if (isNaN(añoIngresado)) {
        mostrarData.value = false;
        mostrarError.value = true;
        error.value = "El año debe ser un número válido";
        setTimeout(() => {
          mostrarData.value = true;
          mostrarError.value = false;
          error.value = "";
        }, 2200);
    } else {
        const añoActual = new Date().getFullYear();
        if (añoIngresado < añoActual) {
            mostrarData.value = false;
            mostrarError.value = true;
            error.value = "El año no puede ser menor que el año actual";
            setTimeout(() => {
              mostrarData.value = true;
              mostrarError.value = false;
              error.value = "";
            }, 2200);
        } else {
    validacion.value = true;
  }
}
}
}

async function editaragregarItem() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        await ItemStore.postItem({
          nombre: nombre.value,
          presupuesto: presupuesto.value,
          año: año.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Item Agregado",
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
          // message: `${error.response.data.error.errors[0].msg}`,
          timeout: 2000,
          type: "negative",
        });
      }
    } else {
      let id = _id.value;
      if (id) {
        try {
          showDefault();
          await ItemStore.putEditarItem(id, {
            nombre: nombre.value,
            presupuesto: presupuesto.value,
            presupuestoDisponible: presupuestoDisponible.value,
            año: año.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Item Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          if (notification) {
            notification();
          }
          $q.notify({
            spinner: false,
            /*  message: ${error.response.data.error.errors[0].msg}, */
            timeout: 2000,
            type: "negative",
          });
        }
      }
    }
    validacion.value = false;
  }
}

async function inactivarItem(id) {
  try {
    showDefault();
    await ItemStore.putInactivarItem(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Item Inactivo",
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

async function ActivarItem(id) {
  try {
    showDefault();
    await ItemStore.putActivarItem(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Item Inactivo",
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
  presupuesto.value = "";
  presupuestoDisponible.value = "";
  nombre.value = "";
  año.value = "";
}

let idRuta = ref("");

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
let _id = ref("")
function editarFicha(data) {
  fixed.value = true;
  _id.value = data._id
  nombre.value = data.nombre
  presupuesto.value = data.presupuesto
  presupuestoDisponible.value = data.presupuestoDisponible
  año.value = data.año
  cambio.value = 1;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

</script>

<style scoped>
.modal-content {
  width: 480px;
  height: 460px;
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
  background: #2e7d3284;
}
</style>
<style lang="sass">
    
    </style>
    