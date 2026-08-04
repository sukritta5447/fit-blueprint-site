import { Navigate, useLocation } from "react-router-dom";

import { useMemberAuth } from "@/hooks/useMemberAuth";

export function MemberProtectedRoute({ children }) {
  const location = useLocation();
  const { currentUser, isAuthLoading } = useMemberAuth();

  if (isAuthLoading) return null;

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}
