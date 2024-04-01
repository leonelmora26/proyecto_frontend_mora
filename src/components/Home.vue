<template>
  <div>
    <q-layout view="hHh LpR fff">
      <q-header reveal elevated class="bg-green text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <q-toolbar-title>
            <q-avatar>
              <img :src="avatar" />
            </q-avatar>
          </q-toolbar-title>
          <q-fab icon="settings" direction="left" unelevated>
            <q-fab-action class="boton1" color="white" text-color="black" @click="onClick" label="Perfil" style="min-width: 100px; text-align: center;margin-right: 5px " />
            <router-link to="/">
            <q-fab-action class="boton1" color="white" text-color="black" @click="onClick" label="Salir" style="min-width: 100px; text-align: center;margin-right: 5px " />
            </router-link>
      </q-fab>

        </q-toolbar>
      </q-header>

      <q-drawer
        show-if-above
        v-model="leftDrawerOpen"
        side="left"
        behavior="mobile"
        elevated
      >
        <!-- Empty drawer -->
        <div class="drawer-content">
          <q-avatar size="130px" class="avatar">
            <img src="https://via.placeholder.com/150" />
          </q-avatar>
          <div class="text-h6">{{ username }}</div>
          <div class="divider"></div>

          <div class="navigation">
            <router-link
              v-for="(link, index) in links"
              :key="index"
              :to="link.path"
              class="nav-link"
              style="width: 100%"
            >
              <q-item clickable style="width: 100%">
                <q-item-section avatar>
                  <q-icon :name="link.icon"></q-icon>
                </q-item-section>
                <q-item-section
                  style="display: flex; align-content: flex-start"
                  >{{ link.text }}</q-item-section
                >
              </q-item>
            </router-link>
            <div class="divider"></div>
          </div>
        </div>
      </q-drawer>

      <q-page-container style="padding-top: 50px; width:100%">
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import avatar from "../assets/avatar.png";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useUsuarioStore} from '../stores/usuario.js'

const leftDrawerOpen = ref(false);
const route = useRoute();
const router = useRouter();
const settingsDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const links = [
  { text: "Inicio", icon: "home", path: "/Inicio" },
  { text: "Area", icon: "location_city", path: "/Area" },
  { text: "Ficha", icon: "description", path: "/Ficha" },
  { text: "Usuario", icon: "person", path: "/Usuario" },
  { text: "Lote", icon: "store", path: "/Lote" },
  { text: "Pedido", icon: "shopping_cart", path: "/Pedido" },
  { text: "Producto", icon: "local_offer", path: "/Producto" },
  { text: "Item presupuesto", icon: "attach_money", path: "/itemPresupuesto" },
];

const navigateTo = (path) => {
  router.push(path);
};

const toggleSettingsDrawer = () => {
  settingsDrawerOpen.value = !settingsDrawerOpen.value;
};

const useUsuario = useUsuarioStore()
const username = useUsuario.usuario.nombre

onMounted(async () => {
  try {
    const response = await axios.get('/usuario/usuario');
    username.value = response.data.username;
  } catch (error) {
    console.error("Error al obtener el nombre de usuario:", error);
  }
});

</script>


<style scoped>
.q-page-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.drawer-content[data-v-08e32229] {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  margin-top: 20px;
}

.text-h6 {
  margin-top: 10px;
  display: flex;
}

.divider {
  width: 80%;
  border-bottom: 1px solid #2aac4b;
  margin: 20px auto;
}

.navigation {
  display: flex;
  align-items: flex-start;
  width: 80%;
  text-align: center;
  flex-direction: column;
}

.nav-link {
  width: 100%;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Ajustado para alinear a la izquierda */
}

.nav-link:hover {
  background-color: #ccc;
}

.navigation .divider {
  height: 1px;
  width: 100%;
  background-color: #ccc;
  margin: 20px auto;
}

.bg-green {
  background-color: #2e7d32 !important;
}

a {
  text-decoration: none;
  color: black;
}

.q-focus-helper,
.q-focusable,
.q-manual-focusable,
.q-hoverable {
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glossy{
  background-image: none;
}

.glossy {
  text-decoration: none;
}

.boton1{
  border-radius: 15px;
}

</style>
