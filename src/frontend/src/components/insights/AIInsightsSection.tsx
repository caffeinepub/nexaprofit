import { useAIInsights } from '../../hooks/useAIInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, TrendingUp, AlertTriangle, Info } from 'lucide-react';

export function AIInsightsSection() {
  const { data: insights, isLoading, error } = useAIInsights();

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-500 border-red-500/30 bg-red-500/10';
      case 'moderate':
      case 'medium':
        return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    }
  };

  const getTimeHorizonColor = (horizon: string) => {
    switch (horizon.toLowerCase()) {
      case 'short-term':
        return 'text-orange-500 border-orange-500/30';
      case 'medium-term':
        return 'text-purple-500 border-purple-500/30';
      case 'long-term':
        return 'text-green-500 border-green-500/30';
      default:
        return 'text-gray-500 border-gray-500/30';
    }
  };

  return (
    <section id="insights" className="py-24 bg-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-4">
            <Activity className="h-4 w-4" />
            Live AI Analysis
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              AI-Generated Market Insights
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI continuously analyzes market conditions to provide you with actionable intelligence.
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 max-w-4xl mx-auto border-yellow-500/30 bg-yellow-500/5">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong className="text-foreground">Demo Notice:</strong> These insights are simulated for demonstration
            purposes only. This platform does not provide real financial advice. Always consult with a qualified
            financial advisor before making investment decisions.
          </AlertDescription>
        </Alert>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Failed to load AI insights. Please try again later.</AlertDescription>
          </Alert>
        )}

        {insights && insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className="group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 bg-card/50 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                      {insight.signalType}
                    </CardTitle>
                    <Badge variant="outline" className={getImpactColor(insight.impactPotential)}>
                      {insight.impactPotential}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTimeHorizonColor(insight.timeHorizon)}>
                      {insight.timeHorizon}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Value</span>
                      <span className="text-2xl font-bold text-red-500">{insight.value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <span className="text-lg font-semibold">{(insight.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Relevance</span>
                      <span className="text-lg font-semibold">{(insight.relevanceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed pt-2 border-t border-border/40">
                    {insight.explanation}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
