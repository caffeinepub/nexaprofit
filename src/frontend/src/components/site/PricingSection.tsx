import { useInvestmentPlans } from '../../hooks/useInvestmentPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertTriangle, Sparkles } from 'lucide-react';

export function PricingSection() {
  const { data: plans, isLoading, error } = useInvestmentPlans();

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'high':
        return 'text-red-500 border-red-500/30 bg-red-500/10';
      default:
        return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 bg-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              Investment Plans
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that aligns with your investment goals and risk tolerance.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Failed to load investment plans. Please try again later.</AlertDescription>
          </Alert>
        )}

        {plans && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={plan.planId}
                className={`group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 bg-card/50 backdrop-blur ${
                  index === 1 ? 'border-red-500/50 shadow-lg shadow-red-500/20 scale-105' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {index === 1 && (
                      <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-red-500">{plan.monthlyReturn.toFixed(2)}%</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRiskColor(plan.riskLevel)}>
                        {plan.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <div className="text-sm text-muted-foreground mb-2">Minimum Investment</div>
                    <div className="text-2xl font-bold">{index === 1 ? '$51 - $200' : '$10 - $50'}</div>
                  </div>

                  <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">AI-powered portfolio optimization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">24/7 market monitoring</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Real-time risk assessment</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <div className="text-xs text-muted-foreground italic leading-relaxed bg-muted/30 p-3 rounded-lg">
                      <Sparkles className="h-3 w-3 inline mr-1 text-red-500" />
                      {plan.aiNarrative}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      index === 1
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                        : ''
                    }`}
                    variant={index === 1 ? 'default' : 'outline'}
                    onClick={scrollToContact}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
