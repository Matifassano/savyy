import { useState } from "react";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface NotificationsPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (notificationId: number) => Promise<void>;
  onClearAll: () => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
}

export const NotificationsPanel = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onClearAll,
  onMarkAllAsRead
}: NotificationsPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return true;
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Notifications</SheetTitle>
        <SheetDescription>
          Your recent notifications and alerts.
        </SheetDescription>
      </SheetHeader>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {unreadCount} unread
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Mark All Read
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {renderNotificationContent(filteredNotifications, isLoading, onMarkAsRead)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {renderNotificationContent(filteredNotifications, isLoading, onMarkAsRead)}
        </TabsContent>
        
        <TabsContent value="read" className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {renderNotificationContent(filteredNotifications, isLoading, onMarkAsRead)}
        </TabsContent>
      </Tabs>
      
      <SheetFooter className="mt-6 flex-col">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClearAll}
          disabled={notifications.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All Notifications
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

// Helper function to render notification content based on filtered notifications
function renderNotificationContent(
  notifications: Notification[], 
  isLoading: boolean, 
  onMarkAsRead: (id: number) => Promise<void>
) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No notifications</p>
      </div>
    );
  }
  
  return notifications.map(notification => (
    <div 
      key={notification.id} 
      className={`p-4 rounded-lg border ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
      onClick={() => onMarkAsRead(notification.id)}
    >
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
        {new Date(notification.time).toLocaleString()}
      </p>
    </div>
  ));
} 