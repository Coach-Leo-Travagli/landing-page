import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { createCheckoutSession, PlanType } from '@/lib/stripe';
import { toast } from 'sonner';

interface CheckoutButtonProps {
  planType: PlanType;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'hero' | 'cta';
  size?: 'sm' | 'lg' | 'default';
}

export default function CheckoutButton({ 
  planType, 
  className, 
  children,
  variant = 'default',
  size = 'lg'
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Create checkout session
      const checkoutUrl = await createCheckoutSession(planType);
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Erro no checkout:', error);
      
      // Show error toast
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Erro ao processar pagamento. Tente novamente.'
      );
      
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Processando...';
    if (children) return children;
    
    // Default text based on plan type
    switch (planType) {
      case 'basic':
        return 'Assinar Plano Básico';
      case 'standard':
        return 'Assinar Agora';
      case 'vip':
        return 'Assinar Plano VIP';
      default:
        return 'Assinar Plano';
    }
  };

  const getVariantStyle = () => {
    if (variant === 'hero') {
      return 'bg-primary hover:bg-primary/90 text-white';
    }
    if (variant === 'cta') {
      return 'bg-fitness-secondary hover:bg-fitness-secondary/90 text-white';
    }
    return '';
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      variant={variant === 'hero' || variant === 'cta' ? 'default' : variant}
      size={size}
      className={`w-full ${getVariantStyle()} ${className || ''}`}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {getButtonText()}
      </div>
    </Button>
  );
}