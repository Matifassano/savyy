import { Bell, Trash2 } from "lucide-react";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/dashboard";

interface NotificationsPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (notificationId: number) => Promise<void>;
  onClearAll: () => Promise<void>;
}

export const NotificationsPanel = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onClearAll
}: NotificationsPanelProps) => {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Notifications</SheetTitle>
        <SheetDescription>
          Your recent notifications and alerts.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(notification => (
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
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
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