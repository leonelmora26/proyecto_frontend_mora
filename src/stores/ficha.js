import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useFichaStore = defineStore('ficha', () => {
    const fichas = ref([]);
  
    const obtenerInfoFichas = async () => {
        try {
            let responseFichas = await axios.get('ficha/all');
            fichas.value = responseFichas.data.ficha;
            return responseFichas.data.ficha
        } catch (error) {
            throw error
        }
    };

    const postFicha = async (data) => {
        try {
            console.log('d', data);
            let res = await axios.post('ficha/guardar', data);
            return res
        } catch (error) {
            return error.response.data
        }
    }

    const putEditarFicha = async (id, data) => {
        try {
            console.log(id, data);
            let res = await axios.put(`ficha/editar/${id}`, data);
            console.log(res);
            return res
        } catch (error) {
            return error.response.data
        }
    };

    const putInactivarFicha = async (id) => {
        try {
            let r = await axios.put(`ficha/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }
    const putActivarFicha = async (id) => {
        try {
            let r = await axios.put(`ficha/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }

    return {
        fichas,
        obtenerInfoFichas, postFicha, putEditarFicha,putInactivarFicha, putActivarFicha
    };
});