import { useEffect, useMemo, useState } from "react";

import { MemberAuthContext } from "@/contexts/memberAuthContext";
import { supabase } from "@/lib/supabase";
import { syncCurrentAdminFromUser } from "@/services/adminAuthStorage";
import { mapSupabaseUser } from "@/services/memberAuthStorage";

export function MemberAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      syncCurrentAdminFromUser(session?.user);
      setCurrentUser(mapSupabaseUser(session?.user));
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      syncCurrentAdminFromUser(session?.user);
      setCurrentUser(mapSupabaseUser(session?.user));
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
