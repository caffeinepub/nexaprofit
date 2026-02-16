import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowLeft, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { getFormattedAvailableBalance } from '@/utils/availableBalance';

interface WalletPageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
}

export function WalletPage({ onNavigateToLanding, onNavigateToDashboard }: WalletPageProps) {
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();
  const balance = getFormattedAvailableBalance(currentPrincipal);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} />

      <main className="container py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onNavigateToDashboard}
          className="gap-2 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-3">
              <Wallet className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-5xl font-bold">{balance}</div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
                <Button variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your transaction history will appear here
              </p>
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
