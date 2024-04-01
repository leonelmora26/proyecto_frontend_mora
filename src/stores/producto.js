import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProductoStore = defineStore('producto', () => {
    const productos = ref([]);
  
    const obtenerInfoProducto = async () => {
        try {
            let responseproducto = await axios.get('producto/producto');
            console.log(responseproducto);
            productos.value = responseproducto.data.producto;
        } catch (error) {
            throw error
        }
    };

    const postProducto = async (data) => {
        try {
            console.log('d', data);
            let res = await axios.post('producto/agregar', data);
            return res
        } catch (error) {
            return error.response.data
        }
    }

    const putEditarProducto = async (id, data) => {
        try {
            let res = await axios.put(`producto/producto/${id}`, data);
            return res
        } catch (error) {
            console.log(error);
            return error.response.data
        }
    };

    const putInactivarproducto = async (id) => {
        try {
            let r = await axios.put(`producto/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado del producto');
        }
    }
    const putActivarproducto = async (id) => {
        try {
            let r = await axios.put(`producto/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado del producto');
        }
    }

    return {
        productos,
        obtenerInfoProducto, postProducto, putEditarProducto, putInactivarproducto, putActivarproducto
    };
});