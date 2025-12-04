import axios from "axios"
import { API_BASE_URL } from "../utils/constants"

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/payments`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const paymentApi = {
  createPayment: (bookingId: string, amount: number) => api.post("/", { bookingId, amount }),

  getPaymentStatus: (paymentId: string) => api.get(`/${paymentId}`),

  confirmPayment: (paymentId: string, data: any) => api.post(`/${paymentId}/confirm`, data),
}
