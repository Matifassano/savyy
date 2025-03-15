import { memo } from "react";
import { FilterType } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface WelcomeHeaderProps {
  filters: FilterType;
  activeFilter: keyof FilterType;
  showOnlyCompatible: boolean;
  categories: string[];
  banks: string[];
  cardTypes: string[];
  setActiveFilter: (filter: keyof FilterType) => void;
  handleFilterChange: (key: keyof FilterType, value: string) => void;
  setShowOnlyCompatible: (show: boolean) => void;
  getFilterDisplayText: () => string;
}

export const WelcomeHeader = memo(({
  filters,
  activeFilter,
  showOnlyCompatible,
  categories,
  banks,
  cardTypes,
  setActiveFilter,
  handleFilterChange,
  setShowOnlyCompatible,
  getFilterDisplayText,
}: WelcomeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Discover the best promotions for your cards</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/manage-cards")}>
          Manage Cards
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as keyof FilterType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="promotionType">Promotion Type</SelectItem>
              <SelectItem value="cardType">Card Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={filters[activeFilter]}
            onValueChange={(value) => handleFilterChange(activeFilter, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={getFilterDisplayText()} />
            </SelectTrigger>
            <SelectContent>
              {activeFilter === "category" && categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              {activeFilter === "bank" && banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
              {activeFilter === "promotionType" && ["All Promotions", "Discounts", "Cashback", "No-Interest Payment"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
              {activeFilter === "cardType" && cardTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="compatible-only"
            checked={showOnlyCompatible}
            onCheckedChange={setShowOnlyCompatible}
          />
          <Label htmlFor="compatible-only" className="text-sm">
            Show only compatible cards
          </Label>
        </div>
      </div>
    </div>
  );
});

WelcomeHeader.displayName = "WelcomeHeader";
