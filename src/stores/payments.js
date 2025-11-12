import { defineStore } from 'pinia'
import axios from 'axios'

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    pagos: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPagos() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get('http://localhost:3000/api/payments')
        this.pagos = res.data
      } catch (err) {
        this.error = 'Error al cargar pagos'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async crearPago(pagoData) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('http://localhost:3000/api/payments', pagoData)
        this.pagos.push(res.data)
        return res.data
      } catch (err) {
        this.error = 'Error al crear el pago'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})
