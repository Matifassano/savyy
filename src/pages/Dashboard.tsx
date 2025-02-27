
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, Gift, Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "./Login";

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
];

const Dashboard = () => {
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
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Card
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
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
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
