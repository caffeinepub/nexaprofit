import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useGetCallerWalletBalance, useGetCallerWeeklyReturn } from '@/hooks/useWallet';
import { useIsCallerAdmin } from '@/hooks/useAdminWalletCredit';
import { TrendingUp, Activity, DollarSign, BarChart3, Wallet, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBalanceUSD } from '@/utils/availableBalance';

interface DashboardPageProps {
  onNavigateToLanding: () => void;
  onNavigateToWallet: () => void;
  onNavigateToPlans: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAdminWalletCredit: () => void;
}

export function DashboardPage({ 
  onNavigateToLanding, 
  onNavigateToWallet, 
  onNavigateToPlans, 
  onNavigateToProfile,
  onNavigateToAdminWalletCredit 
}: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  
  // Fetch wallet balance and weekly return from backend
  const { data: balanceData, isLoading: balanceLoading } = useGetCallerWalletBalance();
  const { data: weeklyReturnData, isLoading: weeklyReturnLoading } = useGetCallerWeeklyReturn();
  
  // Check if user is admin
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  // Default to 0 for new users
  const balance = balanceData ?? 0;
  const weeklyReturn = weeklyReturnData ?? 0;

  const stats = [
    {
      title: 'Portfolio Value',
      value: balanceLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatBalanceUSD(balance),
      icon: DollarSign,
      description: 'Total investment value',
      showButton: true,
    },
    {
      title: 'Active Positions',
      value: '0',
      icon: Activity,
      description: 'Currently active',
      showButton: false,
    },
    {
      title: 'Weekly Return',
      value: weeklyReturnLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${(weeklyReturn * 100).toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Current plan rate',
      showButton: false,
    },
    {
      title: 'AI Signals',
      value: '0',
      icon: BarChart3,
      description: 'Active insights',
      showButton: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} onNavigateToProfile={onNavigateToProfile} />

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
                  {stat.showButton && (
                    <Button 
                      onClick={onNavigateToWallet}
                      className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Go to Wallet
                    </Button>
                  )}
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
              <CardDescription>Manage your investments and portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={onNavigateToPlans}
                className="w-full justify-start bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse Investment Plans
              </Button>
              <Button 
                onClick={onNavigateToWallet}
                variant="outline"
                className="w-full justify-start"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Manage Wallet
              </Button>
              {!adminCheckLoading && isAdmin && (
                <Button 
                  onClick={onNavigateToAdminWalletCredit}
                  variant="outline"
                  className="w-full justify-start border-red-500/20 hover:bg-red-500/10"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />
                  Admin: Credit Wallets
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <span className="text-sm font-medium">
                  {adminCheckLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-red-500">
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </span>
                  ) : (
                    'Standard'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-green-500">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">Today</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Banner */}
        {balance === 0 && (
          <Card className="border-red-500/20 bg-gradient-to-r from-red-500/5 to-red-600/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Start your investment journey with NexaProfit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your account is ready! To begin investing, deposit funds into your wallet and choose an investment plan that matches your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={onNavigateToWallet}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
                <Button 
                  onClick={onNavigateToPlans}
                  variant="outline"
                >
                  View Investment Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
