
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if there is an active session
 * @returns Promise<boolean> - Whether there is an active session
 */
export const checkActiveSession = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};

/**
 * Sets up visibility change listener to refresh authentication state
 */
export const setupVisibilityChangeListener = () => {
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      console.info("Tab became visible, refreshing session");
      await supabase.auth.refreshSession();
    }
  });
};

/**
 * Removes visibility change listener
 */
export const removeVisibilityChangeListener = () => {
  document.removeEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      await supabase.auth.refreshSession();
    }
  });
};
