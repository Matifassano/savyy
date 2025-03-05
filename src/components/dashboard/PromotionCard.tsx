import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Gift, Tag } from "lucide-react";
import { Promotion } from "@/types/dashboard";

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard = ({ promotion }: PromotionCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }} 
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-base sm:text-lg">{promotion.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {promotion.bank} 
                {promotion.isNew && <span className="ml-2 inline-block px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 rounded-full dark:text-green-300">New</span>}
                <span className="ml-2 inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-[10px] rounded-full capitalize">{promotion.cardType}</span>
              </CardDescription>
            </div>
            {promotion.category === "Cashback" ? (
              <Tag className="h-4 w-4 text-green-500" />
            ) : promotion.category === "Points" ? (
              <Gift className="h-4 w-4 text-purple-500" />
            ) : (
              <CreditCard className="h-4 w-4 text-blue-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {promotion.description}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Valid until {new Date(promotion.validUntil).toLocaleDateString()}
            </span>
            <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto flex items-center gap-1.5">
              <ExternalLink className="h-3 w-3" />
              Link to Promotion
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 