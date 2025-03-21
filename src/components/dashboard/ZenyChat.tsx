import { Bot, Info, MessageCircle, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ConnectedApp } from "@/types/dashboard";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import axios from "axios";

interface ZenyChatProps {
  connectedApps: ConnectedApp[];
}

interface Message {
  sender: "user" | "bot";
  content: string;
  isLoading?: boolean;
}

export const ZenyChat = ({ connectedApps }: ZenyChatProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      sender: "bot",
      content: "Hello! I'm Savy, your personal finance assistant. I can help with your finances and answer questions about bank promotions. Try asking me about credit card offers or discounts!"
    }
  ]);

  const handleLearnMore = () => {
    toast({
      title: "About Savy",
      description: "Savy is an AI-powered finance assistant built directly into this app. Ask about your spending habits, budgeting tips, or how to optimize your finances. You can also ask about bank promotions!",
      duration: 6000,
    });
  };

  const getApiBaseUrl = () => {
    // Determinar si estamos en desarrollo o producción
    const isProduction = window.location.hostname !== 'localhost';
    
    if (isProduction) {
      // En producción, usamos la API de Railway
      return 'https://savyy-production-afe9.up.railway.app/api';
    }
    
    // En desarrollo local
    return '/api';
  };

  const queryRagApi = async (question: string): Promise<string> => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await axios.post(`${baseUrl}/rag/query`, { question });
      return response.data.answer;
    } catch (error) {
      console.error('Error querying RAG API:', error);
      return "Sorry, I couldn't process your request at the moment. Please try again later or check if the backend server is running.";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [
      ...prev, 
      { sender: "user", content: message }
    ]);
    
    // Clear input
    setMessage("");
    
    // Add loading message
    setChatHistory(prev => [
      ...prev,
      { sender: "bot", content: "Thinking...", isLoading: true }
    ]);
    
    setIsLoading(true);
    
    try {
      // Query the RAG API
      const answer = await queryRagApi(message);
      
      // Replace loading message with actual response
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Remove the last loading message
        newHistory.pop();
        // Add the actual response
        newHistory.push({ sender: "bot", content: answer });
        return newHistory;
      });
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Replace loading message with error
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Remove the last loading message
        newHistory.pop();
        // Add error message
        newHistory.push({ 
          sender: "bot", 
          content: "Sorry, I encountered an error processing your request. Please check if the backend server is running."
        });
        return newHistory;
      });
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please check if the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Chat with Savy</h2>
        <Button size="sm" variant="outline" onClick={handleLearnMore}>
          <Info className="mr-2 h-4 w-4" />
          About Savy
        </Button>
      </div>
      
      {/* Desktop version */}
      <div className="hidden md:block">
        <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950/40 dark:to-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="col-span-1 flex flex-col justify-center items-center text-center">
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Bot className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Savy</h3>
              <p className="text-sm text-muted-foreground mb-4">Your AI finance assistant built into the app to help analyze your spending and provide personalized advice about promotions and financial products</p>
            </div>
            <div className="col-span-2 bg-white/80 dark:bg-slate-900/80 rounded-lg p-6">
              <h4 className="font-medium mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-500" /> 
                Chat with Savy
              </h4>
              <div className="space-y-4 mb-6 h-64 overflow-y-auto">
                {chatHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`${
                      msg.sender === "bot" 
                        ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg rounded-tl-none" 
                        : "bg-primary/10 rounded-lg rounded-tr-none ml-auto"
                    } p-3 max-w-[80%]`}
                  >
                    <p className="text-sm">
                      {msg.isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-pulse">●</span>
                          <span className="animate-pulse ml-1">●</span>
                          <span className="animate-pulse ml-1">●</span>
                        </span>
                      ) : (
                        msg.content
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex mt-auto">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about promotions or financial advice..." 
                  className="rounded-r-none"
                  disabled={isLoading}
                />
                <Button 
                  className="rounded-l-none" 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <Card className="border border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-slate-100 dark:from-blue-950/40 dark:to-slate-900/60">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <Bot className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Savy</h3>
                <p className="text-xs text-muted-foreground">Your finance assistant</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${
                    msg.sender === "bot" 
                      ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg rounded-tl-none" 
                      : "bg-primary/10 rounded-lg rounded-tr-none ml-auto"
                  } p-2 max-w-[85%]`}
                >
                  <p className="text-sm">
                    {msg.isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse ml-1">●</span>
                        <span className="animate-pulse ml-1">●</span>
                      </span>
                    ) : (
                      msg.content
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <div className="flex w-full">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about promotions or financial advice..." 
                className="rounded-r-none text-sm"
                disabled={isLoading}
              />
              <Button 
                size="sm"
                className="rounded-l-none" 
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
