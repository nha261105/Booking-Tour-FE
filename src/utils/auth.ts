// Decode JWT token để lấy thông tin user
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Kiểm tra xem user có role ADMIN không
export function isAdmin(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.log("🔐 No access token found");
    return false;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    console.log("🔐 Failed to decode token");
    return false;
  }

  console.log("🔐 Decoded token:", decoded);

  // JWT thường có role trong field 'role', 'roles', hoặc 'authorities'
  const role = decoded.role || decoded.roles || decoded.authorities;

  console.log("🔐 User role:", role);

  if (Array.isArray(role)) {
    const isAdminUser = role.some((r) => r === "ADMIN" || r === "ROLE_ADMIN");
    console.log("🔐 Is Admin (array):", isAdminUser);
    return isAdminUser;
  }

  const isAdminUser = role === "ADMIN" || role === "ROLE_ADMIN";
  console.log("🔐 Is Admin (string):", isAdminUser);
  return isAdminUser;
}

// Lấy thông tin user từ token
export function getUserFromToken(): any {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded;
}

// Kiểm tra token có hết hạn không
export function isTokenExpired(): boolean {
  const token = localStorage.getItem("accessToken");
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}
