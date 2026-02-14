import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AnalyticsPreviewSection() {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimationProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 78 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 92 },
  ];

  const metrics = [
    { label: 'Portfolio Growth', value: '+24.5%', trend: 'up', color: 'text-green-500' },
    { label: 'Risk Score', value: '3.2/10', trend: 'down', color: 'text-blue-500' },
    { label: 'AI Confidence', value: '94%', trend: 'up', color: 'text-red-500' },
  ];

  return (
    <section id="analytics" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-4">
            <Activity className="h-4 w-4" />
            Performance Analytics
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              Real-Time Performance Tracking
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Monitor your portfolio's performance with advanced analytics and AI-powered insights.
          </p>
        </div>

        {/* Disclaimer */}
        <Alert className="mb-8 max-w-4xl mx-auto border-yellow-500/30 bg-yellow-500/5">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong className="text-foreground">Illustrative Data:</strong> Charts and metrics shown are for
            demonstration purposes only and do not represent actual investment performance.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/40">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm">{metric.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-3xl font-bold ${metric.color}`}>{metric.value}</span>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-blue-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 backdrop-blur border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>6-month trend analysis</CardDescription>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-500">
                +18.2% YTD
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {chartData.map((data, index) => {
                const height = (data.value / 100) * 100;
                const animatedHeight = (height * animationProgress) / 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-lg transition-all duration-300 ease-out"
                        style={{ height: `${animatedHeight}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
