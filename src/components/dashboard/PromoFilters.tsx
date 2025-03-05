import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, CreditCard } from "lucide-react";
import { FilterType } from "@/types/dashboard";

interface PromoFiltersProps {
  filters: FilterType;
  activeFilter: keyof FilterType;
  showOnlyCompatible: boolean;
  categories: string[];
  banks: string[];
  ageOptions: string[];
  cardTypes: string[];
  setActiveFilter: (filter: keyof FilterType) => void;
  handleFilterChange: (key: keyof FilterType, value: string) => void;
  setShowOnlyCompatible: (value: boolean) => void;
  getFilterDisplayText: () => string;
  setShowCards: (show: boolean) => void;
}

export const PromoFilters = ({
  filters,
  activeFilter,
  showOnlyCompatible,
  categories,
  banks,
  ageOptions,
  cardTypes,
  setActiveFilter,
  handleFilterChange,
  setShowOnlyCompatible,
  getFilterDisplayText,
  setShowCards
}: PromoFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
            <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {getFilterDisplayText()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="p-2">
            <div className="mb-2 font-medium text-xs uppercase text-muted-foreground">Filter Type</div>
            <div className="grid grid-cols-2 gap-1 mb-3">
              <Button 
                variant={activeFilter === "category" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("category")}
                className="text-xs"
              >
                Category
              </Button>
              <Button 
                variant={activeFilter === "bank" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("bank")}
                className="text-xs"
              >
                Bank
              </Button>
              <Button 
                variant={activeFilter === "age" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("age")}
                className="text-xs"
              >
                Age
              </Button>
              <Button 
                variant={activeFilter === "cardType" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveFilter("cardType")}
                className="text-xs"
              >
                Card Type
              </Button>
            </div>
            
            <div className="mb-2 font-medium text-xs uppercase text-muted-foreground">
              {activeFilter === "category" ? "Categories" : 
               activeFilter === "bank" ? "Banks" : 
               activeFilter === "age" ? "Age" : "Card Types"}
            </div>
            
            {activeFilter === "category" && categories.map(category => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => handleFilterChange("category", category)}
                className={filters.category === category ? "bg-primary/10 text-primary" : ""}
              >
                {category}
              </DropdownMenuItem>
            ))}
            
            {activeFilter === "bank" && banks.map(bank => (
              <DropdownMenuItem 
                key={bank} 
                onClick={() => handleFilterChange("bank", bank)}
                className={filters.bank === bank ? "bg-primary/10 text-primary" : ""}
              >
                {bank}
              </DropdownMenuItem>
            ))}
            
            {activeFilter === "age" && ageOptions.map(option => (
              <DropdownMenuItem 
                key={option} 
                onClick={() => handleFilterChange("age", option)}
                className={filters.age === option ? "bg-primary/10 text-primary" : ""}
              >
                {option}
              </DropdownMenuItem>
            ))}
            
            {activeFilter === "cardType" && cardTypes.map(type => (
              <DropdownMenuItem 
                key={type} 
                onClick={() => handleFilterChange("cardType", type)}
                className={filters.cardType === type ? "bg-primary/10 text-primary" : ""}
              >
                {type}
              </DropdownMenuItem>
            ))}
            
            <div className="mt-3 pt-2 border-t">
              <label className="flex items-center text-xs font-medium space-x-2">
                <input 
                  type="checkbox" 
                  checked={showOnlyCompatible} 
                  onChange={(e) => setShowOnlyCompatible(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>Show only compatible with my cards</span>
              </label>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto" onClick={() => setShowCards(true)}>
        <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> My Cards
      </Button>
    </div>
  );
}; 