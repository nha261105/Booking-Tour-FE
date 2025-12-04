import axios from "axios";
import { BOOKING_API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: BOOKING_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Booking interfaces
export interface CreateBookingRequest {
  tourId: number;
  numberOfPeople: number;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  bookingDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  content: Booking[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const bookingApi = {
  // Tạo booking mới
  createBooking: (data: CreateBookingRequest) =>
    api.post<Booking>("/api/bookings", data),

  // Lấy danh sách bookings (không phân trang - cho tương thích)
  getBookings: () => api.get<Booking[]>("/api/bookings"),

  // Lấy danh sách tất cả bookings (có phân trang)
  getAllBookings: (page = 0, size = 10) =>
    api.get<PaginatedBookings>("/api/bookings", {
      params: { page, size },
    }),

  // Lấy chi tiết booking theo ID
  getBookingById: (id: number) => api.get<Booking>(`/api/bookings/${id}`),

  // Lấy bookings của một user
  getUserBookings: (userId: number) =>
    api.get<Booking[]>(`/api/bookings/user/${userId}`),

  // Xác nhận booking (Admin)
  confirmBooking: (id: number) =>
    api.put<Booking>(`/api/bookings/${id}/confirm`),

  // Hủy booking (User/Admin)
  cancelBooking: (id: number) => api.put<Booking>(`/api/bookings/${id}/cancel`),

  // Từ chối booking với lý do (Admin)
  rejectBooking: (id: number, reason: string) =>
    api.put<Booking>(`/api/bookings/${id}/reject`, { reason }),
};
