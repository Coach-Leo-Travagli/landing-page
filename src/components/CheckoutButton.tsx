import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { type PlanType } from '@/utils/plans';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Check if Stripe is configured
      if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        toast.error('Stripe não está configurado. Configure VITE_STRIPE_PUBLIC_KEY para usar pagamentos.');
        setIsLoading(false);
        return;
      }
      
      // Redirect to our custom payment page
      navigate(`/pagamento?plan=${planType}`);
      // No need to setIsLoading(false) as component will unmount
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