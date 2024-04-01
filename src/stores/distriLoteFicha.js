import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDistriLoteFicha = defineStore('disLoteFicha', () => {
    const disLoteFicha = ref([]);
  
    const obtenerInfoDisLoteFicha = async () => {
        try {
            let responseDisLoteFicha = await axios.get('disloteficha/all');
            return responseDisLoteFicha.data.disLoteFicha
        } catch (error) {
            throw error
        }
    };

    const postAgregardisLoteFicha = async (data) => {
        try {
            console.log('d', data);
            let res = await axios.post('disloteficha/guardar', data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarDisLoteFicha_pre = async (id, data) => {
        try {
            console.log(id, data);
            let res = await axios.put(`disloteficha/distribuciones/${id}`, data);
            console.log(res);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putDisLoteFichaInactivar = async (id) => {
        try {
            let r = await axios.put(`disloteficha/distribuciones/desactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }
    const putDisLoteFichaActivar = async (id) => {
        try {
            let r = await axios.put(`disloteficha/distribuciones/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }

    return {
        disLoteFicha,
        obtenerInfoDisLoteFicha, postAgregardisLoteFicha, putEditarDisLoteFicha_pre,putDisLoteFichaInactivar, putDisLoteFichaActivar
    };
});