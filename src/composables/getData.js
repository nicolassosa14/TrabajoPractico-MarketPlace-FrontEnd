import { ref } from "vue";
import axios from "axios";

export const useGetData = () => {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(null);

    const getData = async (url) => {
        loading.value = true;
        try {
            const res = await axios.get(url);
            data.value = res.data;
        } catch (e) {
            error.value = e;
        } finally {
            setTimeout(() => {
                loading.value = false;
            }, 500);
        }
    };

    return {
        getData,
        loading,
        data,
        error,
    };
};