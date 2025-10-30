import { ref } from "vue";
import axios from "axios";

export const usePatchData = () => {
    const data = ref(null);
    const errorPatch = ref(null);

    const patchData = async (url, info, isSwitch = false) => {
        errorPatch.value = null; // Clear previous errors
        if(!isSwitch){
            if (!confirm(`¿Estás seguro de que quieres editar?`)) {
                return false;
            }
        }
        try {
            const res = await axios.patch(url, info);
            data.value = res.data;
            if(!isSwitch){
                alert("Agregado con éxito.");
            }
            return true;
        } catch (e) {
            errorPatch.value = e;
            if(!isSwitch){
                alert("Error al actualizar.");
            }
            return false;
        }
    };

    return {
        patchData,
        errorPatch,
        data
    };
};