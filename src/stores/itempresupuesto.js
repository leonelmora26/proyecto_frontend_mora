import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useItemStore = defineStore('items', () => {
    const items = ref([]);
  
    const obtenerInfoitem = async () => {
        try {
            let responseItem = await axios.get('items/itemns');
            console.log(responseItem);
            items.value = responseItem.data.item;
        } catch (error) {
            throw error
        }
    };

    const postItem = async (data) => {
        try {
            console.log('d', data);
            let res = await axios.post('items/agregar', data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarItem = async (id, data) => {
        try {
            console.log(id , data );
            let res = await axios.put(`items/itemns/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarItem = async (id) => {
        try {
            let r = await axios.put(`items/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado del item');
        }
    }
    const putActivarItem = async (id) => {
        try {
            let r = await axios.put(`items/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado del item');
        }
    }

    return {
        items,
        obtenerInfoitem, postItem, putEditarItem, putInactivarItem, putActivarItem
    };
});