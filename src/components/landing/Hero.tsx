
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const { toast } = useToast();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
        Never Miss a Bank Promotion Again
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
        Get instant notifications about bank promotions when shopping online.
        Save money effortlessly.
      </p>
      <Button
        size="lg"
        className="mt-6 sm:mt-8"
        onClick={() =>
          toast({
            title: "Coming Soon!",
            description: "Sign up to get early access.",
          })
        }
      >
        Get Started
      </Button>
    </motion.div>
  );
};

export default Hero;
