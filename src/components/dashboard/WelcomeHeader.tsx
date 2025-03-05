import { PromoFilters } from "./PromoFilters";
import { FilterType } from "@/types/dashboard";

interface WelcomeHeaderProps {
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

export const WelcomeHeader = ({
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
}: WelcomeHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here are your current promotions
        </p>
      </div>
      <PromoFilters 
        filters={filters}
        activeFilter={activeFilter}
        showOnlyCompatible={showOnlyCompatible}
        categories={categories}
        banks={banks}
        ageOptions={ageOptions}
        cardTypes={cardTypes}
        setActiveFilter={setActiveFilter}
        handleFilterChange={handleFilterChange}
        setShowOnlyCompatible={setShowOnlyCompatible}
        getFilterDisplayText={getFilterDisplayText}
        setShowCards={setShowCards}
      />
    </div>
  );
}; 