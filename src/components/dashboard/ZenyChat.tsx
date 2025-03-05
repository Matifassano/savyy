import { Bot, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ConnectedApp } from "@/types/dashboard";

interface ZenyChatProps {
  connectedApps: ConnectedApp[];
}

export const ZenyChat = ({ connectedApps }: ZenyChatProps) => {
  const { toast } = useToast();

  const handleLearnMore = () => {
    toast({
      title: "About Zeny",
      description: "Zeny is a minimalist finance chatbot that helps you manage your personal finances.",
    });
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Connect with Zeny</h2>
        <Button size="sm" variant="outline" onClick={handleLearnMore}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Learn More
        </Button>
      </div>
      
      <div className="hidden md:block">
        <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/40 dark:to-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="col-span-1 flex flex-col justify-center items-center text-center">
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Bot className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Zeny</h3>
              <p className="text-sm text-muted-foreground mb-4">A minimalist finance chatbot to manage your personal finances</p>
              <Button className="w-full">
                {connectedApps[0].connected ? "Disconnect" : "Connect Now"}
              </Button>
            </div>
            <div className="col-span-2 bg-white/80 dark:bg-slate-900/80 rounded-lg p-6">
              <h4 className="font-medium mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-500" /> 
                Chat with Zeny
              </h4>
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">Hello! I'm Zeny, your personal finance assistant. How can I help you today?</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                  <p className="text-sm">Can you help me track my expenses?</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">Of course! To get started with expense tracking, connect your bank accounts or start adding expenses manually.</p>
                </div>
              </div>
              <div className="flex mt-auto">
                <Input 
                  placeholder="Type your message..." 
                  className="rounded-r-none"
                  disabled={!connectedApps[0].connected}
                />
                <Button 
                  className="rounded-l-none" 
                  disabled={!connectedApps[0].connected}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 