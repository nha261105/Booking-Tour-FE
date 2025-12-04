import { useState } from "react";
import {
  adminApi,
  type User,
  type Role,
  type AssignRoleRequest,
} from "../../../../api/admin.api";
import { isAdmin } from "../../../../utils/auth";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = async (page = 0, size = 10) => {
    // Kiểm tra quyền admin trước khi gọi API
    if (!isAdmin()) {
      setError("Bạn không có quyền truy cập tính năng này");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAllUsers(page, size);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Lỗi khi tải danh sách users";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    // Kiểm tra quyền admin
    if (!isAdmin()) {
      setError("Bạn không có quyền truy cập tính năng này");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getRoles();
      setRoles(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Lỗi khi tải danh sách roles";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number) => {
    // Kiểm tra quyền admin
    if (!isAdmin()) {
      setError("Bạn không có quyền truy cập tính năng này");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getUserById(id);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Lỗi khi tải thông tin user";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: number, roleName: string) => {
    // Kiểm tra quyền admin từ token
    if (!isAdmin()) {
      setError("Bạn không có quyền gán role");
      return { success: false, error: "Bạn không có quyền gán role" };
    }

    setLoading(true);
    setError(null);
    try {
      console.log("📤 Gán role:", { userId, role: roleName });
      const response = await adminApi.assignRole(userId, roleName);
      console.log("✅ Gán role thành công:", response.data);

      // Cập nhật user trong state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: roleName } : u))
      );
      return { success: true };
    } catch (err: any) {
      console.error("❌ Lỗi gán role:", err.response?.data || err.message);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Lỗi khi gán role";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    roles,
    loading,
    error,
    totalPages,
    totalElements,
    fetchUsers,
    fetchRoles,
    getUserById,
    assignRole,
  };
}
