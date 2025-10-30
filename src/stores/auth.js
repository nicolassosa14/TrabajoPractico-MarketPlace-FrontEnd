import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useGetData } from '@/composables/getData'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  function login(userData) {
    isAuthenticated.value = true
    user.value = userData
    localStorage.setem('userId', userData.id)
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    localStorage.remeItem('userId')
  }

  function checkAuthStatus() {
    const userId = localStorage.getItem('userId')
    if (userId) {
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, user, login, logout, checkAuthStatus } // Expose userRole
})