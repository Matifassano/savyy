
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
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

  return (
    <header className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
      <nav className="flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold text-primary">PromoAlert</div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" className="text-xs sm:text-sm" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
