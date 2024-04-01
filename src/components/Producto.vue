<template>
  <div>
    <div>
      <h1 style="text-align: center; margin-top: 50px;">Productos</h1>
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
              <q-input v-model="codigo" label="Codigo" type="number" style="width: 300px" />
              <q-input v-model="descripcion" label="Descripcion" type="text" style="width: 300px" />
              <q-select v-model="unidadMedida" :options="options" label="Unidad de Medida" type="text" style="width: 300px" />
              <q-input v-model="precioUnitario" label="Precio Unitario" type="number" style="width: 300px" />
              <q-input v-model="iva" label="IVA" type="number" style="width: 300px" />
            </q-card-section>
          </div>

          <div class="containerError" v-if="mostrarError">
            <h4>{{ error }}</h4>
          </div>

          <q-separator />

          <q-card-actions align="center" style="gap: 30px; margin-top: 10px">
            <button class="btn" @click="fixed = false">Cancelar</button>
            <button @click="editaragregarProducto()" class="btn">Aceptar</button>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
    <div style="width: 55vw;">
      <div class="btn-agregar">
        <q-btn class="bg-secondary" label="Agregar Producto" @click="agregarProducto()" style=" background-color: #2e7d32 !important;"/>
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
              <q-btn color="white" text-color="black" label="🖋️" @click="EditarProducto(props.row)" />
              <q-btn glossy label="❌" @click="inactivarProducto(props.row._id)" v-if="props.row.estado == 1" />
              <q-btn glossy label="✔️" @click="activarProducto(props.row._id)" v-else />
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
import { useProductoStore } from "../stores/producto.js";
import { useQuasar } from "quasar";
const options = ref(["Litros", "Gramos", "Kilogramos"])
const ProductoStore = useProductoStore();
const $q = useQuasar();
let error = ref("Ingrese todos los datos para la creación de un producto");
let text = ref("");
let rows = ref([]);
let fixed = ref(false);
let codigo = ref("");
let nombre = ref("");
let descripcion = ref("");
let unidadMedida = ref("");
let precioUnitario = ref("");
let iva = ref("");
let consumible = ref("");
let cambio = ref(0);
let mostrarError = ref(false);
let mostrarData = ref(true);
let pagination = ref({ rowsPerPage: 0 });
let productos = ref([]);
async function obtenerInfo() {
  try {
    await ProductoStore.obtenerInfoProducto();
    productos.value = ProductoStore.productos;
    rows.value = ProductoStore.productos;
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
  { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left" },
  { name: "descripcion", label: "Descripcion", field: "descripcion", sortable: true, align: "left" },
  { name: "unidadMedida", label: "Unidad de Medida", field: "unidadMedida", sortable: true, align: "left" },
  { name: "precioUnitario", label: "Precio Unitario", field: "precioUnitario", sortable: true, align: "left",  format: (val) => formatCurrency(val) },
  { name: "iva", label: "IVA", field: "iva", sortable: true, align: "left",  format: (val) => formatCurrency(val) },
  { name: "consumible", label: "Consumible", field: "consumible", sortable: true, align: "left" },
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

function agregarProducto() {
  fixed.value = true;
  text.value = "Agregar Producto";
  cambio.value = 0;
  limpiar();
}
function validar() {
  if (codigo.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Digite el código del producto por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);

  } else if (nombre.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Ingrese el nombre del producto por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (descripcion.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Indique la descripción del producto por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (unidadMedida.value.trim() === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Seleccione la unidad de medida del producto por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (precioUnitario.value === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Ingrese el precio unitario del producto por favor";
    setTimeout(() => {
      mostrarData.value = true;
      mostrarError.value = false;
      error.value = "";
    }, 2200);
  } else if (iva.value === "") {
    mostrarData.value = false;
    mostrarError.value = true;
    error.value = "Ingrese el IVA del producto por favor";
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

async function editaragregarProducto() {
  validar();
  if (validacion.value === true) {
    if (cambio.value === 0) {
      try {
        showDefault();
        const respuestas = await ProductoStore.postProducto({
          codigo: codigo.value,
          nombre: nombre.value,
          descripcion: descripcion.value,
          unidadMedida: unidadMedida.value,
          precioUnitario: precioUnitario.value,
          iva: iva.value,
          consumible: consumible.value,
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
          message: "Producto Agregado",
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
          const respuesta = await ProductoStore.putEditarProducto(id, {
            _id: id,
            codigo: codigo.value,
            nombre: nombre.value,
            descripcion: descripcion.value,
            unidadMedida: unidadMedida.value,
            precioUnitario: precioUnitario.value,
            iva: iva.value,
            consumible: consumible.value,
          });
          if (respuesta.error) {
          setTimeout(() => {
          mostrarErrores(respuesta.error.errors[0].msg);
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
            message: "Producto Actualizado",
            timeout: 2000,
            type: "positive",
          });
          obtenerInfo();
          fixed.value = false;
        } catch (error) {
          cancelShow();
          notificar(`${error.response.data.error.errors[0].msg}`, "negative")
        }
      }
    }
    validacion.value = false;
  }



}

const cancelShow = ()=>{
  if (notification) {
    notification();
  };
};

function limpiar() {
  codigo.value = "";
  nombre.value = "";
  descripcion.value = "";
  unidadMedida.value = "";
  precioUnitario.value = "";
  iva.value = "";
  consumible.value = "";
}

let _id = ref("");

let validacion = ref(false);
let notification = ref(null);


const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 1500,
  });
};


const notificar = (msg, type) => {
  notification = $q.notify({
    message: msg,
    timeout: 1500,
    type: type,
  });
};

function EditarProducto(row) {
  fixed.value = true;
  text.value = "Editar Producto";
  cambio.value = 1; // Indica que es una edición
  _id.value = row._id; // Guarda el ID del producto que se está editando
  // Asigna los valores de la fila a las variables del formulario
  codigo.value = row.codigo;
  nombre.value = row.nombre;
  descripcion.value = row.descripcion;
  unidadMedida.value = row.unidadMedida;
  precioUnitario.value = row.precioUnitario;
  iva.value = row.iva;
  consumible.value = row.consumible;
}


async function inactivarProducto(id) {
  try {
    showDefault();
    await ProductoStore.putInactivarproducto(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Producto Inactivo",
      timeout: 2000,
      type: "positive",
    });
    obtenerInfo();
  } catch (error) {
    if (notification) {
      notification();
    }
    notificar(`${error.response.data.error.errors[0].msg}`, "negative")
  }
}

async function activarProducto(id) {
  try {
    showDefault();
    await ProductoStore.putActivarproducto(id);
    if (notification) {
      notification();
    }
    $q.notify({
      spinner: false,
      message: "Producto Activo",
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
  width: 540px;
  height: 610px;
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
  background: #2e7d327a;
}
</style>
<style lang="sass">
    
    </style>
    