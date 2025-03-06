import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CreditCard } from "lucide-react";
import { Promotion } from "@/types/dashboard";
import { PromotionCard } from "./PromotionCard";

interface PromotionCarouselProps {
  promotions: Promotion[];
  resetFilters: () => void;
}

export const PromotionCarousel = ({
  promotions,
  resetFilters
}: PromotionCarouselProps) => {
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const handlePrevious = () => {
    if (prevBtnRef.current) {
      prevBtnRef.current.click();
    }
  };

  const handleNext = () => {
    if (nextBtnRef.current) {
      nextBtnRef.current.click();
    }
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12 bg-accent/20 rounded-lg">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">No matching promotions</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters to see more results
        </p>
        <Button onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 sm:-ml-4">
          {promotions.map(promotion => (
            <CarouselItem key={promotion.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
              <PromotionCard promotion={promotion} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden">
          <CarouselPrevious ref={prevBtnRef} className="left-0" />
          <CarouselNext ref={nextBtnRef} className="right-0" />
        </div>
      </Carousel>
      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm" className="mx-1" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="outline" size="sm" className="mx-1" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
