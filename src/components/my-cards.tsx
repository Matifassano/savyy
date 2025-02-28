
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for credit cards
const cards = [
  {
    id: 1,
    bank: "Chase",
    name: "Sapphire Preferred",
    type: "Visa Signature",
    number: "**** **** **** 4582",
    expiry: "05/26",
    status: "active",
    color: "bg-gradient-to-r from-blue-600 to-blue-800"
  },
  {
    id: 2,
    bank: "American Express",
    name: "Gold Card",
    type: "American Express",
    number: "**** **** **** 3726",
    expiry: "09/25",
    status: "active",
    color: "bg-gradient-to-r from-amber-500 to-amber-700"
  },
  {
    id: 3,
    bank: "Capital One",
    name: "Venture X",
    type: "Visa Infinite",
    number: "**** **** **** 1029",
    expiry: "11/27",
    status: "inactive",
    color: "bg-gradient-to-r from-slate-600 to-slate-900"
  },
  {
    id: 4,
    bank: "Citibank",
    name: "Double Cash",
    type: "Mastercard",
    number: "**** **** **** 7643",
    expiry: "03/26",
    status: "active",
    color: "bg-gradient-to-r from-cyan-600 to-cyan-800"
  }
];

export const MyCards = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCardExpand = (cardId: number) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.id * 0.1 }}
        >
          <Card 
            className={`cursor-pointer overflow-hidden ${
              expandedCard === card.id ? "col-span-1 md:col-span-2" : ""
            }`}
            onClick={() => toggleCardExpand(card.id)}
          >
            <div className={`${card.color} text-white p-6 relative overflow-hidden`}>
              <div className="absolute top-4 right-4">
                {card.status === "active" ? (
                  <CheckCircle className="h-5 w-5 text-green-300" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-300" />
                )}
              </div>
              <div className="mb-2">
                <p className="text-xs text-white/70">{card.bank}</p>
                <h3 className="text-xl font-semibold">{card.name}</h3>
              </div>
              <div className="mb-6">
                <CreditCard className="h-8 w-8 mb-1" />
                <p className="text-base font-medium tracking-widest">{card.number}</p>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-white/70">Expires</p>
                  <p>{card.expiry}</p>
                </div>
                <div>
                  <p className="text-white/70">Type</p>
                  <p>{card.type}</p>
                </div>
              </div>
            </div>
            
            {expandedCard === card.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold mb-2">Card Details</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-sm font-medium capitalize">{card.status}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-sm text-muted-foreground">Bank</p>
                      <p className="text-sm font-medium">{card.bank}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <p className="text-sm text-muted-foreground">Card Type</p>
                      <p className="text-sm font-medium">{card.type}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Button variant="outline" size="sm">Manage</Button>
                  <Button variant="default" size="sm">View Offers</Button>
                </CardFooter>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="h-full flex flex-col justify-center items-center p-6 border-dashed">
          <div className="text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-lg mb-2">Add a New Card</CardTitle>
            <CardDescription className="mb-4">
              Link a new credit or debit card to get personalized offers
            </CardDescription>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Card
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
