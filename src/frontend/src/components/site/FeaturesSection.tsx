import { Brain, Shield, Zap, TrendingUp, BarChart3, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Models',
    description:
      'Proprietary machine learning algorithms analyze market patterns and predict trends with unprecedented accuracy.',
    badge: 'Core Technology',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description:
      'Lightning-fast data processing ensures you never miss a critical market opportunity or risk signal.',
    badge: 'Performance',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    description:
      'Forecast market movements and identify emerging opportunities before they become mainstream.',
    badge: 'Intelligence',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description:
      'Sophisticated risk assessment tools help protect your portfolio from unexpected market volatility.',
    badge: 'Security',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Optimization',
    description:
      'AI-driven recommendations to balance your portfolio for optimal returns based on your risk profile.',
    badge: 'Strategy',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description:
      'Bank-level encryption and security protocols ensure your data and investments remain protected.',
    badge: 'Protection',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our cutting-edge technology stack combines artificial intelligence, machine learning, and real-time data
            processing to deliver unparalleled investment insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 bg-card/50 backdrop-blur"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <Badge variant="outline" className="border-red-500/30 text-red-500">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
