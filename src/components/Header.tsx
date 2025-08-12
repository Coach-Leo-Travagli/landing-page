import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoTeamTravagli from "@/assets/logo_team_travagli.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoTeamTravagli}
              alt="Team Travagli - Coaching Fitness"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <Link
              to="/sobre-nos"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Sobre
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Button
              variant="hero"
              onClick={() => scrollToSection('pricing')}
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
              >
                Preços
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left text-muted-foreground hover:text-primary transition-colors"
              >
                FAQ
              </button>
              <Link
                to="/sobre-nos"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Button
                variant="hero"
                className="w-full"
                onClick={() => scrollToSection('pricing')}
              >
                Começar Agora
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}