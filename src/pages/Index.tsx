
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BadgeCheck, CreditCard, Bell, Moon, Sun, Check } from "lucide-react";
import { Footer } from "./Login";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = useUser();

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

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Essential features for casual users",
      features: [
        "Add up to 2 cards",
        "Basic notifications",
        "Standard support",
        "Web access only"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "per month",
      description: "Advanced features for active users",
      features: [
        "Add up to 5 cards",
        "Priority notifications",
        "Email & chat support",
        "Mobile app access",
        "Personalized offers"
      ],
      cta: "Go Premium",
      popular: true
    },
    {
      name: "Premium+",
      price: "$9.99",
      period: "per month",
      description: "Ultimate experience for power users",
      features: [
        "Unlimited cards",
        "Instant notifications",
        "24/7 priority support",
        "Mobile app access",
        "Personalized offers",
        "Family accounts",
        "Exclusive promotions"
      ],
      cta: "Go Premium+",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto py-4 px-4 sm:py-6 sm:px-6">
        <nav className="flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-primary">Savy</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            {user ? (
              <Button size="sm" className="text-xs sm:text-sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" className="text-xs sm:text-sm" asChild>
                <Link to="/login">Sign in with Google</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-12 sm:py-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Never Miss a Bank Promotion Again
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Get instant notifications about bank promotions when shopping online.
              Save money effortlessly.
            </p>
            <Button
              size="lg"
              className="mt-6 sm:mt-8"
              asChild
            >
              <Link to="/login">Get Started</Link>
            </Button>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-16 mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how Savy helps you make the most of your banking experience with these powerful features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
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
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your needs. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  {plan.popular && (
                    <div className="bg-primary text-white text-xs font-medium py-1 px-3 rounded-t-md text-center">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={plan.popular ? "default" : "outline"} 
                      className="w-full"
                      onClick={() =>
                        toast({
                          title: "Coming Soon!",
                          description: `${plan.name} plan will be available soon.`,
                        })
                      }
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
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
