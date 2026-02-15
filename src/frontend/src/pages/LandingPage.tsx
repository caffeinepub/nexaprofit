import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { HeroSection } from '@/components/site/HeroSection';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { AIInsightsSection } from '@/components/insights/AIInsightsSection';
import { AnalyticsPreviewSection } from '@/components/site/AnalyticsPreviewSection';
import { PricingSection } from '@/components/site/PricingSection';
import { FaqSection } from '@/components/site/FaqSection';
import { ContactSection } from '@/components/site/ContactSection';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onOpenSignIn: () => void;
}

export function LandingPage({ onNavigateToDashboard, onOpenSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onOpenSignIn={onOpenSignIn} />
      <HeroSection onOpenSignIn={onOpenSignIn} />
      <FeaturesSection />
      <AIInsightsSection />
      <AnalyticsPreviewSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
