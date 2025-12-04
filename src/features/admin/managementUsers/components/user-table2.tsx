import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "../../../../api/admin.api";
import { UserInfoDialog } from "./user-info-dialog2";

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
  onStatusChange: (
    id: number,
    status: "ACTIVE" | "INACTIVE" | "BANNED"
  ) => void;
}

export function UserTable({ users, onDelete, onStatusChange }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-300 text-green-800 font-medium px-2 py-1 rounded-md">
            Active
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge className="bg-gray-300 text-gray-800 font-medium px-2 py-1 rounded-md">
            Inactive
          </Badge>
        );
      case "BANNED":
        return (
          <Badge className="bg-red-300 text-red-800 font-medium px-2 py-1 rounded-md">
            Banned
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="border border-white/10 shadow-lg shadow-black/40 rounded-lg overflow-hidden mt-10 bg-[#374151] hover:bg-[#3b4252] transition">
        <Table className="w-full">
          {/* Header */}
          <TableHeader className="bg-[#2f3640]/70">
            <TableRow>
              {[
                "Id",
                "Tên khách hàng",
                "Email",
                "SĐT",
                "Role",
                "Lượt đặt",
                "Chi tiêu ($)",
                "Ngày tham gia",
                "Trạng thái",
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

          {/* Body */}
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-10 text-gray-400"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="font-sans text-[15px] text-gray-200 hover:bg-[#4b5563]/50 transition"
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium text-white">
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
                  <TableCell>{user.totalBookings || 0}</TableCell>
                  <TableCell>
                    {user.totalSpent ? user.totalSpent.toLocaleString() : "0"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-400 hover:text-blue-500 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(user.id)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Info Dialog */}
      <UserInfoDialog
        user={selectedUser}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
