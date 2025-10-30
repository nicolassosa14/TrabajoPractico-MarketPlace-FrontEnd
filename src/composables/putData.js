import { ref } from "vue";
import axios from "axios";

export const usePutData = () => {
    const data = ref(null);
    const loading = ref(true);
    const errorPut = ref(null);

    const putData = async (url, id, info) => {
        if (!confirm(`¿Estás seguro de que quieres editar?`)) {
            return false;
        }
        loading.value = true;
        try {
            const res = await axios.put(`${url}${id}`, info);
            data.value = res.data;
            alert("Editado con éxito.");
            return true;
        } catch (e) {
            errorPut.value = e;
            alert("Error al editar.");
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        putData,
        loading,
        errorPut,
        data
    };
};