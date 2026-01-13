import axios from 'axios'

// Centralized Axios instance for future real backend API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
,
  withCredentials: true
})

export default api
