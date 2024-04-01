import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usedistriPresupuesto = defineStore('Dispresupuesto', () => {
    const Dispresupuestos = ref([]);
  
    const obtenerInfoDispresupuestos = async () => {
        try {
            let responsedistripresupuesto = await axios.get(`dispresupuesto/dispresupuesto`);

            Dispresupuestos.value = responsedistripresupuesto.data.Dispresupuesto;
            return responsedistripresupuesto.data.dispresupuesto
        } catch (error) {
            throw error
        }
    };

    const postAgregardispresupuesto = async (data) => {
        try {
            console.log('d', data);
            let res = await axios.post('dispresupuesto/agregar', data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putEditardispresupuestos_pre = async (id, data) => {
        try {
            console.log(id, data);
            let res = await axios.put(`dispresupuesto/dispresupuesto/${id}`, data);
            console.log(res);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putdispresupuestoInactivar = async (id) => {
        try {
            let r = await axios.put(`dispresupuesto/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }
    const putdispresupuestoActivar = async (id) => {
        try {
            let r = await axios.put(`ficha/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, 'Error al cambiar el estado de la ficha');
        }
    }

    return {
        Dispresupuestos,
        obtenerInfoDispresupuestos, postAgregardispresupuesto, putEditardispresupuestos_pre,putdispresupuestoActivar, putdispresupuestoInactivar
    };
});