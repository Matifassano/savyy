import { Button } from "@/components/ui/button";
import { MyCards } from "@/components/my-cards";

interface MyCardsSectionProps {
  onBack: () => void;
  onCardsChange: (cards: any[]) => void;
}

export const MyCardsSection = ({
  onBack,
  onCardsChange
}: MyCardsSectionProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Cards</h2>
        <Button size="sm" onClick={onBack}>
          Back to Promotions
        </Button>
      </div>
      <MyCards onCardsChange={onCardsChange} />
    </div>
  );
}; 