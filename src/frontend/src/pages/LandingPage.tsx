import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { HeroSection } from '@/components/site/HeroSection';
import { FeaturesSection } from '@/components/site/FeaturesSection';
import { AIInsightsSection } from '@/components/insights/AIInsightsSection';
import { AnalyticsPreviewSection } from '@/components/site/AnalyticsPreviewSection';
import { FaqSection } from '@/components/site/FaqSection';
import { ContactSection } from '@/components/site/ContactSection';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onOpenSignIn: (onSuccess?: () => void) => void;
  onNavigateToPlans: () => void;
}

export function LandingPage({ onNavigateToDashboard, onOpenSignIn, onNavigateToPlans }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader onNavigateToDashboard={onNavigateToDashboard} onOpenSignIn={onOpenSignIn} />
      <HeroSection onOpenSignIn={onOpenSignIn} onNavigateToDashboard={onNavigateToDashboard} />
      <FeaturesSection />
      <AIInsightsSection />
      <AnalyticsPreviewSection />
      
      {/* Investment Plans CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center p-2 bg-red-500/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
                  Ready to Start Investing?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our AI-powered investment plans designed to match your risk tolerance and financial goals. 
                Choose from conservative, balanced, or high-yield strategies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onNavigateToPlans}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30 group"
              >
                View Investment Plans
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => onOpenSignIn()}
                size="lg"
                variant="outline"
                className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
              >
                Sign In to Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
