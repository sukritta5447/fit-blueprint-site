import { useEffect, useMemo, useState } from "react";

import { MemberAuthContext } from "@/contexts/memberAuthContext";
import { supabase } from "@/lib/supabase";
import { apiClient } from "@/services/apiClient";
import { isAdminRole } from "@/services/adminAuthStorage";
import { setAccessToken } from "@/services/authSession";
import { mapSupabaseUser } from "@/services/memberAuthStorage";

export function MemberAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function syncCurrentUser(session) {
      setAccessToken(session?.access_token);

      const mappedUser = mapSupabaseUser(session?.user);

      if (!mappedUser || !isAdminRole(mappedUser.role)) {
        if (isMounted) setCurrentUser(mappedUser);
        return;
      }

      try {
        const { data: profile } = await apiClient.get("/auth/me");

        if (isMounted) {
          setCurrentUser({
            ...mappedUser,
            name: profile.fullName || mappedUser.name,
            username: profile.username || mappedUser.username,
            image: profile.avatarUrl || mappedUser.image,
          });
        }
      } catch (error) {
        console.error("Unable to load current admin profile:", error);
        if (isMounted) setCurrentUser(mappedUser);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      syncCurrentUser(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      syncCurrentUser(session);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ currentUser, isAuthLoading }),
    [currentUser, isAuthLoading],
  );

  return (
    <MemberAuthContext.Provider value={value}>
      {children}
    </MemberAuthContext.Provider>
  );
}
