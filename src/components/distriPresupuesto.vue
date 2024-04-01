<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px">Presupuesto lotes</h1>
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
              <q-input
                v-model="presupuesto"
                label="Presupuesto"
                type="number"
                style="width: 300px"
              />
              <q-input
                v-model="id_lote"
                options="optionslote"
                label="Id Lote"
                type="string"
                style="width: 300px"
              />
              <q-input
                v-model="id_item"
                options="optionsitem"
                label="Id Item"
                type="string"
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
            <button @click="editaragregarFicha()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px">
      <div class="btn-agregar">
        <q-btn
          label="Agregar Presupuesto"
          @click="agregarPresupuesto()"
          style="background-color: #2e7d32 !important"
        />
        <router-link to="/itemPresupuesto">
          <q-btn label="Volver Atras" style="background-color: #2e7d32; color: white;" />
        </router-link>
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
                @click="editarFicha(props.row)"
              />
              <q-btn
                glossy
                label="❌"
                @click="inactivarFicha(props.row._id)"
                v-if="props.row.estado == 1"
              />
              <q-btn
                glossy
                label="✔️"
                @click="activarFicha(props.row._id)"
                v-else
              />
              <router-link to="/distriLoteFicha">
                <q-btn color="white" text-color="black" label="fichas" />
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
import { usedistriPresupuesto } from "../stores/distriPresupuesto.js";
import { useQuasar } from "quasar";
import { useItemStore } from "../stores/itempresupuesto.js";
import { useLoteStore } from "../stores/lote.js";
const distriPresupuestoStore = usedistriPresupuesto();
const loteStore = useLoteStore();
const ItemStore = useItemStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
let text = ref("");
let rows = ref([]);
let fixed = ref(false);
let id_lote = ref("");
let presupuesto = ref("");
let id_item = ref("");
let cambio = ref(0);
let optionsitem = ref("");
let optionslote = ref("");
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 });
let Dispresupuestos = ref([]);
async function obtenerInfo() {
  try {
    const r = await distriPresupuestoStore.obtenerInfoDispresupuestos();
    Dispresupuestos.value = distriPresupuestoStore.Dispresupuestos;
    rows.value = r.reverse();
    console.log(r);
  } catch (error) {
    console.log(error);
  }
}

async function obtenerlote() {
  try {
    await loteStore.obtenerInfoLotes();
    optionslote.value = loteStore.lotes.map((lote) => ({
      label: `${lote.nombre} `,
      value: String(lote._id),
    }));
    console.log(optionslote);
  } catch (error) {
    console.log(error);
  }
}
obtenerlote();

async function obteneritem() {
  try {
    await ItemStore.obtenerInfoitem();
    optionsitem.value = ItemStore.items.map((items) => ({
      label: `${items.nombre} - ${items.presupuesto} `,
      value: String(items._id),
    }));

    console.log(optionsitem);
  } catch (error) {
    console.log(error);
  }
}
obteneritem();
const columns = [
  { name: "presupuesto", label: "Presupuesto", field: "presupuesto", sortable: true, align: "left" },
  { name: "presupuestoDisponible", label: "Presupuesto disponible", field: "presupuestoDisponible", sortable: true, align: "left" },
  { name: "id_lote", label: "Nombre del lote", field: val=>val.id_lote.nombre, sortable: true, align: "left" },
  { name: "id_item", label: " Nombre del item", field: val=>val.id_item.nombre, sortable: true, align: "left" },
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

function agregarPresupuesto() {
  fixed.value = true;
  text.value = "Agregar Presupuesto";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (presupuesto.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el codigo de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (id_lote.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Ingrese el lote de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (id_item.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione algun item";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);

    if (!presupuesto.value && !id_item.value && !id_lote.value) {
      badMessage.value = "Por favor rellene los campos";
      showBad();
    } else {
      validacion.value = true;
    }
  }
}

async function editaragregarFicha() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      if (id_lote.value.trim() === "") {
        mostrarData.value = false;
        mostrarError.value = true;
        error.value = "Por favor digite un id_lote";
        setTimeout(() => {
          mostrarData.value = true;
          mostrarError.value = false;
          error.value = "";
        }, 2200);
        return;
      }
      try {
        showDefault();
        await distriPresupuestoStore.postFicha({
          presupuesto: presupuesto.value,
          id_lote: id_lote.value,
          id_item: id_item.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Area Agregado",
          timeout: 2000,
          type: "positive",
        });
        console.log("a");
        obtenerInfo();
        fixed.value = false;
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
      let id = idFicha.value;
      if (id) {
        try {
          showDefault();
          await distriPresupuestoStore.putEditarFicha(id, {
            presupuesto: presupuesto.value,
            id_lote: id_lote.value,
            id_item: id_item.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Ficha Actualizada",
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

function limpiar() {
  presupuesto.value = " ";
  id_lote.value = " ";
  id_item.value = " ";
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
// function getTodayDate() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = (today.getMonth() + 1).toString().padStart(2, "0");
//   const day = today.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

let idFicha = ref("");
function editarFicha(data) {
  fixed.value = true;
  id_lote.value = data.id_lote;
  presupuesto.value = data.presupuesto;
  id_item.value = data.id_item;
  cambio.value = 1;
}
async function inactivarFicha(id) {
  try {
    showDefault();
    await distriPresupuestoStore.putInactivarFicha(id);
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

async function activarFicha(id) {
  try {
    showDefault();
    await distriPresupuestoStore.putActivarFicha(id);
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
</script>

<style scoped>
.modal-content {
  width: 480px;
  height: 500px;
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
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  color: white;
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
  background: #2e7d3282;
}
</style>
<style lang="sass"></style>
