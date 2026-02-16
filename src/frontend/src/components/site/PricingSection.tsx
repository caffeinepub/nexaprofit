import { useState } from 'react';
import { useInvestmentPlans } from '../../hooks/useInvestmentPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertTriangle, Sparkles, ArrowLeft } from 'lucide-react';
import type { InvestmentPlan } from '../../backend';

export function PricingSection() {
  const { data: plans, isLoading, error } = useInvestmentPlans();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

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

  const getRelatedPlans = (plan: InvestmentPlan): InvestmentPlan[] => {
    if (!plans) return [];
    return plans.filter(
      (p) => p.riskLevel === plan.riskLevel && p.planId !== plan.planId
    );
  };

  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
  };

  const handleShowAllPlans = () => {
    setSelectedPlan(null);
  };

  const formatWeeklyReturn = (plan: InvestmentPlan, index: number, isShowingRelated: boolean): string => {
    // Only format with decimal for the first main plan (plan1) when showing all plans
    if (!isShowingRelated && index === 0 && plan.planId === 'plan1') {
      return (plan.weeklyReturn * 100).toFixed(1);
    }
    return (plan.weeklyReturn * 100).toFixed(0);
  };

  const displayPlans = selectedPlan ? getRelatedPlans(selectedPlan) : plans;
  const showingRelated = selectedPlan !== null;
  const hasRelatedPlans = showingRelated && displayPlans && displayPlans.length > 0;

  return (
    <section id="pricing" className="py-24 bg-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              {showingRelated ? 'Related Investment Plans' : 'Investment Plans'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {showingRelated
              ? `Plans similar to "${selectedPlan?.name}" with ${selectedPlan?.riskLevel} risk level`
              : 'Choose the plan that aligns with your investment goals and risk tolerance.'}
          </p>
        </div>

        {showingRelated && (
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              onClick={handleShowAllPlans}
              className="gap-2 hover:border-red-500/50 hover:text-red-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Show All Plans
            </Button>
          </div>
        )}

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

        {showingRelated && !hasRelatedPlans && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <Alert className="border-muted bg-muted/30">
              <AlertDescription className="text-center text-base">
                No related plans found for "{selectedPlan?.name}".
              </AlertDescription>
            </Alert>
          </div>
        )}

        {displayPlans && displayPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPlans.map((plan, index) => {
              const isPopular = !showingRelated && index === 1;
              return (
                <Card
                  key={plan.planId}
                  className={`group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 bg-card/50 backdrop-blur ${
                    isPopular ? 'border-red-500/50 shadow-lg shadow-red-500/20 scale-105' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      {isPopular && (
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
                        <span className="text-4xl font-bold text-red-500">
                          {formatWeeklyReturn(plan, index, showingRelated)}%
                        </span>
                        <span className="text-muted-foreground">/week</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getRiskColor(plan.riskLevel)}>
                          {plan.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <div className="text-sm text-muted-foreground mb-2">Minimum Investment</div>
                      <div className="text-2xl font-bold">{plan.minimumInvestmentRange}</div>
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
                        isPopular
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                          : ''
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Show Related Plans
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
