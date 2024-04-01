<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px;">Ficha</h1>
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
              <q-input v-model="codigo_ficha" label="Codigo" type="number" style="width: 300px" />
              <q-input v-model="nombre" label="Nombre" type="string" style="width: 300px" />
              <q-select v-model="nivel_de_formacion" :options="options" label="Nivel de formacion" style="width: 300px" />
              <q-input v-model="fecha_inicio" label="fecha inicio" type="date" style="width: 300px"/>
              <q-input v-model="ficha_fin" label="fecha fin" type="date" style="width: 300px" />

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
    <div style="width: 1000px; ">
      <div class="btn-agregar" style="">
        <q-btn  label="Agregar Ficha" @click="agregarFicha()" style=" background-color: #2e7d32 !important;"/>
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
              <q-btn glossy label="❌" @click="inactivarFicha(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn glossy label="✔️" @click="activarFicha(props.row._id)" v-else />
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
import { useFichaStore } from "../stores/ficha.js";
import { useQuasar } from "quasar";
const options = ref(["tecnico", "tecnologo", "especializacion"]);
const FichaStore = useFichaStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
let text = ref("");
let rows = ref([]);
let fixed = ref(false);
let nombre = ref("");
let codigo_ficha = ref("");
let nivel_de_formacion = ref("");
let fecha_inicio = ref("");
let ficha_fin = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 })
let fichas = ref([]);
async function obtenerInfo() {
  try {
    await FichaStore.obtenerInfoFichas();
    fichas.value = FichaStore.fichas;
    rows.value = FichaStore.fichas;
    console.log(FichaStore.fichas);
  } catch (error) {
    console.log(error);
  }
}


const columns = [
  { name: "codigo_ficha", label: "codigo ficha", field: "codigo_ficha", sortable: true, align: "left" },
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },
  { name: "nivel_de_formacion", label: "Nivel", field: "nivel_de_formacion", sortable: true, align: "left" },
  { name: "fecha_inicio", label: "fecha inicio", field: "fecha_inicio", format: (val) => format(new Date(val), "yyyy-MM-dd"), sortable: true, align: "left" },
  { name: "ficha_fin", label: "ficha fin", field: "ficha_fin", format: (val) => format(new Date(val), "yyyy-MM-dd"), sortable: true, align: "left" },

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

function agregarFicha() {
  fixed.value = true;
  text.value = "Agregar Ficha";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (codigo_ficha.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el codigo de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);

  } else if (nombre.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Ingrese el nombre de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (nivel_de_formacion.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Indique el nivel de formacion de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (fecha_inicio.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione la hora de Inicio de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (ficha_fin.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione la hora de finalizacion de la ficha por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (new Date(ficha_fin.value) < new Date(fecha_inicio.value)) {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "La fecha de finalización no puede ser menor a la fecha de inicio";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else {
    validacion.value = true;
  }
}

function mostrarErrores(msg) {
  notification = $q.notify({
    type: 'negative',
    message: msg,
    timeout: 2000,
  });
};

async function editaragregarFicha() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      if (nombre.value.trim() === '') {
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
        const respuestas = await FichaStore.postFicha({
          nombre: nombre.value,
          codigo_ficha: codigo_ficha.value,
          nivel_de_formacion: nivel_de_formacion.value,
          fecha_inicio: fecha_inicio.value,
          ficha_fin: ficha_fin.value,
        });

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
          message: "Area Agregado",
          timeout: 2000,
          type: "positive",
        });
        console.log("a")
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
          const respuesta = await FichaStore.putEditarFicha(id, {
            _id: id,
            nombre: nombre.value,
            codigo_ficha: codigo_ficha.value,
            nivel_de_formacion: nivel_de_formacion.value,
            fecha_inicio: fecha_inicio.value,
            ficha_fin: ficha_fin.value,
          });
          if (respuesta.error) {
            setTimeout(() => {
              mostrarErrores(respuesta.error.errors[0].msg);
              mostrarError.value = false;
              error.value = "";
            }, 2000);
            return;
          }




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
  codigo_ficha.value = "";
  nombre.value = "";
  nivel_de_formacion.value = "";
  fecha_inicio.value = "";
  ficha_fin.value = "";

}


let validacion = ref(false);
let notification = ref(null);
const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 1000,
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

let idFicha = ref("")
function editarFicha(data) {
  fixed.value = true;
  idFicha.value = String(data._id)
  nombre.value = data.nombre
  codigo_ficha.value = data.codigo_ficha
  nivel_de_formacion.value = data.nivel_de_formacion
  fecha_inicio.value = format(new Date(data.fecha_inicio), 'yyyy-MM-dd')
  ficha_fin.value = format(new Date(data.ficha_fin), 'yyyy-MM-dd')
  cambio.value = 1;
}
async function inactivarFicha(id) {
  try {
    showDefault();
    await FichaStore.putInactivarFicha(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ficha Inactiva",
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

async function activarFicha(id) {
  try {
    showDefault();
    await FichaStore.putActivarFicha(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Ficha Activa",
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
  background-color: #2aac4b;
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

    