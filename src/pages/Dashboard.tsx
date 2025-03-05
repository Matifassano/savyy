import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Footer } from "./Login";
import { 
  Header, 
  WelcomeHeader, 
  PromotionCarousel, 
  ZenyChat,
  ConnectedApps,
  MyCardsSection
} from "@/components/dashboard";
import { Notification, FilterType, ConnectedApp, Promotion } from "@/types/dashboard";
import { getAvailableBanksFromCards, getBankId } from "@/utils/promotions";
import { useNavigate } from "react-router-dom";

// promotions data 
import { promotions } from "@/data/promotions";

// Constants moved from Dashboard to separate constants
const uniqueCategories = Array.from(new Set(promotions.map(promo => promo.category)));
const categories = ["All", ...uniqueCategories];

const uniqueBanks = Array.from(new Set(promotions.map(promo => promo.bank)));
const banks = ["All Banks", ...uniqueBanks];

const cardTypes = ["All Cards", "Credit", "Debit"];
const ageOptions = ["All Promotions", "New", "Existing"];

const initialConnectedApps: ConnectedApp[] = [
  { 
    id: 'savy',
    name: 'Zeny',
    icon: <Bot className="h-8 w-8 text-blue-500" />,
    connected: false,
    description: 'A minimalist finance chatbot to manage your personal finances'
  }
];

const Dashboard = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterType>({
    category: "All",
    bank: "All Banks",
    age: "All Promotions",
    cardType: "All Cards"
  });
  const [activeFilter, setActiveFilter] = useState<keyof FilterType>("category");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showCards, setShowCards] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<string[]>([]);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(true);
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [connectedAppsList, setConnectedAppsList] = useState(initialConnectedApps);
  const [showConnectedApps, setShowConnectedApps] = useState(false);
  const { toast } = useToast();
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    
    import("@/components/my-cards").then((module) => {
      const banks = getAvailableBanksFromCards([]);
      setAvailableBanks(banks);
    }).catch(error => {
      console.error("Error importing my-cards:", error);
    });
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsNotificationsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setUserNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Could not load notifications.",
        variant: "destructive"
      });
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleClearAllNotifications = async () => {
    if (!user || userNotifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUserNotifications([]);
      toast({
        title: "Success",
        description: "All notifications have been cleared",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUserNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const filteredPromotions = promotions.filter((promo: Promotion) => {
    if (showOnlyCompatible && availableBanks.length > 0 && !availableBanks.includes(promo.bank)) {
      return false;
    }
    
    if (filters.category !== "All" && promo.category !== filters.category) {
      return false;
    }
    
    if (filters.bank !== "All Banks" && promo.bank !== filters.bank) {
      return false;
    }
    
    if (filters.age === "New" && !promo.isNew) {
      return false;
    } else if (filters.age === "Existing" && promo.isNew) {
      return false;
    }
    
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

  const toggleAppConnection = (appId: string) => {
    const updatedApps = connectedAppsList.map(app => 
      app.id === appId ? { ...app, connected: !app.connected } : app
    );
    setConnectedAppsList(updatedApps);
    
    const app = connectedAppsList.find(a => a.id === appId);
    if (app) {
      toast({
        title: app.connected ? "Disconnected" : "Connected",
        description: `${app.name} has been ${app.connected ? "disconnected" : "connected"} successfully`,
        duration: 5000,
      });
    }
  };

  const resetFilters = () => {
                    setFilters({
                      category: "All",
                      bank: "All Banks",
                      age: "All Promotions",
                      cardType: "All Cards"
                    });
                    setShowOnlyCompatible(false);
  };

  const handleCardsChange = (cards: any[]) => {
    const banks = getAvailableBanksFromCards(cards);
    setAvailableBanks(banks);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        signOut={handleLogout}
        userNotifications={userNotifications}
        isNotificationsLoading={isNotificationsLoading}
        markNotificationAsRead={markNotificationAsRead}
        handleClearAllNotifications={handleClearAllNotifications}
      />

      <main className="flex-1 container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        {showCards ? (
          <MyCardsSection 
            onBack={() => setShowCards(false)}
            onCardsChange={handleCardsChange}
          />
        ) : showConnectedApps ? (
          <ConnectedApps 
            apps={connectedAppsList}
            onToggleConnection={toggleAppConnection}
            onBack={() => setShowConnectedApps(false)}
          />
        ) : (
          <>
            <WelcomeHeader
              filters={filters}
              activeFilter={activeFilter}
              showOnlyCompatible={showOnlyCompatible}
              categories={categories}
              banks={banks}
              ageOptions={ageOptions}
              cardTypes={cardTypes}
              setActiveFilter={setActiveFilter}
              handleFilterChange={handleFilterChange}
              setShowOnlyCompatible={setShowOnlyCompatible}
              getFilterDisplayText={getFilterDisplayText}
              setShowCards={setShowCards}
            />

            <div className="relative py-4 sm:py-6">
              <PromotionCarousel 
                promotions={filteredPromotions}
                resetFilters={resetFilters}
              />
              </div>
              
            <ZenyChat connectedApps={connectedAppsList} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
