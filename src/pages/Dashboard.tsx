
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard, Gift, Plus, Tag, Filter, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "./Login";
import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MyCards } from "@/components/my-cards";

// Updated promotions to include a bank_id, isNew flag, and cardType fields
const promotions = [{
  id: 1,
  bank: "Chase",
  bank_id: "chase",
  title: "10% Cashback on Electronics",
  description: "Get 10% cashback on all electronics purchases above $500",
  validUntil: "2024-05-01",
  category: "Cashback",
  isNew: true,
  cardType: "credit"
}, {
  id: 2,
  bank: "American Express",
  bank_id: "american_express",
  title: "Double Points on Dining",
  description: "Earn 2x points at restaurants worldwide",
  validUntil: "2024-04-15",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 3,
  bank: "Capital One",
  bank_id: "capital_one",
  title: "Travel Insurance Bonus",
  description: "Free travel insurance on flights booked with your card",
  validUntil: "2024-06-30",
  category: "Travel",
  isNew: true,
  cardType: "credit"
}, {
  id: 4,
  bank: "Citibank",
  bank_id: "citibank",
  title: "5% Cash Back on Groceries",
  description: "Earn 5% cash back on grocery store purchases up to $500 monthly",
  validUntil: "2024-07-15",
  category: "Cashback",
  isNew: false,
  cardType: "credit"
}, {
  id: 5,
  bank: "Discover",
  bank_id: "discover",
  title: "3x Points on Gas",
  description: "Triple points on all gas station purchases",
  validUntil: "2024-05-30",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 6,
  bank: "Bank of America",
  bank_id: "bank_of_america",
  title: "Online Shopping Rewards",
  description: "Earn 3% cash back on all online purchases",
  validUntil: "2024-08-15",
  category: "Cashback",
  isNew: true,
  cardType: "debit"
}, {
  id: 7, 
  bank: "Wells Fargo",
  bank_id: "wells_fargo",
  title: "Mobile Wallet Bonus",
  description: "Get $5 back for every $100 spent using mobile wallet payments",
  validUntil: "2024-07-01",
  category: "Cashback",
  isNew: true,
  cardType: "debit"
}, {
  id: 8,
  bank: "Chase",
  bank_id: "chase",
  title: "Streaming Services Reward",
  description: "5x points on streaming service subscriptions",
  validUntil: "2024-06-15",
  category: "Points",
  isNew: false,
  cardType: "credit"
}, {
  id: 9,
  bank: "American Express",
  bank_id: "american_express",
  title: "Hotel Collection Credit",
  description: "$100 credit for eligible hotel stays of 2+ nights",
  validUntil: "2024-09-30",
  category: "Travel",
  isNew: true,
  cardType: "credit"
}, {
  id: 10,
  bank: "Discover",
  bank_id: "discover",
  title: "Debit Card Rewards",
  description: "1% cash back on all debit card purchases",
  validUntil: "2024-08-31",
  category: "Cashback",
  isNew: false,
  cardType: "debit"
}];

// Helper function to get bank_id from bank name
export const getBankId = (bankName: string): string => {
  return bankName.toLowerCase().replace(/\s+/g, '_');
};

// Function to get promotions by bank name
export const getPromotionsByBank = (bankName: string) => {
  const bankId = getBankId(bankName);
  return promotions.filter(promo => promo.bank_id === bankId);
};

// Export promotions for use in other components
export { promotions };

// Create arrays for filter options
const uniqueCategories = Array.from(new Set(promotions.map(promo => promo.category)));
const categories = ["All", ...uniqueCategories];

const uniqueBanks = Array.from(new Set(promotions.map(promo => promo.bank)));
const banks = ["All Banks", ...uniqueBanks];

const cardTypes = ["All Cards", "Credit", "Debit"];
const ageOptions = ["All Promotions", "New", "Existing"];

const notifications = [{
  id: 1,
  title: "New Chase Promotion",
  description: "Chase has added a new cashback offer for electronics",
  time: "10 minutes ago",
  read: false
}, {
  id: 2,
  title: "Promotion Expiring Soon",
  description: "American Express dining points promotion expires in 2 days",
  time: "2 hours ago",
  read: true
}, {
  id: 3,
  title: "Card Added Successfully",
  description: "Your Capital One Venture card has been added to your account",
  time: "Yesterday",
  read: true
}, {
  id: 4,
  title: "Limited Time Offer",
  description: "Citibank is offering 5% cashback on all purchases this weekend",
  time: "2 days ago",
  read: true
}];

type FilterType = {
  category: string;
  bank: string;
  age: string;
  cardType: string;
};

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterType>({
    category: "All",
    bank: "All Banks",
    age: "All Promotions",
    cardType: "All Cards"
  });
  const [activeFilter, setActiveFilter] = useState<keyof FilterType>("category");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showCards, setShowCards] = useState(false);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

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

  // Updated filter function to handle multiple filter criteria
  const filteredPromotions = promotions.filter(promo => {
    // Filter by category
    if (filters.category !== "All" && promo.category !== filters.category) {
      return false;
    }
    
    // Filter by bank
    if (filters.bank !== "All Banks" && promo.bank !== filters.bank) {
      return false;
    }
    
    // Filter by age (new/existing)
    if (filters.age === "New" && !promo.isNew) {
      return false;
    } else if (filters.age === "Existing" && promo.isNew) {
      return false;
    }
    
    // Filter by card type (credit/debit)
    if (filters.cardType === "Credit" && promo.cardType !== "credit") {
      return false;
    } else if (filters.cardType === "Debit" && promo.cardType !== "debit") {
      return false;
    }
    
    return true;
  });

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getFilterDisplayText = () => {
    const activeFilterValue = filters[activeFilter];
    switch(activeFilter) {
      case "category":
        return `${activeFilterValue} Promotions`;
      case "bank":
        return activeFilterValue;
      case "age":
        return activeFilterValue;
      case "cardType":
        return activeFilterValue;
      default:
        return "All Promotions";
    }
  };

  const handlePrevious = () => {
    if (prevBtnRef.current) {
      prevBtnRef.current.click();
    }
  };

  const handleNext = () => {
    if (nextBtnRef.current) {
      nextBtnRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <nav className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-2xl font-bold text-primary">
                PromoAlert
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium p-0 h-auto hover:text-primary transition-colors" 
                  onClick={() => setShowCards(!showCards)}
                >
                  My Cards
                </Button>
                <Link to="/notifications" className="text-sm font-medium hover:text-primary transition-colors">
                  Notifications
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bell className="h-5 w-5" />
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
                    {notifications.map(notification => <div key={notification.id} className={`p-4 rounded-lg border ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}>
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>)}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        {showCards ? <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Cards</h2>
              <Button size="sm" onClick={() => setShowCards(false)}>
                Back to Promotions
              </Button>
            </div>
            <MyCards />
          </div> : <>
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
                      {getFilterDisplayText()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2">
                      <div className="mb-2 font-medium text-xs uppercase text-muted-foreground">Filter Type</div>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        <Button 
                          variant={activeFilter === "category" ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setActiveFilter("category")}
                          className="text-xs"
                        >
                          Category
                        </Button>
                        <Button 
                          variant={activeFilter === "bank" ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setActiveFilter("bank")}
                          className="text-xs"
                        >
                          Bank
                        </Button>
                        <Button 
                          variant={activeFilter === "age" ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setActiveFilter("age")}
                          className="text-xs"
                        >
                          Age
                        </Button>
                        <Button 
                          variant={activeFilter === "cardType" ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setActiveFilter("cardType")}
                          className="text-xs"
                        >
                          Card Type
                        </Button>
                      </div>
                      
                      <div className="mb-2 font-medium text-xs uppercase text-muted-foreground">
                        {activeFilter === "category" ? "Categories" : 
                         activeFilter === "bank" ? "Banks" : 
                         activeFilter === "age" ? "Age" : "Card Types"}
                      </div>
                      
                      {activeFilter === "category" && categories.map(category => (
                        <DropdownMenuItem 
                          key={category} 
                          onClick={() => handleFilterChange("category", category)}
                          className={filters.category === category ? "bg-primary/10 text-primary" : ""}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                      
                      {activeFilter === "bank" && banks.map(bank => (
                        <DropdownMenuItem 
                          key={bank} 
                          onClick={() => handleFilterChange("bank", bank)}
                          className={filters.bank === bank ? "bg-primary/10 text-primary" : ""}
                        >
                          {bank}
                        </DropdownMenuItem>
                      ))}
                      
                      {activeFilter === "age" && ageOptions.map(option => (
                        <DropdownMenuItem 
                          key={option} 
                          onClick={() => handleFilterChange("age", option)}
                          className={filters.age === option ? "bg-primary/10 text-primary" : ""}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                      
                      {activeFilter === "cardType" && cardTypes.map(type => (
                        <DropdownMenuItem 
                          key={type} 
                          onClick={() => handleFilterChange("cardType", type)}
                          className={filters.cardType === type ? "bg-primary/10 text-primary" : ""}
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto" onClick={() => setShowCards(true)}>
                  <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> My Cards
                </Button>
              </div>
            </div>

            <div className="relative py-4 sm:py-6">
              {filteredPromotions.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 sm:-ml-4">
                    {filteredPromotions.map(promo => <CarouselItem key={promo.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                        <motion.div initial={{
                    opacity: 0,
                    y: 20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    duration: 0.4
                  }} className="h-full">
                          <Card className="h-full">
                            <CardHeader className="p-4 sm:p-6">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <CardTitle className="text-base sm:text-lg">{promo.title}</CardTitle>
                                  <CardDescription className="text-xs sm:text-sm">
                                    {promo.bank} 
                                    {promo.isNew && <span className="ml-2 inline-block px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-[10px] rounded-full">New</span>}
                                    <span className="ml-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-[10px] rounded-full capitalize">{promo.cardType}</span>
                                  </CardDescription>
                                </div>
                                {promo.category === "Cashback" ? <Tag className="h-4 w-4 text-green-500" /> : promo.category === "Points" ? <Gift className="h-4 w-4 text-purple-500" /> : <CreditCard className="h-4 w-4 text-blue-500" />}
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
                      </CarouselItem>)}
                  </CarouselContent>
                  <div className="hidden sm:block">
                    <CarouselPrevious ref={prevBtnRef} className="left-0" />
                    <CarouselNext ref={nextBtnRef} className="right-0" />
                  </div>
                  <div className="flex justify-center mt-4 sm:hidden">
                    <Button variant="outline" size="sm" className="mx-1" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="mx-1" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </Carousel>
              ) : (
                <div className="text-center py-12 bg-accent/20 rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No matching promotions</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={() => setFilters({
                    category: "All",
                    bank: "All Banks",
                    age: "All Promotions",
                    cardType: "All Cards"
                  })}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </>}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
