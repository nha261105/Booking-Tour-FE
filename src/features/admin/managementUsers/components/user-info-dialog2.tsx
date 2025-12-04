import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "../../../../api/admin.api";
import { useUserManagement } from "../hooks/useUserManagement";

interface UserInfoDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (
    id: number,
    status: "ACTIVE" | "INACTIVE" | "BANNED"
  ) => void;
}

export function UserInfoDialog({
  user,
  open,
  onClose,
  onStatusChange,
}: UserInfoDialogProps) {
  const { getUserStats } = useUserManagement();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      setLoading(true);
      getUserStats(user.id).then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [user, open]);

  if (!user) return null;

  const handleStatusChange = (status: "ACTIVE" | "INACTIVE" | "BANNED") => {
    onStatusChange(user.id, status);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#374151] text-gray-100 border border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-100">
            Thông tin chi tiết khách hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">ID</p>
              <p className="text-gray-100 font-medium">{user.id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Username</p>
              <p className="text-gray-100 font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Họ và tên</p>
              <p className="text-gray-100 font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-gray-100 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Số điện thoại</p>
              <p className="text-gray-100 font-medium">
                {user.phoneNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <Badge
                className={
                  user.role === "ADMIN"
                    ? "bg-purple-300 text-purple-800"
                    : "bg-blue-300 text-blue-800"
                }
              >
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Trạng thái</p>
              <Badge
                className={
                  user.status === "ACTIVE"
                    ? "bg-green-300 text-green-800"
                    : user.status === "BANNED"
                    ? "bg-red-300 text-red-800"
                    : "bg-gray-300 text-gray-800"
                }
              >
                {user.status}
              </Badge>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ngày tham gia</p>
              <p className="text-gray-100 font-medium">
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Statistics */}
          {loading ? (
            <div className="text-center py-4 text-gray-400">
              Đang tải thống kê...
            </div>
          ) : stats ? (
            <div className="bg-[#2f3640]/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">
                Thống kê
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Tổng số booking</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {stats.totalBookings}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-gray-100">
                    ${stats.totalSpent?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Booking đang chờ</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.pendingBookings}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Booking hoàn thành</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.completedBookings}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={user.status === "ACTIVE"}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Kích hoạt
            </Button>
            <Button
              onClick={() => handleStatusChange("INACTIVE")}
              disabled={user.status === "INACTIVE"}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
            >
              Vô hiệu hóa
            </Button>
            <Button
              onClick={() => handleStatusChange("BANNED")}
              disabled={user.status === "BANNED"}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Khóa tài khoản
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
