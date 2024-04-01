<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px">Pedido</h1>
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
              <!-- <q-input v-model="fechacreacion" label="Fecha Creacion" type="date" style="width: 300px" /> -->
              <q-input filled v-model="fechacreacion" label="Fecha" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="fechacreacion">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
              <q-select filled v-model="idficha" :options="OpcionesFicha" label="Id Ficha" emit-value map-options style="min-width: 250px; max-width: 300px"/><br>
              <q-select filled v-model="idInstructorEncargado" :options="OpcionesUsuario" label="Encargado" emit-value map-options style="min-width: 250px; max-width: 300px"/><br>
              <q-input filled type="number" v-model="total" label="Total" emit-value map-options style="min-width: 250px; max-width: 350px"/>
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator/>

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" v-close-popup>Cancelar</button>
            <button @click="editarAgregarPedio()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 1000px">
      <div class="btn-agregar">
        <q-btn
          class="bg-secondary"
          label="Agregar Pedido"
          @click="agregarPedido()" style=" background-color: #2e7d32 !important;"
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
              <q-btn glossy label="❌" @click="inactivarPedido(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn glossy label="✔️" @click="activarPedido(props.row._id)" v-else />
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
import { usePedidoStore } from "../stores/pedido.js";
import { useFichaStore} from "../stores/ficha.js"
import { useUsuarioStore } from "../stores/usuario.js"
import { useQuasar } from "quasar";
const PedidoStore = usePedidoStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creacion de un vendedor");
let text = ref("");
let rutas = ref([]);
let rows = ref([]);
let fixed = ref(false);
let fechacreacion = ref("");
let total = ref("");
let idficha = ref("");
let idInstructorEncargado = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 });
let pedidos = ref([]);
async function obtenerInfo() {
  try {
    await PedidoStore.obtenerpedido();
    pedidos.value = PedidoStore.pedidos;
    rows.value = PedidoStore.pedidos;
    // console.log(rows.value);
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
  {
    name: "fechacreacion",
    label: "Fecha creacion",
    field: "fechacreacion",
    format: (val) => format(new Date(val), "yyyy-MM-dd"),
    sortable: true,
    align: "left",
  },
  {
    name: "idficha",
    label: "Codigo Ficha",
    field: (val) => val.idficha.codigo_ficha,
    sortable: true,
    align: "left",
  },
  {
    name: "idInstructorEncargado",
    label: "Nombre",
    field: (val)=> val.idInstructorEncargado.nombre,
    sortable: true,
    align: "left",
  },

  {
    name: "total",
    label: "total",
    field: "total",
    sortable: true,
    align: "left",
    format: (val) => formatCurrency(val)
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

function agregarPedido() {
  fixed.value = true;
  text.value = "Agregar Pedio";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (fechacreacion.value.trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el fechacreacion del pedido por favor";
  } else if (idficha.value == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione una de la fichas";
  } else if (idInstructorEncargado.value == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione un encargado";
  } else if (total.value.toString().trim() == "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Cunato dinero va a tener el pedido";
  } else {
    mostrarData.value = true;
    mostrarError.value = false;
    error.value = "";
    validacion.value = true;
  }

  // Restablecer los mensajes de error después de un tiempo
  setTimeout(() => {
    mostrarData.value = true;
    mostrarError.value = false;
    error.value = "";
  }, 2200);
}
async function editarAgregarPedio() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      if (fechacreacion.value.trim() === "") {
        mostrarData.value = false;
        mostrarError.value = true;
        error.value = "Por favor digite un fechacreacion";
        setTimeout(() => {
          mostrarData.value = true;
          mostrarError.value = false;
          error.value = "";
        }, 2200);
        return;
      }
      try {
        showDefault();
        await PedidoStore.postpedido({
          fechacreacion: fechacreacion.value,
          idficha: idficha.value.value,
          idInstructorEncargado: idInstructorEncargado.value.value,
          total: total.value,
        });
        if (notification) {
          notification();
        }
        limpiar();
        $q.notify({
          spinner: false,
          message: "Pedido Agregado",
          timeout: 2000,
          type: "positive",
        });
        // console.log("a");
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
      let id = idPedido.value;
      if (id) {
        try {
          showDefault();
          await PedidoStore.putEditarpedido(id, {
          fechacreacion: fechacreacion.value,
          idficha: idficha.value,
          idInstructorEncargado: idInstructorEncargado.value,
          total: total.value,
          });
          if (notification) {
            notification();
          }
          limpiar();
          $q.notify({
            spinner: false,
            message: "Pedido Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
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
let idPedido = ref("")
function editarPedido(data) {
  console.log(data);
  idPedido.value = String(data._id)
  fixed.value = true;
  fechacreacion.value = format(new Date(data.fechacreacion), "yyyy-MM-dd")
  idInstructorEncargado.value = data.idInstructorEncargado.nombre
  idficha.value = data.idficha.codigo_ficha
  total.value = data.total
  cambio.value = 1;
}

function limpiar() {
  fechacreacion.value = "";
  idficha.value = "";
  idInstructorEncargado.value = "";
  total.value = "";
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

let estado = ref("")

async function inactivarPedido(id) {
  try {
    showDefault();
    await PedidoStore.putInactivarpedido(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Pedio Inactivo",
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


async function activarPedido(id) {
  try {
    showDefault();
    await PedidoStore.putActivarpedido(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Pedido Activo",
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

const useFicha = useFichaStore();
const OpcionesFicha = ref([])
async function obtenerOptions() {
  try {
    const responseFichas = await useFicha.obtenerInfoFichas();
    console.log(responseFichas);

    const fichas = responseFichas.filter(ficha=>ficha.estado==true)

    OpcionesFicha.value = fichas.map((ficha) => {
      return {
        label:
          ficha.codigo_ficha +
          " / " + ficha.nombre,
        value: ficha._id,
      };
    });

  } catch (error) {
    console.log(error);
  }
}
obtenerOptions()

const useUsuario = useUsuarioStore();
const OpcionesUsuario = ref([])
async function obtenerOptionsotro() {
  try {
    const responseUsuario = await useUsuario.obtenerusuario();
    console.log(responseUsuario);

    const Usuarios = responseUsuario.filter(usuario=>usuario.estado==true)

    OpcionesUsuario.value = Usuarios.map((usuario) => {
      return {
        label:
          usuario.usuario +
          " / " + usuario.nombre,
        value: usuario._id,
      };
    });
    
  } catch (error) {
    console.log(error);
  }
}
obtenerOptionsotro()


onMounted(async () => {
  obtenerInfo();
});
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
  