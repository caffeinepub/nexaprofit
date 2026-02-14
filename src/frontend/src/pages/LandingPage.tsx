import { SiteHeader } from '../components/site/SiteHeader';
import { SiteFooter } from '../components/site/SiteFooter';
import { HeroSection } from '../components/site/HeroSection';
import { FeaturesSection } from '../components/site/FeaturesSection';
import { AIInsightsSection } from '../components/insights/AIInsightsSection';
import { AnalyticsPreviewSection } from '../components/site/AnalyticsPreviewSection';
import { PricingSection } from '../components/site/PricingSection';
import { FaqSection } from '../components/site/FaqSection';
import { ContactSection } from '../components/site/ContactSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AIInsightsSection />
        <AnalyticsPreviewSection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
