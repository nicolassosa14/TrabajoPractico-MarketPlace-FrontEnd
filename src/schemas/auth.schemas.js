import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup.string().required('La contraseña es requerida')
});

export const registerSchema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    email: yup.string().email('Email inválido').required('El email es requerido'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida')
});