
import { Footer } from "./Login";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto py-12 sm:py-24 px-4">
          <Hero />
        </section>
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
