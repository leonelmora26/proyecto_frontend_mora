import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAreaStore = defineStore('area', () => {
    const areas = ref([]);
  
    const obtenerInfoAreas = async () => {
        try {
            let responseAreas = await axios.get('area/area');
            areas.value = responseAreas.data.area;
        } catch (error) {
            throw error
        }
    };

    const postArea = async (data) => {
        try {
            console.log("d", data);
            let res = await axios.post("area/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditarArea = async (id, data) => {
        try {
            let res = await axios.put(`area/area/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivarArea = async (id) => {
        try {
            let r = await axios.put(`area/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const putActivarArea = async (id) => {
        try {
            let r = await axios.put(`area/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        areas,
        obtenerInfoAreas, postArea, putEditarArea, putInactivarArea, putActivarArea
    };
});