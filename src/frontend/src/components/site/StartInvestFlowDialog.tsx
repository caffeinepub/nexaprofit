import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, TrendingUp, AlertCircle, Wallet, Loader2 } from 'lucide-react';
import type { InvestmentPlan } from '../../backend';
import { useGetCallerWalletBalance, usePurchaseInvestmentPlan } from '../../hooks/useWallet';
import { formatBalanceUSD } from '../../utils/availableBalance';

interface StartInvestFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: InvestmentPlan | null;
  weeklyReturnDisplay: string;
}

type FlowStep = 'confirm' | 'amount' | 'review' | 'success';

export function StartInvestFlowDialog({ open, onOpenChange, plan, weeklyReturnDisplay }: StartInvestFlowDialogProps) {
  const [step, setStep] = useState<FlowStep>('confirm');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Fetch wallet balance from backend
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useGetCallerWalletBalance();
  const availableBalance = balanceData ?? 0;

  // Purchase mutation
  const purchaseMutation = usePurchaseInvestmentPlan();

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep('confirm');
      setAmount('');
      setError('');
      purchaseMutation.reset();
    }, 200);
  };

  const handleNext = async () => {
    if (step === 'confirm') {
      setStep('amount');
    } else if (step === 'amount') {
      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      // Check if amount exceeds available balance
      if (numAmount > availableBalance) {
        setError("Wallet doesn't have enough balance");
        return;
      }
      setError('');
      setStep('review');
    } else if (step === 'review') {
      // Call backend to purchase the plan
      if (!plan) return;
      
      const numAmount = parseFloat(amount);
      try {
        await purchaseMutation.mutateAsync({ planId: plan.planId, amount: numAmount });
        setStep('success');
      } catch (err: any) {
        // Show error message
        const errorMessage = err?.message || 'Failed to purchase investment plan';
        setError(errorMessage);
      }
    }
  };

  const handleBack = () => {
    setError('');
    purchaseMutation.reset();
    if (step === 'amount') {
      setStep('confirm');
    } else if (step === 'review') {
      setStep('amount');
    }
  };

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

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Investment Plan</DialogTitle>
              <DialogDescription>
                Review the plan details before proceeding with your investment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Weekly Return</div>
                  <div className="text-2xl font-bold text-red-500">
                    {weeklyReturnDisplay}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                  <Badge variant="outline" className={getRiskColor(plan.riskLevel)}>
                    {plan.riskLevel}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Minimum Investment</div>
                <div className="text-lg font-semibold">{plan.minimumInvestmentRange}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground italic leading-relaxed">
                  <TrendingUp className="h-3 w-3 inline mr-1 text-red-500" />
                  {plan.aiNarrative}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'amount' && (
          <>
            <DialogHeader>
              <DialogTitle>Enter Investment Amount</DialogTitle>
              <DialogDescription>
                Specify how much you would like to invest in {plan.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted/30 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                </div>
                {balanceLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : balanceError ? (
                  <span className="text-sm text-destructive">Error loading balance</span>
                ) : (
                  <span className="text-lg font-semibold">{formatBalanceUSD(availableBalance)}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  min="0"
                  step="0.01"
                  disabled={balanceLoading}
                />
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
              <div className="bg-muted/30 p-3 rounded-lg space-y-1">
                <div className="text-sm font-medium">Suggested Range</div>
                <div className="text-sm text-muted-foreground">{plan.minimumInvestmentRange}</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={balanceLoading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Review Investment
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'review' && (
          <>
            <DialogHeader>
              <DialogTitle>Review Your Investment</DialogTitle>
              <DialogDescription>
                Please review the details before confirming your investment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Investment Amount</span>
                  <span className="font-semibold text-lg">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Weekly Return Rate</span>
                  <span className="font-medium text-red-500">{weeklyReturnDisplay}%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Weekly Earnings</span>
                  <span className="font-medium text-green-500">
                    ${(parseFloat(amount) * plan.weeklyReturn).toFixed(2)}
                  </span>
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg">
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleBack} disabled={purchaseMutation.isPending}>
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={purchaseMutation.isPending}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                {purchaseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>Investment Successful!</DialogTitle>
              <DialogDescription>
                Your investment has been processed successfully.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-green-500/10 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Investment Confirmed</h3>
                  <p className="text-sm text-muted-foreground">
                    You have successfully invested ${parseFloat(amount).toFixed(2)} in {plan.name}.
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Invested</span>
                  <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Return</span>
                  <span className="font-medium text-red-500">{weeklyReturnDisplay}%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
