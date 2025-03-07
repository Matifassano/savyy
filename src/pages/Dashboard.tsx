import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Footer } from "./Login";
import { useNavigate } from "react-router-dom";
import { 
  Header, 
  WelcomeHeader, 
  PromotionCarousel, 
  ZenyChat,
  ConnectedApps
} from "@/components/dashboard";
import { Notification, FilterType, ConnectedApp, Promotion } from "@/types/dashboard";
import { getAvailableBanksFromCards, getBankId } from "@/utils/promotions";

// promotions data 
import { promotions } from "@/data/promotions";

// Constants moved from Dashboard to separate constants
const uniqueCategories = Array.from(new Set(promotions.map(promo => promo.category)));
const categories = ["All Categories", ...uniqueCategories];

const uniqueBanks = Array.from(new Set(promotions.map(promo => promo.bank)));
const banks = ["All Banks", ...uniqueBanks];

const cardTypes = ["All Cards", "Credit Cards", "Debit Cards"];
const promotionTypes = ["All Promotions", "New This Week", "Limited Time", "Exclusive"];

const initialConnectedApps: ConnectedApp[] = [
  { 
    id: 'savy',
    name: 'Savy',
    icon: <Bot className="h-8 w-8 text-blue-500" />,
    connected: false,
    description: 'A minimalist finance chatbot to manage your personal finances'
  }
];

const Dashboard = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterType>({
    category: "All Categories",
    bank: "All Banks",
    promotionType: "All Promotions",
    cardType: "All Cards"
  });
  const [activeFilter, setActiveFilter] = useState<keyof FilterType>("category");
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
      loadUserCards();
    }).catch(error => {
      console.error("Error importing my-cards:", error);
    });
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const loadUserCards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user', user.id);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const banks = getAvailableBanksFromCards(data);
        setAvailableBanks(banks);
      }
    } catch (error) {
      console.error("Error loading user cards:", error);
      toast({
        title: "Error",
        description: "Could not load your cards",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (showOnlyCompatible && availableBanks.length === 0) {
      toast({
        title: "No cards available",
        description: "Add some cards first to filter compatible promotions",
        duration: 3000,
      });
      setShowOnlyCompatible(false);
    }
  }, [showOnlyCompatible, availableBanks, toast]);

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

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    
    try {
      const unreadNotifications = userNotifications.filter(notification => !notification.read);
      
      if (unreadNotifications.length === 0) {
        return; // No unread notifications
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .is('read', false);
      
      if (error) {
        throw error;
      }
      
      setUserNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast({
        title: "Success",
        description: `${unreadNotifications.length} notifications marked as read`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const filteredPromotions = promotions.filter((promo: Promotion) => {
    if (showOnlyCompatible && !availableBanks.includes(promo.bank)) {
      return false;
    }
    
    if (filters.category !== "All Categories" && promo.category !== filters.category) {
      return false;
    }
    
    if (filters.bank !== "All Banks" && promo.bank !== filters.bank) {
      return false;
    }
    
    if (filters.promotionType !== "All Promotions") {
      switch (filters.promotionType) {
        case "New This Week":
          if (!promo.isNew) return false;
          break;
        case "Limited Time":
          if (!promo.isLimitedTime) return false;
          break;
        case "Exclusive":
          if (!promo.isExclusive) return false;
          break;
      }
    }
    
    if (filters.cardType === "Credit Cards" && promo.cardType !== "credit") {
      return false;
    } else if (filters.cardType === "Debit Cards" && promo.cardType !== "debit") {
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
        return activeFilterValue;
      case "bank":
        return activeFilterValue;
      case "promotionType":
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
      category: "All Categories",
      bank: "All Banks",
      promotionType: "All Promotions",
      cardType: "All Cards"
    });
    setShowOnlyCompatible(false);
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
        markAllNotificationsAsRead={markAllNotificationsAsRead}
      />

      <main className="flex-1 container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        {showConnectedApps ? (
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
              promotionTypes={promotionTypes}
              cardTypes={cardTypes}
              setActiveFilter={setActiveFilter}
              handleFilterChange={handleFilterChange}
              setShowOnlyCompatible={setShowOnlyCompatible}
              getFilterDisplayText={getFilterDisplayText}
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
