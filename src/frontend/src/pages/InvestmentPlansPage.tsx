import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PricingSection } from '@/components/site/PricingSection';

interface InvestmentPlansPageProps {
  onNavigateToDashboard: () => void;
  onOpenSignIn: (onSuccess?: () => void) => void;
}

export function InvestmentPlansPage({ onNavigateToDashboard, onOpenSignIn }: InvestmentPlansPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onNavigateToDashboard={onNavigateToDashboard} onOpenSignIn={onOpenSignIn} />
      <main className="pt-20">
        <PricingSection onOpenSignIn={onOpenSignIn} />
      </main>
      <SiteFooter />
    </div>
  );
}
