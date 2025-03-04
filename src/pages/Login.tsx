import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, BadgeCheck, Moon, Sun } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      console.log("Redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">Savy</Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Savy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 py-6"
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-center">Why Savy?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">Manage all your bank cards in one place</p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">Secure, encrypted card information storage</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">Get instant notifications for bank promotions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export const Footer = () => (
  <footer className="border-t py-6 px-4">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
        © {new Date().getFullYear()} Savy. All rights reserved.
      </div>
      <div className="flex gap-6">
        <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
      </div>
    </div>
  </footer>
);

export default Login;
