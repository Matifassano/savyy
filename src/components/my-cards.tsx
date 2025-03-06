import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// Type for card from Supabase
interface CardType {
  id: number;
  bank: string;
  payment_network: string;
  card_type: string;
  last_digits: number;
  expiration_date: string;
  status: string;
  color: string;
  user: string;
}

// Type for promotion from Supabase
interface Promotion {
  id: number;
  title: string;
  description: string;
  bank: string;
  category: string;
  expiration_date: string;
  link_promotion: string;
}

interface MyCardsProps {
  onCardsChange?: (cards: CardType[]) => void;
}

export const MyCards = ({ onCardsChange }: MyCardsProps) => {
  const { user } = useUser();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCard, setNewCard] = useState({
    bank: "",
    payment_network: "",
    card_type: "",
    last_digits: "",
    expiration_date: "",
    status: "active"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [editedCard, setEditedCard] = useState<CardType | null>(null);
  const [isOffersDialogOpen, setIsOffersDialogOpen] = useState(false);
  const [cardOffers, setCardOffers] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cards from Supabase when component mounts
  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user', user.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Format data to match component's expected structure
        const formattedCards = data.map(card => ({
          ...card,
          id: card.id,
          bank: card.bank || "",
          payment_network: card.payment_network || "",
          card_type: card.card_type || "",
          expiration_date: card.expiration_date || "",
          last_digits: card.last_digits || 0,
          status: card.status || "active",
          color: card.color || generateRandomColor()
        }));
        
        setCards(formattedCards);
        
        if (onCardsChange) {
          onCardsChange(formattedCards);
        }
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Failed to load cards");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomColor = () => {
    const colors = [
      "bg-gradient-to-r from-blue-600 to-blue-800",
      "bg-gradient-to-r from-green-600 to-green-800",
      "bg-gradient-to-r from-purple-600 to-purple-800",
      "bg-gradient-to-r from-red-600 to-red-800",
      "bg-gradient-to-r from-amber-500 to-amber-700",
      "bg-gradient-to-r from-cyan-600 to-cyan-800"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggleCardExpand = (cardId: number) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'expiration_date') {
      // Remove any non-digit characters except '/'
      const cleanedValue = value.replace(/[^\d/]/g, '');
      
      // If the value is longer than 2 digits and doesn't have a slash, add it
      if (cleanedValue.length > 2 && !cleanedValue.includes('/')) {
        const formattedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
        setNewCard(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      } else {
        setNewCard(prev => ({
          ...prev,
          [name]: cleanedValue
        }));
      }
    } else {
      setNewCard(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedCard) return;
    
    const { name, value } = e.target;
    
    if (name === 'expiration_date') {
      // Remove any non-digit characters except '/'
      const cleanedValue = value.replace(/[^\d/]/g, '');
      
      // If the value is longer than 2 digits and doesn't have a slash, add it
      if (cleanedValue.length > 2 && !cleanedValue.includes('/')) {
        const formattedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
        setEditedCard(prev => ({
          ...prev!,
          [name]: formattedValue
        }));
      } else {
        setEditedCard(prev => ({
          ...prev!,
          [name]: cleanedValue
        }));
      }
    } else {
      setEditedCard(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleStatusToggle = (checked: boolean) => {
    if (!editedCard) return;
    
    setEditedCard(prev => ({
      ...prev!,
      status: checked ? "active" : "inactive"
    }));
  };

  const validateForm = (card: typeof newCard | CardType) => {
    const newErrors: Record<string, string> = {};
    
    if (!card.bank) {
      newErrors.bank = "Bank is required";
    }
    
    if (!card.payment_network) {
      newErrors.payment_network = "Payment network is required";
    }
    
    if (!card.card_type) {
      newErrors.card_type = "Card type is required";
    }
    
    if (!card.last_digits) {
      newErrors.last_digits = "Last 4 digits are required";
    } else if (!/^\d{4}$/.test(card.last_digits.toString())) {
      newErrors.last_digits = "Last 4 digits must be numbers";
    }
    
    if (!card.expiration_date) {
      newErrors.expiration_date = "Expiration date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(card.expiration_date)) {
      newErrors.expiration_date = "Invalid format. Use MM/YY";
    } else {
      // Validate the date
      const [month, year] = card.expiration_date.split('/');
      const expMonth = parseInt(month);
      const expYear = parseInt('20' + year); // Convert YY to YYYY
      
      // Create date objects
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      // Create expiration date
      const expirationDate = new Date(expYear, expMonth - 1);
      const maxDate = new Date(currentYear + 10, currentMonth - 1);
      
      // Validate month is between 1 and 12
      if (expMonth < 1 || expMonth > 12) {
        newErrors.expiration_date = "Month must be between 01 and 12";
      }
      // Validate year is not in the past
      else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiration_date = "Card has expired";
      }
      // Validate year is not more than 10 years in the future
      else if (expirationDate > maxDate) {
        newErrors.expiration_date = "Expiration date cannot be more than 10 years in the future";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!user) {
      toast.error("You must be logged in to add a card");
      return;
    }
    
    if (!validateForm(newCard)) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    const randomColor = generateRandomColor();
    
    const cardData = {
      bank: newCard.bank,
      payment_network: newCard.payment_network,
      card_type: newCard.card_type,
      last_digits: parseInt(newCard.last_digits),
      expiration_date: newCard.expiration_date,
      status: newCard.status,
      color: randomColor,
      user: user.id
    };
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert(cardData)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newCardWithId = data[0] as CardType;
        
        const updatedCards = [...cards, newCardWithId];
        setCards(updatedCards);
        
        if (onCardsChange) {
          onCardsChange(updatedCards);
        }
        
        setNewCard({
          bank: "",
          payment_network: "",
          card_type: "",
          last_digits: "",
          expiration_date: "",
          status: "active"
        });
        setErrors({});
        
        setIsDialogOpen(false);
        
        toast.success("Card added successfully", {
          description: `${newCardWithId.payment_network} has been added to your account.`
        });
        
        await createNotification(`Card Added Successfully`, `Your ${newCardWithId.payment_network} has been added to your account.`);
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    }
  };

  const openManageDialog = (e: React.MouseEvent, card: CardType) => {
    e.stopPropagation();
    setSelectedCard(card);
    setEditedCard({...card});
    setIsManageDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!editedCard || !user) return;

    if (!validateForm(editedCard)) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const { error } = await supabase
        .from('cards')
        .update({
          bank: editedCard.bank,
          payment_network: editedCard.payment_network,
          card_type: editedCard.card_type,
          last_digits: typeof editedCard.last_digits === 'string' ? parseInt(editedCard.last_digits) : editedCard.last_digits,
          expiration_date: editedCard.expiration_date,
          status: editedCard.status,
        })
        .eq('id', editedCard.id)
        .eq('user', user.id);
      
      if (error) {
        throw error;
      }
      
      const updatedCards = cards.map(card => 
        card.id === editedCard.id ? editedCard : card
      );
      
      setCards(updatedCards);
      
      if (onCardsChange) {
        onCardsChange(updatedCards);
      }
      
      setIsManageDialogOpen(false);
      setErrors({});
      
      toast.success("Card updated successfully", {
        description: `${editedCard.payment_network} has been updated.`
      });
      
      await createNotification(`Card Updated`, `Your ${editedCard.payment_network} has been updated.`);
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard || !user) return;
    
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', selectedCard.id)
        .eq('user', user.id);
      
      if (error) {
        throw error;
      }
      
      const updatedCards = cards.filter(card => card.id !== selectedCard.id);
      setCards(updatedCards);
      
      if (onCardsChange) {
        onCardsChange(updatedCards);
      }
      
      setIsManageDialogOpen(false);
      
      toast.success("Card removed", {
        description: `${selectedCard.payment_network} has been removed from your account.`
      });
      
      // Create notification for deleted card
      await createNotification(`Card Removed`, `Your ${selectedCard.payment_network} has been removed from your account.`);
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  const createNotification = async (title: string, description: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          description,
          read: false
        });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const openOffersDialog = async (e: React.MouseEvent, card: CardType) => {
    e.stopPropagation();
    setSelectedCard(card);
    
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('bank', card.bank);
      
      if (error) {
        throw error;
      }
      
      setCardOffers(data || []);
      setIsOffersDialogOpen(true);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to load promotions");
    }
  };

  const formatCardNumber = (digits: number | null) => {
    if (!digits) return "**** **** **** ****";
    return `**** **** **** ${digits.toString().padStart(4, '0')}`;
  };

  const formatExpiryDate = (date: string | null) => {
    if (!date) return "MM/YY";
    
    // Handle different date formats
    if (date.includes('-')) {
      // If it's in YYYY-MM-DD format from database
      const parts = date.split('-');
      if (parts.length >= 2) {
        const month = parts[1];
        const year = parts[0].slice(-2);
        return `${month}/${year}`;
      }
    }
    
    return date; // Return as is if already formatted
  };

  if (isLoading && cards.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
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
                <h3 className="text-xl font-semibold">{card.payment_network}</h3>
              </div>
              <div className="mb-6">
                <CreditCard className="h-8 w-8 mb-1" />
                <p className="text-base font-medium tracking-widest">{formatCardNumber(card.last_digits)}</p>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-white/70">Expires</p>
                  <p>{formatExpiryDate(card.expiration_date)}</p>
                </div>
                <div>
                  <p className="text-white/70">Type</p>
                  <p>{card.card_type}</p>
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
                      <p className="text-sm font-medium">{card.card_type}</p>
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
              <div className="col-span-3">
                <Select
                  name="bank"
                  value={newCard.bank}
                  onValueChange={(value) => setNewCard(prev => ({ ...prev, bank: value }))}
                >
                  <SelectTrigger id="bank" className={errors.bank ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nacion">Nacion</SelectItem>
                    <SelectItem value="Ciudad">Ciudad</SelectItem>
                    <SelectItem value="Galicia">Galicia</SelectItem>
                    <SelectItem value="Macro">Macro</SelectItem>
                    <SelectItem value="BBVA">BBVA</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bank && <p className="text-sm text-red-500 mt-1">{errors.bank}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="payment_network" className="text-right text-sm font-medium">
                Payment Network
              </label>
              <div className="col-span-3">
                <Select
                  name="payment_network"
                  value={newCard.payment_network}
                  onValueChange={(value) => setNewCard(prev => ({ ...prev, payment_network: value }))}
                >
                  <SelectTrigger id="payment_network" className={errors.payment_network ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select payment network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="American Express">American Express</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                    <SelectItem value="Visa">Visa</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_network && <p className="text-sm text-red-500 mt-1">{errors.payment_network}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="card_type" className="text-right text-sm font-medium">
                Card Type
              </label>
              <div className="col-span-3">
                <Select
                  name="card_type"
                  value={newCard.card_type}
                  onValueChange={(value) => setNewCard(prev => ({ ...prev, card_type: value }))}
                >
                  <SelectTrigger id="card_type" className={errors.card_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.card_type && <p className="text-sm text-red-500 mt-1">{errors.card_type}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="last_digits" className="text-right text-sm font-medium">
                Last 4 Digits
              </label>
              <div className="col-span-3">
                <Input
                  id="last_digits"
                  name="last_digits"
                  value={newCard.last_digits}
                  onChange={handleInputChange}
                  className={errors.last_digits ? "border-red-500" : ""}
                  placeholder="1234"
                  maxLength={4}
                />
                {errors.last_digits && <p className="text-sm text-red-500 mt-1">{errors.last_digits}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiration_date" className="text-right text-sm font-medium">
                Expiry Date
              </label>
              <div className="col-span-3">
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  value={newCard.expiration_date}
                  onChange={handleInputChange}
                  className={errors.expiration_date ? "border-red-500" : ""}
                  placeholder="MM/YY"
                  maxLength={5}
                  pattern="[0-9]{2}/[0-9]{2}"
                />
                {errors.expiration_date && <p className="text-sm text-red-500 mt-1">{errors.expiration_date}</p>}
              </div>
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
                <div className="col-span-3">
                  <Select
                    name="bank"
                    value={editedCard.bank}
                    onValueChange={(value) => setEditedCard(prev => ({ ...prev!, bank: value }))}
                  >
                    <SelectTrigger id="edit-bank" className={errors.bank ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nacion">Nacion</SelectItem>
                      <SelectItem value="Ciudad">Ciudad</SelectItem>
                      <SelectItem value="Galicia">Galicia</SelectItem>
                      <SelectItem value="Macro">Macro</SelectItem>
                      <SelectItem value="BBVA">BBVA</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.bank && <p className="text-sm text-red-500 mt-1">{errors.bank}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-payment_network" className="text-right">Card Name</Label>
                <div className="col-span-3">
                  <Select
                    name="payment_network"
                    value={editedCard.payment_network}
                    onValueChange={(value) => setEditedCard(prev => ({ ...prev!, payment_network: value }))}
                  >
                    <SelectTrigger id="edit-payment_network" className={errors.payment_network ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select payment network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="American Express">American Express</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="Visa">Visa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.payment_network && <p className="text-sm text-red-500 mt-1">{errors.payment_network}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-card_type" className="text-right">Card Type</Label>
                <div className="col-span-3">
                  <Select
                    name="card_type"
                    value={editedCard.card_type}
                    onValueChange={(value) => setEditedCard(prev => ({ ...prev!, card_type: value }))}
                  >
                    <SelectTrigger id="edit-card_type" className={errors.card_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Debit">Debit</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.card_type && <p className="text-sm text-red-500 mt-1">{errors.card_type}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiration_date" className="text-right">Expiry Date</Label>
                <div className="col-span-3">
                  <Input
                    id="edit-expiration_date"
                    name="expiration_date"
                    value={editedCard.expiration_date}
                    onChange={handleEditInputChange}
                    className={errors.expiration_date ? "border-red-500" : ""}
                    maxLength={5}
                    pattern="[0-9]{2}/[0-9]{2}"
                    placeholder="MM/YY"
                  />
                  {errors.expiration_date && <p className="text-sm text-red-500 mt-1">{errors.expiration_date}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Card Status</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch 
                    id="edit-status"
                    checked={editedCard.status === "active"}
                    onCheckedChange={handleStatusToggle}
                  />
                  <Label htmlFor="edit-status" className="text-sm text-muted-foreground">
                    {editedCard.status === "active" ? "Active" : "Inactive"}
                  </Label>
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
            <Button 
              type="button" 
              onClick={handleSaveChanges}
              className="flex items-center gap-2 mb-2"
            >
              <Edit className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOffersDialogOpen} onOpenChange={setIsOffersDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCard?.bank} Offers
              {selectedCard && <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedCard.payment_network})
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
                            Valid until {new Date(offer.expiration_date).toLocaleDateString()}
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
                      {offer.link_promotion && (
                        <div className="flex justify-end mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs flex items-center gap-1.5"
                            onClick={() => window.open(offer.link_promotion, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Link to Promotion
                          </Button>
                        </div>
                      )}
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
