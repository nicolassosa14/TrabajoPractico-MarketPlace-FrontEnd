import { ref } from "vue";
import axios from "axios";

export const useDeleteData = () => {
    const data = ref(null);
    const loading = ref(true);
    const errordelete = ref(null);

    const deleteData = async (url, id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este atleta?")) {
            return false;
        }
        loading.value = true;
        try {
            const res = await axios.delete(`${url}${id}`);
            data.value = res.data;
            alert("Atleta eliminado con éxito.");
            return true;
        } catch (e) {
            errordelete.value = e;
            alert("Error al eliminar el atleta.");
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        deleteData,
        loading,
        errordelete,
        data
    };
};