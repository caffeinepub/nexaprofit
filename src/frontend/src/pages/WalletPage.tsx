import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Loader2, AlertCircle } from 'lucide-react';
import { useGetCallerWalletBalance } from '@/hooks/useWallet';
import { formatBalanceUSD } from '@/utils/availableBalance';

interface WalletPageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
}

export function WalletPage({ onNavigateToLanding, onNavigateToDashboard }: WalletPageProps) {
  // Fetch wallet balance from backend
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useGetCallerWalletBalance();
  const balance = balanceData ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} />

      <main className="container py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onNavigateToDashboard}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground text-lg">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Balance Card */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-red-500" />
              Available Balance
            </CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading balance...</span>
              </div>
            ) : balanceError ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Error loading balance</span>
              </div>
            ) : (
              <div className="text-5xl font-bold text-red-500">
                {formatBalanceUSD(balance)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownToLine className="h-5 w-5 text-green-500" />
                Deposit Funds
              </CardTitle>
              <CardDescription>Add money to your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                disabled
              >
                Deposit (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpFromLine className="h-5 w-5 text-blue-500" />
                Withdraw Funds
              </CardTitle>
              <CardDescription>Transfer money from your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full"
                disabled
              >
                Withdraw (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm mt-2">Your transaction history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
