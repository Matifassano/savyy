
import { useEffect, useCallback } from "react";
import { MyCards } from "@/components/my-cards";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Footer } from "./Login";

const ManageCards = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  
  useEffect(() => {
    // This ensures user information is loaded when the page is accessed
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Memoize callback to prevent unnecessary rerenders
  const handleCardsChange = useCallback((cards: any[]) => {
    // This function will be called when cards are updated
    console.log("Cards updated:", cards);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Savy</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">My Cards</h2>
          <MyCards onCardsChange={handleCardsChange} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageCards;
