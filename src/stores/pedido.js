import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const usePedidoStore = defineStore('pedido', () => {
  const pedidos = ref([]);
  const obtenerpedido = async () => {
    try {
      let responsepedido = await axios.get('pedido/all');
      // console.log(responsepedido);
      pedidos.value = responsepedido.data.pedido;
      // console.log(responsepedido.data.pedido);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const postpedido = async (data) => {
    try {
      let res = await axios.post('pedido/agregar', data);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const putInactivarpedido = async (id) => {
    try {
        let r= await axios.put(`pedido/inactivar/${id}`)
        return r
    } catch (error) {
        console.log(error, 'Error al cambiar el estado del pedido');

    }
  };

  
  const putActivarpedido = async (id) => {
    try {
        let r= await axios.put(`pedido/activar/${id}`)
        return r
    } catch (error) {
        console.log(error, 'Error al cambiar el estado del pedido');
    }
  };

  const pedido = ref ([])
  return {
    pedidos, pedido,
    obtenerpedido, postpedido,putInactivarpedido, putActivarpedido, 
  }
});
