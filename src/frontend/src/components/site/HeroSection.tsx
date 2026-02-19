import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenSignIn: (onSuccess?: () => void) => void;
  onNavigateToDashboard: () => void;
}

export function HeroSection({ onOpenSignIn, onNavigateToDashboard }: HeroSectionProps) {
  const handleGetStarted = () => {
    // Pass dashboard navigation as success callback
    onOpenSignIn(onNavigateToDashboard);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-bg.dim_1920x1080.png"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            <Zap className="h-4 w-4" />
            AI-Powered Investment Intelligence
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-red-500 bg-clip-text text-transparent">
              Next-Generation
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Investment Platform
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence to make smarter investment decisions with real-time insights
            and predictive analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.querySelector('#insights');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View AI Insights
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 pt-12 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-red-500">98%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-red-500">24/7</div>
              <div className="text-sm text-muted-foreground">AI Monitoring</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-red-500">$2B+</div>
              <div className="text-sm text-muted-foreground">Assets Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-red-500">2026/02/20</div>
              <div className="text-sm text-muted-foreground">Project Start Date</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-red-500">2458</div>
              <div className="text-sm text-muted-foreground">People</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
