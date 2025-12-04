import axios from "axios";
import { AUTH_API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: `${AUTH_API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${AUTH_API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );
          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// User interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string; // "USER" | "ADMIN"
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface AssignRoleRequest {
  userId: number;
  role: string; // Changed from roleName to role
}

export const adminApi = {
  // ===== USER MANAGEMENT APIs =====

  // Lấy danh sách users (có phân trang)
  getAllUsers: (page = 0, size = 10) =>
    api.get<PaginatedUsers>("/users", {
      params: { page, size },
    }),

  // Lấy chi tiết user theo ID
  getUserById: (id: number) => api.get<User>(`/users/${id}`),

  // ===== ROLE MANAGEMENT APIs =====

  // Lấy danh sách roles
  getRoles: () => api.get<Role[]>("/auth/roles"),

  // Gán role cho user (ADMIN only)
  assignRole: (userId: number, role: string) =>
    api.post("/auth/roles/assign", { userId, role }),
};
