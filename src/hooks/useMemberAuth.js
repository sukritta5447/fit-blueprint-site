import { useContext } from "react";

import { MemberAuthContext } from "@/contexts/memberAuthContext";

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);

  if (!context) {
    throw new Error("useMemberAuth must be used within MemberAuthProvider");
  }

  return context;
}
