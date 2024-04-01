import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useLoteStore = defineStore('lote', () => {
    const lotes = ref([]);
  
    const obtenerInfoLotes = async () => {
        try {
            let responseLotes = await axios.get('lote/all');
            lotes.value = responseLotes.data.lote;
        } catch (error) {
            throw error
        }
    };

    const postLote = async (data) => {
        try {
            console.log("d", data);
            let res = await axios.post("lote/guardar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarLote = async (id, data) => {
        try {
            console.log(id, data);

            let res = await axios.put(`lote/editar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarLote = async (id) => {
        try {
            let r = await axios.put(`lote/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const putActivarLote = async (id) => {
        try {
            let r = await axios.put(`lote/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }

    return {
        lotes,
        obtenerInfoLotes, postLote, putEditarLote, putActivarLote, putInactivarLote
    };
});