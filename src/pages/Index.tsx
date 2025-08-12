import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CoachVideo from "@/components/CoachVideo";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

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

  // If returning from a footer legal link, jump to footer once
  const location = useLocation();
  useEffect(() => {
    if (sessionStorage.getItem('fromFooterNav') === '1') {
      sessionStorage.removeItem('fromFooterNav');
      // scroll to footer container (no smooth)
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const top = (footerEl as HTMLElement).offsetTop;
        window.scrollTo(0, top);
      }
    }
  }, [location.key]);

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="coach-video">
        <CoachVideo />
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
