
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, Gift, Plus, Tag, Filter, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "./Login";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data for promotions (replace with real data later)
const promotions = [
  {
    id: 1,
    bank: "Chase",
    title: "10% Cashback on Electronics",
    description: "Get 10% cashback on all electronics purchases above $500",
    validUntil: "2024-05-01",
    category: "Cashback",
  },
  {
    id: 2,
    bank: "American Express",
    title: "Double Points on Dining",
    description: "Earn 2x points at restaurants worldwide",
    validUntil: "2024-04-15",
    category: "Points",
  },
  {
    id: 3,
    bank: "Capital One",
    title: "Travel Insurance Bonus",
    description: "Free travel insurance on flights booked with your card",
    validUntil: "2024-06-30",
    category: "Travel",
  },
  {
    id: 4,
    bank: "Citibank",
    title: "5% Cash Back on Groceries",
    description: "Earn 5% cash back on grocery store purchases up to $500 monthly",
    validUntil: "2024-07-15",
    category: "Cashback",
  },
  {
    id: 5,
    bank: "Discover",
    title: "3x Points on Gas",
    description: "Triple points on all gas station purchases",
    validUntil: "2024-05-30",
    category: "Points",
  },
];

// Mock data for notifications
const notifications = [
  {
    id: 1,
    title: "New Chase Promotion",
    description: "Chase has added a new cashback offer for electronics",
    time: "10 minutes ago",
    read: false
  },
  {
    id: 2,
    title: "Promotion Expiring Soon",
    description: "American Express dining points promotion expires in 2 days",
    time: "2 hours ago",
    read: true
  },
  {
    id: 3,
    title: "Card Added Successfully",
    description: "Your Capital One Venture card has been added to your account",
    time: "Yesterday",
    read: true
  },
  {
    id: 4,
    title: "Limited Time Offer",
    description: "Citibank is offering 5% cashback on all purchases this weekend",
    time: "2 days ago",
    read: true
  }
];

// Get unique categories from promotions
const categories = ["All", ...new Set(promotions.map(promo => promo.category))];

const Dashboard = () => {
  const [filter, setFilter] = useState("All");
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
  
  // Filter promotions based on selected category
  const filteredPromotions = filter === "All" 
    ? promotions 
    : promotions.filter(promo => promo.category === filter);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-3 px-4 sm:py-4 sm:px-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-primary">
                PromoAlert
              </Link>
              <div className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/cards" className="text-sm font-medium">
                  My Cards
                </Link>
                <Link to="/notifications" className="text-sm font-medium">
                  Notifications
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                      Your recent notifications and alerts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          !notification.read ? "bg-primary/5 border-primary/20" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">
              Here are your current promotions
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
                  <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {filter} Promotions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
              <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add New Card
            </Button>
          </div>
        </div>

        <div className="relative py-4 sm:py-6">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 sm:-ml-4">
              {filteredPromotions.map((promo) => (
                <CarouselItem key={promo.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <Card className="h-full">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base sm:text-lg">{promo.title}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">{promo.bank}</CardDescription>
                          </div>
                          {promo.category === "Cashback" ? (
                            <Tag className="h-4 w-4 text-green-500" />
                          ) : promo.category === "Points" ? (
                            <Gift className="h-4 w-4 text-purple-500" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {promo.description}
                        </p>
                        <div className="mt-4 text-xs text-muted-foreground">
                          Valid until {new Date(promo.validUntil).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </div>
            <div className="flex justify-center mt-4 sm:hidden">
              <Button variant="outline" size="sm" className="mx-1" onClick={() => document.querySelector('.carousel-prev')?.click()}>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="mx-1" onClick={() => document.querySelector('.carousel-next')?.click()}>
                Next
              </Button>
            </div>
          </Carousel>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
