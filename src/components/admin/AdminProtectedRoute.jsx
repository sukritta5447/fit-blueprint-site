import { Navigate, useLocation } from "react-router-dom";

import { useMemberAuth } from "@/hooks/useMemberAuth";
import { isAdminRole } from "@/services/adminAuthStorage";

export function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const { currentUser, isAuthLoading } = useMemberAuth();

  if (isAuthLoading) return null;

  if (!currentUser || !isAdminRole(currentUser.role)) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
