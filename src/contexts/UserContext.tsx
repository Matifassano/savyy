import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const cachedSession = localStorage.getItem('supabase.session');
    if (cachedSession) {
      const parsedSession = JSON.parse(cachedSession);
      setSession(parsedSession);
      setUser(parsedSession.user);
    }

    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        localStorage.setItem('supabase.session', JSON.stringify(data.session));
      } else if (error) {
        toast({
          title: "Authentication Error",
          description: "There was a problem connecting to your account.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    getInitialSession();

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          localStorage.setItem('supabase.session', JSON.stringify(data.session));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession) {
          localStorage.setItem('supabase.session', JSON.stringify(currentSession));
        } else {
          localStorage.removeItem('supabase.session');
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast]);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.session');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    signOut,
  }), [user, session, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
