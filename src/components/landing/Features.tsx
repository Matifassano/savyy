
import { motion } from "framer-motion";
import { BadgeCheck, CreditCard, Bell } from "lucide-react";

const features = [
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Card Management",
    description: "Add and manage your bank cards securely",
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Smart Notifications",
    description: "Get instant alerts for bank promotions",
  },
  {
    icon: <BadgeCheck className="h-6 w-6" />,
    title: "Verified Promotions",
    description: "Only receive genuine bank offers",
  },
];

export const Features = () => {
  return (
    <section className="container mx-auto py-12 sm:py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-16 sm:mt-24 mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold">Functions</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="glass-card p-6 rounded-lg space-y-4"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
