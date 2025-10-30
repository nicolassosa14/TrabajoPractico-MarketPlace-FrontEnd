import { ref } from "vue";
import axios from "axios";

export const useEditData = () => {
    const data = ref(null);
    const loading = ref(true);
    const errorpost = ref(null);

    const EditarData = async (url, info) => {
        if (!confirm(`¿Estás seguro de que quieres editarlo?`)) {
            return false;
        }
        loading.value = true;
        try {
            const res = await axios.put(`${url}`, info);
            alert("editado con éxito.");
            return true;
        } catch (e) {
            errorpost.value = e;
            alert("Error al editar.");
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        EditarData,
        loading,
        errorpost,
        data
    };
};