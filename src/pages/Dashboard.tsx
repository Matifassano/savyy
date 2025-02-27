
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, Gift, Plus, Tag, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "./Login";
import { useState } from "react";
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

// Get unique categories from promotions
const categories = ["All", ...new Set(promotions.map(promo => promo.category))];

const Dashboard = () => {
  const [filter, setFilter] = useState("All");
  
  // Filter promotions based on selected category
  const filteredPromotions = filter === "All" 
    ? promotions 
    : promotions.filter(promo => promo.category === filter);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-primary">
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
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">
              Here are your current promotions
            </p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </div>
        </div>

        <div className="relative py-6">
          <Carousel className="w-full">
            <CarouselContent className="px-4">
              {filteredPromotions.map((promo) => (
                <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle>{promo.title}</CardTitle>
                            <CardDescription>{promo.bank}</CardDescription>
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
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
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
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
