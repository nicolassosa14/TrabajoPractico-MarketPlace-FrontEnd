import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const userRole = ref(null) // Add userRole ref

  function login(userData) {
    isAuthenticated.value = true
    user.value = userData
    userRole.value = userData.role // Set userRole
    localStorage.setItem('userId', userData.id)
    localStorage.setItem('userRole', userData.role) // Store role in localStorage
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    userRole.value = null // Clear userRole on logout
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole') // Remove role from localStorage
  }

  function checkAuthStatus() {
    const userId = localStorage.getItem('userId')
    const storedRole = localStorage.getItem('userRole') // Get role from localStorage
    if (userId && storedRole) {
      isAuthenticated.value = true
      userRole.value = storedRole // Set userRole from localStorage
      // You might want to fetch user data here based on the userId
    } else {
      isAuthenticated.value = false
      userRole.value = null
    }
  }

  return { isAuthenticated, user, userRole, login, logout, checkAuthStatus } // Expose userRole
})