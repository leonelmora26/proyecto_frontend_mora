import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUsuarioStore = defineStore('usuario', () => {
  const usuarios = ref([]);
  const obtenerusuario = async () => {
    try {
      let responseusuario = await axios.get('usuario/usuario');
      usuarios.value = responseusuario.data.usuario;
      return responseusuario.data.usuario
    } catch (error) {
      throw error;
    }
  };

  const postusuario = async (data) => {
    try {
      let res = await axios.post('usuario/agregar', data);
      return res;
    } catch (error) {
      throw error;
    }
  };
  
  // const verificarCodigo = async (codigo) => {
  //   try {
  //     let response = await axios.post(usuario/confirmarcodigo/${codigo});
  //     console.log("Hola soy enviar codigo", response)
  //     return response;
  //   } catch (error) {
  //     console.log("Nokas pelotas v2", error);
  //   }
  // }

  const sendemail = async (correo) => {
    try {
      let response = await axios.post("usuario/recuperar-password", correo);
      console.log("Hola soy enviar email", response)
      return response;
    } catch (error) {
      console.log("Nokas pelotas", error);
    }
  };

//   const newpassword = async (data) => {
//     try {
//         let res = await axios.put("usuario/nuevaPassword", data);
//         console.log("Felicidades mi loko lo lograste", res)
//         return res
//     } catch (error) {
//       console.log("Nokas pelotas v3", error);
//         throw error;
//     }
// };

  const putusuarioInactivar = async (id) => {
    try {
        let r= await axios.put(`usuario/inactivar/${id}`)
        return r
    } catch (error) {
        console.log(error, 'Error al cambiar el estado de el usuario');

    }
  };

  
  const putusuarioActivar = async (id) => {
    try {
        let r= await axios.put(`usuario/activar/${id}`)
        return r
    } catch (error) {
        console.log(error, 'Error al cambiar el estado de el usuario');
    }
  };
  const token = ref("")
  const usuario = ref ([])
  const login = async (data) => {
    try {
        let r = await axios.post('usuario/login', data)
        console.log(r);
        usuario.value=r.data.usuarios
        console.log( r.data.token);
        token.value = r.data.token
        return r.status

    } catch (error) {
        console.log(error)
        return error.response.data
    }
  }
  return {
    usuarios, usuario, token,
    obtenerusuario, postusuario, login,putusuarioActivar, putusuarioInactivar, sendemail,
  }
}, {
  persist: true,
});
