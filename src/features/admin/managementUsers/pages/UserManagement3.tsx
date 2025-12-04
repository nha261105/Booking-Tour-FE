import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, UserCog } from "lucide-react";
import { useUserManagement } from "../hooks/useUserManagement";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "../../../../api/admin.api";
import { isAdmin } from "../../../../utils/auth";

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const {
    users,
    roles,
    loading,
    error,
    totalPages,
    totalElements,
    fetchUsers,
    fetchRoles,
    assignRole,
  } = useUserManagement();

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  // Kiểm tra quyền admin ngay khi component mount
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchUsers(currentPage, pageSize);
    fetchRoles();
  }, [currentPage]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    // Filter local nếu cần
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    const result = await assignRole(selectedUser.id, selectedRole);
    if (result.success) {
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
      fetchUsers(currentPage, pageSize);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const filteredUsers = searchKeyword
    ? users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          u.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          u.username.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : users;

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-100 mb-2">
          Quản lí người dùng
        </h1>
        <p className="text-gray-400 italic font-serif">
          Xem và điều chỉnh thông tin người dùng ({totalElements} users)
        </p>
      </header>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <InputGroup className="max-w-md shadow-lg shadow-black/40 border border-white/10 bg-[#374151] rounded-lg">
          <InputGroupInput
            placeholder="Tìm kiếm người dùng..."
            className="bg-transparent text-gray-100 placeholder-gray-400"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <InputGroupAddon className="text-gray-300">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="border border-white/10 shadow-lg shadow-black/40 rounded-lg overflow-hidden bg-[#374151]">
          <Table className="w-full">
            <TableHeader className="bg-[#2f3640]/70">
              <TableRow>
                {[
                  "ID",
                  "Username",
                  "Họ và tên",
                  "Email",
                  "SĐT",
                  "Role",
                  "Trạng thái",
                  "Ngày tạo",
                  "Hành động",
                ].map((head, idx) => (
                  <TableHead
                    key={idx}
                    className="text-gray-200 font-semibold text-[15px] py-3"
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-10 text-gray-400"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="font-sans text-[15px] text-gray-200 hover:bg-[#4b5563]/50 transition"
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-white">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-purple-300 text-purple-800"
                            : "bg-blue-300 text-blue-800"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.enabled
                            ? "bg-green-300 text-green-800"
                            : "bg-gray-300 text-gray-800"
                        }
                      >
                        {user.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openRoleDialog(user)}
                        className="text-purple-400 hover:text-purple-500 hover:bg-purple-500/10"
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="bg-[#374151] hover:bg-[#4b5563]"
          >
            ← Trước
          </Button>

          <span className="px-4 py-2 text-gray-300">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <Button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="bg-[#374151] hover:bg-[#4b5563]"
          >
            Sau →
          </Button>
        </div>
      )}

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="bg-[#374151] text-gray-100 border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-100">
              Gán Role cho User
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">User</p>
                <p className="text-gray-100 font-medium text-lg">
                  {selectedUser.fullName}
                </p>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Role hiện tại</p>
                <Badge
                  className={
                    selectedUser.role === "ADMIN"
                      ? "bg-purple-300 text-purple-800"
                      : "bg-blue-300 text-blue-800"
                  }
                >
                  {selectedUser.role}
                </Badge>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Chọn Role mới
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-[#2f3640] text-gray-100 border border-white/10 rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setIsRoleDialogOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAssignRole}
                  disabled={!selectedRole || selectedRole === selectedUser.role}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  Gán Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
