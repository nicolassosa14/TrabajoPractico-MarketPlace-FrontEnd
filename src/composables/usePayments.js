import axios from 'axios'

const API_URL = 'http://localhost:3000/api/payments' 

    export function usePayments() {
    const getPayments = async () => {
        const res = await axios.get(API_URL)
        return res.data
    }

    const createPayment = async (data) => {
        const res = await axios.post(API_URL, data)
        return res.data
    }

    const deletePayment = async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`)
        return res.data
    }

    return { getPayments, createPayment, deletePayment }
    }
