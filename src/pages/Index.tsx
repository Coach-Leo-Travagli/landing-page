import { useEffect } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Check if we need to auto-expand the refund policy question and scroll to FAQ
    const checkHashHasChanged = () => {
      const hash = window.location.hash;
      if (hash === '#pricing') {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Check immediately and also when hash changes
    checkHashHasChanged();
    window.addEventListener('hashchange', checkHashHasChanged);
    
    return () => window.removeEventListener('hashchange', checkHashHasChanged);
  }, []);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
