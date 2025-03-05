import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { NotificationsPanel } from "./NotificationsPanel";
import { Notification } from "@/types/dashboard";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  signOut: () => void;
  userNotifications: Notification[];
  isNotificationsLoading: boolean;
  markNotificationAsRead: (notificationId: number) => Promise<void>;
  handleClearAllNotifications: () => Promise<void>;
}

export const Header = ({
  theme,
  toggleTheme,
  signOut,
  userNotifications,
  isNotificationsLoading,
  markNotificationAsRead,
  handleClearAllNotifications
}: HeaderProps) => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4">
        <nav className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              Savy
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-5 w-5" />
                  {userNotifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </Button>
              </SheetTrigger>
              <NotificationsPanel 
                notifications={userNotifications}
                isLoading={isNotificationsLoading}
                onMarkAsRead={markNotificationAsRead}
                onClearAll={handleClearAllNotifications}
              />
            </Sheet>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut} 
              className="hidden sm:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut} 
              className="sm:hidden h-9 w-9"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}; 