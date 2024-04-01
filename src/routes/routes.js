
import Login from "../components/Login.vue";
import Recuperar from "../components/Recuperar.vue";
import Home from "../components/Home.vue";
import Registrar from "../components/Registrar.vue";
import Area from "../components/Area.vue";
import Ficha from "../components/Ficha.vue";
import Usuario from "../components/Usuario.vue";
import Lote from "../components/Lote.vue";
import Pedido from "../components/Pedido.vue";
import Producto from "../components/Producto.vue";
import itemPresupuesto from "../components/itemPresupuesto.vue";
import Inicio from "../components/inicio.vue";
import distriPresupuesto from "../components/distriPresupuesto.vue";
import distriLoteFicha from "../components/distriLoteFicha.vue";
import { useUsuarioStore } from "../stores/usuario.js";
import { createRouter, createWebHashHistory } from "vue-router";
const auth = (to, from, next) => {
  if (checkAuth()) {
      const userUsuario = useUsuarioStore()
      const rol = userUsuario.usuario.rol
      console.log(rol);
      if (!to.meta.rol.includes(rol)) {
          return next({ path: '/Inicio' })
      }
      
      next()
  } else {
      return next({ path: '/Inicio' })
  }
}

const checkAuth = () => {
  const useUsuario = useUsuarioStore()

  const token = useUsuario.token
  if (!token) return false
  return true
};

const routes = [
  { path: "/",component: Login,},
  {path: "/Recuperar", component: Recuperar},
  { path: "/Home",component: Home,
    children: [
      {path: "/Inicio", component: Inicio, beforeEnter:auth, meta: {rol: ["administrador", "bodega", "instructor", "superAdmin" ]} },
      {path: "/Area", component: Area , beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/Ficha", component: Ficha, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/Usuario", component: Usuario, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]} },
      {path: "/Lote", component: Lote, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/Pedido", component: Pedido, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/Producto", component: Producto, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/itemPresupuesto", component: itemPresupuesto, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/distriPresupuesto", component: distriPresupuesto, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
      {path: "/distriLoteFicha", component: distriLoteFicha, beforeEnter:auth, meta: {rol: ["administrador", "superAdmin" ]}},
    ]
  },
  { path: "/Registrar", component: Registrar, },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
