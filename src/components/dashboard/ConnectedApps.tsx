import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ConnectedApp } from "@/types/dashboard";

interface ConnectedAppsProps {
  apps: ConnectedApp[];
  onToggleConnection: (appId: string) => void;
  onBack: () => void;
}

export const ConnectedApps = ({
  apps,
  onToggleConnection,
  onBack
}: ConnectedAppsProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Connected Apps</h2>
        <Button size="sm" onClick={onBack}>
          Back to Promotions
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map(app => (
          <Card key={app.id} className={app.connected ? "border-primary/50" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {app.icon}
                  <CardTitle>{app.name}</CardTitle>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${app.connected ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}>
                  {app.connected ? "Connected" : "Not Connected"}
                </div>
              </div>
              <CardDescription className="mt-2">{app.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={app.connected ? "outline" : "default"} 
                className="w-full mt-2"
                onClick={() => onToggleConnection(app.id)}
              >
                {app.connected ? "Disconnect" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Add Custom Integration</CardTitle>
            </div>
            <CardDescription className="mt-2">
              Connect with other banking or financial applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter integration API key or URL"
              className="mb-3"
            />
            <Button className="w-full">
              Connect Custom App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 