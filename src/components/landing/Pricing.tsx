
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    description: "Essential features for casual users",
    features: [
      "Add up to 2 cards",
      "Basic notifications",
      "Standard support",
      "Web access only"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "per month",
    description: "Advanced features for active users",
    features: [
      "Add up to 5 cards",
      "Priority notifications",
      "Email & chat support",
      "Mobile app access",
      "Personalized offers"
    ],
    cta: "Go Premium",
    popular: true
  },
  {
    name: "Premium+",
    price: "$9.99",
    period: "per month",
    description: "Ultimate experience for power users",
    features: [
      "Unlimited cards",
      "Instant notifications",
      "24/7 priority support",
      "Mobile app access",
      "Personalized offers",
      "Family accounts",
      "Exclusive promotions"
    ],
    cta: "Go Premium+",
    popular: false
  }
];

export const Pricing = () => {
  const { toast } = useToast();

  return (
    <section className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade or downgrade anytime.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="bg-primary text-white text-xs font-medium py-1 px-3 rounded-t-md text-center">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "Coming Soon!",
                      description: `${plan.name} plan will be available soon.`,
                    })
                  }
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
