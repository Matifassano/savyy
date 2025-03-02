
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { promotions, getPromotionsByBank } from "../pages/Dashboard";

export const initialCards = [
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

interface MyCardsProps {
  onCardsChange?: (cards: typeof initialCards) => void;
}

export const MyCards = ({ onCardsChange }: MyCardsProps) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [cards, setCards] = useState(initialCards);
  const [newCard, setNewCard] = useState({
    bank: "",
    name: "",
    type: "",
    number: "",
    expiry: "",
    status: "active"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof initialCards[0] | null>(null);
  const [editedCard, setEditedCard] = useState<typeof initialCards[0] | null>(null);
  const [isOffersDialogOpen, setIsOffersDialogOpen] = useState(false);
  const [cardOffers, setCardOffers] = useState<typeof promotions>([]);

  useEffect(() => {
    if (onCardsChange) {
      onCardsChange(cards);
    }
  }, [cards, onCardsChange]);

  const toggleCardExpand = (cardId: number) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedCard) return;
    
    const { name, value } = e.target;
    setEditedCard(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleStatusToggle = (checked: boolean) => {
    if (!editedCard) return;
    
    setEditedCard(prev => ({
      ...prev!,
      status: checked ? "active" : "inactive"
    }));
  };

  const handleAddCard = () => {
    const colors = [
      "bg-gradient-to-r from-blue-600 to-blue-800",
      "bg-gradient-to-r from-green-600 to-green-800",
      "bg-gradient-to-r from-purple-600 to-purple-800",
      "bg-gradient-to-r from-red-600 to-red-800",
      "bg-gradient-to-r from-amber-500 to-amber-700",
      "bg-gradient-to-r from-cyan-600 to-cyan-800"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    let formattedNumber = newCard.number;
    if (formattedNumber.length >= 4) {
      formattedNumber = `**** **** **** ${formattedNumber.slice(-4)}`;
    }

    const newCardWithId = {
      ...newCard,
      id: cards.length + 1,
      number: formattedNumber,
      color: randomColor
    };
    
    const updatedCards = [...cards, newCardWithId];
    setCards(updatedCards);
    
    if (onCardsChange) {
      onCardsChange(updatedCards);
    }
    
    setNewCard({
      bank: "",
      name: "",
      type: "",
      number: "",
      expiry: "",
      status: "active"
    });
    
    setIsDialogOpen(false);
    
    toast.success("Card added successfully", {
      description: `${newCardWithId.name} has been added to your account.`
    });
  };

  const openManageDialog = (e: React.MouseEvent, card: typeof initialCards[0]) => {
    e.stopPropagation();
    setSelectedCard(card);
    setEditedCard({...card});
    setIsManageDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editedCard) return;

    const updatedCards = cards.map(card => 
      card.id === editedCard.id ? editedCard : card
    );
    
    setCards(updatedCards);
    
    if (onCardsChange) {
      onCardsChange(updatedCards);
    }
    
    setIsManageDialogOpen(false);
    
    toast.success("Card updated successfully", {
      description: `${editedCard.name} has been updated.`
    });
  };

  const handleDeleteCard = () => {
    if (!selectedCard) return;
    
    const updatedCards = cards.filter(card => card.id !== selectedCard.id);
    setCards(updatedCards);
    
    if (onCardsChange) {
      onCardsChange(updatedCards);
    }
    
    setIsManageDialogOpen(false);
    
    toast.success("Card removed", {
      description: `${selectedCard.name} has been removed from your account.`
    });
  };

  const openOffersDialog = (e: React.MouseEvent, card: typeof initialCards[0]) => {
    e.stopPropagation();
    const cardPromotions = getPromotionsByBank(card.bank);
    setCardOffers(cardPromotions);
    setSelectedCard(card);
    setIsOffersDialogOpen(true);
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => openManageDialog(e, card)}
                  >
                    Manage
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={(e) => openOffersDialog(e, card)}
                  >
                    View Offers
                  </Button>
                </CardFooter>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="h-full flex flex-col justify-center items-center p-6 border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a New Card</DialogTitle>
            <DialogDescription>
              Enter your card details below to add a new card to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="bank" className="text-right text-sm font-medium">
                Bank
              </label>
              <Input
                id="bank"
                name="bank"
                value={newCard.bank}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Chase, American Express, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Card Name
              </label>
              <Input
                id="name"
                name="name"
                value={newCard.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Sapphire Preferred, Gold Card, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Card Type
              </label>
              <Input
                id="type"
                name="type"
                value={newCard.type}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Visa, Mastercard, Amex, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="number" className="text-right text-sm font-medium">
                Last 4 Digits
              </label>
              <Input
                id="number"
                name="number"
                value={newCard.number}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="1234"
                maxLength={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiry" className="text-right text-sm font-medium">
                Expiry Date
              </label>
              <Input
                id="expiry"
                name="expiry"
                value={newCard.expiry}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="MM/YY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddCard}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Card</DialogTitle>
            <DialogDescription>
              Update your card details or change its status.
            </DialogDescription>
          </DialogHeader>
          {editedCard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bank" className="text-right">Bank</Label>
                <Input
                  id="edit-bank"
                  name="bank"
                  value={editedCard.bank}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Card Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editedCard.name}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">Card Type</Label>
                <Input
                  id="edit-type"
                  name="type"
                  value={editedCard.type}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiry" className="text-right">Expiry Date</Label>
                <Input
                  id="edit-expiry"
                  name="expiry"
                  value={editedCard.expiry}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Active</Label>
                <div className="col-span-3 flex items-center">
                  <Switch 
                    id="edit-status"
                    checked={editedCard.status === "active"}
                    onCheckedChange={handleStatusToggle}
                  />
                  <span className="ml-2 text-sm capitalize">
                    {editedCard.status}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteCard}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsManageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSaveChanges}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOffersDialogOpen} onOpenChange={setIsOffersDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCard?.bank} Offers
              {selectedCard && <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedCard.name})
              </span>}
            </DialogTitle>
            <DialogDescription>
              Current promotions available for your card
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {cardOffers.length > 0 ? (
              <div className="space-y-4">
                {cardOffers.map((offer) => (
                  <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{offer.title}</CardTitle>
                          <CardDescription className="text-xs">
                            Valid until {new Date(offer.validUntil).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {offer.category}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {offer.description}
                      </p>
                      <div className="flex justify-end mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Link to Promotion
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No offers available</h3>
                <p className="text-sm text-muted-foreground">
                  There are currently no promotions available for this card.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsOffersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
