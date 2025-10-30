import { ref } from "vue";
import axios from "axios";

export const usePostData = () => {
    const data = ref(null);
    const errorpost = ref(null);

    const PostData = async (url, info) => {
        try {
            const res = await axios.post(`${url}`, info);
            data.value = res.data;
            return { data: res.data, error: null };
        } catch (e) {
            errorpost.value = e;
            return { data: null, error: e.message };
        }
    };

    return {
        PostData,
        errorpost,
        data
    };
};