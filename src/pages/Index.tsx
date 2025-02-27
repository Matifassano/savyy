
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BadgeCheck, CreditCard, Bell, Moon, Sun } from "lucide-react";
import { Footer } from "./Login";
import { useState, useEffect } from "react";

const Index = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Card Management",
      description: "Add and manage your bank cards securely",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Smart Notifications",
      description: "Get instant alerts for bank promotions",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Verified Promotions",
      description: "Only receive genuine bank offers",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">PromoAlert</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Never Miss a Bank Promotion Again
            </h1>
            <p className="text-xl text-muted-foreground">
              Get instant notifications about bank promotions when shopping online.
              Save money effortlessly.
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() =>
                toast({
                  title: "Coming Soon!",
                  description: "Sign up to get early access.",
                })
              }
            >
              Get Started
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-6 rounded-lg space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
