import {ref, computed} from 'vue'
import { defineStore } from 'pinia'


export const useRegistrarStore = defineStore('registrar', () => {
    const nombre = ref('');
    const email = ref('');

    const registrarForm = (nombreForm, emailForm) =>{
        nombre.value = nombreForm;
        email.value = emailForm;
    }

    return {registrarForm, nombre, email}
})
