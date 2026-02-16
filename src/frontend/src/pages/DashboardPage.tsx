import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { TrendingUp, Activity, DollarSign, BarChart3, Wallet, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFormattedAvailableBalance } from '@/utils/availableBalance';

interface DashboardPageProps {
  onNavigateToLanding: () => void;
  onNavigateToWallet: () => void;
  onNavigateToPlans: () => void;
}

export function DashboardPage({ onNavigateToLanding, onNavigateToWallet, onNavigateToPlans }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const currentPrincipal = identity?.getPrincipal().toString();
  const balance = getFormattedAvailableBalance(currentPrincipal);

  const stats = [
    {
      title: 'Portfolio Value',
      value: balance,
      icon: DollarSign,
      description: 'Total investment value',
    },
    {
      title: 'Active Positions',
      value: '0',
      icon: Activity,
      description: 'Currently active',
    },
    {
      title: 'Weekly Return',
      value: '0%',
      icon: TrendingUp,
      description: 'This month',
    },
    {
      title: 'AI Signals',
      value: '0',
      icon: BarChart3,
      description: 'Active insights',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} />

      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}!
          </h1>
          <p className="text-muted-foreground text-lg">
            You are successfully signed in to your NexaProfit dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="rounded-full bg-red-500/10 p-2">
                    <Icon className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your investment journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={onNavigateToPlans}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4 hover:bg-accent/50 hover:border-red-500/50"
              >
                <div className="text-left w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <h3 className="font-semibold">View Investment Plans</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    Explore AI-powered investment strategies
                  </p>
                </div>
              </Button>
              <div className="rounded-lg border border-border/40 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">AI Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Review real-time market analysis
                </p>
              </div>
              <div className="rounded-lg border border-border/40 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <h3 className="font-semibold mb-1">Portfolio Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track your investment performance
                </p>
              </div>
              <Button 
                onClick={onNavigateToWallet}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Go to Wallet
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Your current account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-green-500">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <span className="text-sm font-medium">Standard</span>
                </div>
                {userProfile?.name && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{userProfile.name}</span>
                  </div>
                )}
                {identity && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Principal ID</span>
                    <span className="text-xs font-mono truncate max-w-[200px]">
                      {identity.getPrincipal().toString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-500/10 p-2 mt-1">
                <Activity className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Your dashboard is ready! Start exploring investment plans and AI insights to make informed decisions.
                  All features are powered by advanced artificial intelligence to help you maximize returns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} NexaProfit Secure. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
