import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useIsCallerAdmin, useCreditUserWallet, useSetWalletBalanceByEmail, useSetWalletBalanceByPrincipal } from '@/hooks/useAdminWalletCredit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, DollarSign, ShieldCheck, AlertCircle, CheckCircle2, Mail, User, Wallet } from 'lucide-react';
import { Principal } from '@dfinity/principal';

interface AdminWalletCreditPageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToProfile: () => void;
}

export function AdminWalletCreditPage({ 
  onNavigateToLanding, 
  onNavigateToDashboard,
  onNavigateToProfile 
}: AdminWalletCreditPageProps) {
  const { data: isAdmin, isLoading: adminCheckLoading, isFetched: adminCheckFetched } = useIsCallerAdmin();
  const creditMutation = useCreditUserWallet();
  const setBalanceByEmailMutation = useSetWalletBalanceByEmail();
  const setBalanceByPrincipalMutation = useSetWalletBalanceByPrincipal();

  // Principal-based credit form state
  const [userPrincipal, setUserPrincipal] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [principalValidationError, setPrincipalValidationError] = useState('');
  const [principalSuccessMessage, setPrincipalSuccessMessage] = useState('');

  // Email-based balance set form state
  const [userEmail, setUserEmail] = useState('');
  const [targetBalance, setTargetBalance] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('');

  // Principal-based balance set form state
  const [setPrincipal, setSetPrincipal] = useState('');
  const [setBalance, setSetBalance] = useState('');
  const [setBalanceValidationError, setSetBalanceValidationError] = useState('');
  const [setBalanceSuccessMessage, setSetBalanceSuccessMessage] = useState('');

  const validatePrincipalInputs = (): boolean => {
    setPrincipalValidationError('');
    setPrincipalSuccessMessage('');

    // Validate principal
    if (!userPrincipal.trim()) {
      setPrincipalValidationError('User Principal is required');
      return false;
    }

    try {
      Principal.fromText(userPrincipal.trim());
    } catch (error) {
      setPrincipalValidationError('Invalid Principal ID format');
      return false;
    }

    // Validate amount
    const numAmount = parseFloat(creditAmount);
    if (!creditAmount.trim() || isNaN(numAmount)) {
      setPrincipalValidationError('Credit Amount is required and must be a valid number');
      return false;
    }

    if (numAmount <= 0) {
      setPrincipalValidationError('Credit Amount must be greater than zero');
      return false;
    }

    return true;
  };

  const validateEmailInputs = (): boolean => {
    setEmailValidationError('');
    setEmailSuccessMessage('');

    // Validate email
    if (!userEmail.trim()) {
      setEmailValidationError('Email is required');
      return false;
    }

    // Validate balance
    const numBalance = parseFloat(targetBalance);
    if (!targetBalance.trim() || isNaN(numBalance)) {
      setEmailValidationError('Balance is required and must be a valid number');
      return false;
    }

    if (numBalance < 0) {
      setEmailValidationError('Balance cannot be negative');
      return false;
    }

    return true;
  };

  const validateSetBalanceInputs = (): boolean => {
    setSetBalanceValidationError('');
    setSetBalanceSuccessMessage('');

    // Validate principal
    if (!setPrincipal.trim()) {
      setSetBalanceValidationError('User Principal is required');
      return false;
    }

    try {
      Principal.fromText(setPrincipal.trim());
    } catch (error) {
      setSetBalanceValidationError('Invalid Principal ID format');
      return false;
    }

    // Validate balance
    const numBalance = parseFloat(setBalance);
    if (!setBalance.trim() || isNaN(numBalance)) {
      setSetBalanceValidationError('Target Balance is required and must be a valid number');
      return false;
    }

    if (numBalance < 0) {
      setSetBalanceValidationError('Balance cannot be negative');
      return false;
    }

    return true;
  };

  const handlePrincipalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePrincipalInputs()) {
      return;
    }

    try {
      await creditMutation.mutateAsync({
        userPrincipal: userPrincipal.trim(),
        amount: parseFloat(creditAmount),
      });

      setPrincipalSuccessMessage(`Successfully credited $${parseFloat(creditAmount).toFixed(2)} to user wallet`);
      setUserPrincipal('');
      setCreditAmount('');
    } catch (error: any) {
      console.error('Error crediting wallet:', error);
      const errorMessage = error?.message || 'Failed to credit wallet';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins')) {
        setPrincipalValidationError('Unauthorized: Only admins can credit wallets');
      } else {
        setPrincipalValidationError(errorMessage);
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailInputs()) {
      return;
    }

    try {
      await setBalanceByEmailMutation.mutateAsync({
        email: userEmail.trim(),
        balance: parseFloat(targetBalance),
      });

      setEmailSuccessMessage(`Successfully set wallet balance to $${parseFloat(targetBalance).toFixed(2)} for ${userEmail.trim()}`);
      setUserEmail('');
      setTargetBalance('');
    } catch (error: any) {
      console.error('Error setting wallet balance:', error);
      const errorMessage = error?.message || 'Failed to set wallet balance';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins')) {
        setEmailValidationError('Unauthorized: Only admins can set wallet balances');
      } else if (errorMessage.includes('No user found')) {
        setEmailValidationError('User not found with the provided email address');
      } else {
        setEmailValidationError(errorMessage);
      }
    }
  };

  const handleSetBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSetBalanceInputs()) {
      return;
    }

    try {
      await setBalanceByPrincipalMutation.mutateAsync({
        userPrincipal: setPrincipal.trim(),
        balance: parseFloat(setBalance),
      });

      setSetBalanceSuccessMessage(`Successfully set wallet balance to $${parseFloat(setBalance).toFixed(2)} for user`);
      setSetPrincipal('');
      setSetBalance('');
    } catch (error: any) {
      console.error('Error setting wallet balance:', error);
      const errorMessage = error?.message || 'Failed to set wallet balance';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins')) {
        setSetBalanceValidationError('Unauthorized: Only admins can set wallet balances');
      } else {
        setSetBalanceValidationError(errorMessage);
      }
    }
  };

  const handlePrefillEmailUser = () => {
    setUserEmail('nexaprofit68@gmail.com');
    setTargetBalance('300.00');
    setEmailValidationError('');
    setEmailSuccessMessage('');
  };

  const handlePrefillSpecificUser = () => {
    setSetPrincipal('mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae');
    setSetBalance('300.00');
    setSetBalanceValidationError('');
    setSetBalanceSuccessMessage('');
  };

  // Show loading state while checking admin status
  if (adminCheckLoading || !adminCheckFetched) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader onNavigateToLanding={onNavigateToLanding} onNavigateToProfile={onNavigateToProfile} />
        <main className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        </main>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader onNavigateToLanding={onNavigateToLanding} onNavigateToProfile={onNavigateToProfile} />
        <main className="container py-8">
          <Card className="max-w-2xl mx-auto border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                Unauthorized Access
              </CardTitle>
              <CardDescription>
                You do not have permission to access this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This page is restricted to administrators only. If you believe you should have access, please contact support.
              </p>
              <Button onClick={onNavigateToDashboard} variant="outline">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Show admin credit form with tabs
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} onNavigateToProfile={onNavigateToProfile} />
      
      <main className="container py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold tracking-tight">Admin Wallet Credit</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Credit user wallets or set wallet balances with USD amounts
          </p>
        </div>

        {/* Tabbed Credit Forms */}
        <Card className="max-w-2xl border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              Wallet Management
            </CardTitle>
            <CardDescription>
              Choose between crediting a wallet or setting a specific balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="principal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="principal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Credit by Principal
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Set Balance by Email
                </TabsTrigger>
                <TabsTrigger value="setbalance" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Set Balance by Principal
                </TabsTrigger>
              </TabsList>

              {/* Principal-based Credit Form */}
              <TabsContent value="principal" className="space-y-4 mt-6">
                <form onSubmit={handlePrincipalSubmit} className="space-y-6">
                  {/* User Principal Input */}
                  <div className="space-y-2">
                    <Label htmlFor="userPrincipal">User Principal</Label>
                    <Input
                      id="userPrincipal"
                      type="text"
                      placeholder="e.g., mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae"
                      value={userPrincipal}
                      onChange={(e) => setUserPrincipal(e.target.value)}
                      disabled={creditMutation.isPending}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      The unique Principal ID of the user whose wallet you want to credit
                    </p>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="creditAmount">Credit Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="creditAmount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        disabled={creditMutation.isPending}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The amount in USD to add to the user's wallet balance
                    </p>
                  </div>

                  {/* Validation Error */}
                  {principalValidationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{principalValidationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {principalSuccessMessage && (
                    <Alert className="border-green-500/20 bg-green-500/5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-500">
                        {principalSuccessMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={creditMutation.isPending}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      {creditMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Crediting Wallet...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Credit Wallet
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onNavigateToDashboard}
                      disabled={creditMutation.isPending}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Email-based Balance Set Form */}
              <TabsContent value="email" className="space-y-4 mt-6">
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  {/* User Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="e.g., nexaprofit68@gmail.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={setBalanceByEmailMutation.isPending}
                    />
                    <p className="text-xs text-muted-foreground">
                      The email address associated with the user's profile
                    </p>
                  </div>

                  {/* Target Balance Input */}
                  <div className="space-y-2">
                    <Label htmlFor="targetBalance">Target Balance (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="targetBalance"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={targetBalance}
                        onChange={(e) => setTargetBalance(e.target.value)}
                        disabled={setBalanceByEmailMutation.isPending}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The exact balance to set for the user's wallet (replaces current balance)
                    </p>
                  </div>

                  {/* Validation Error */}
                  {emailValidationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{emailValidationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {emailSuccessMessage && (
                    <Alert className="border-green-500/20 bg-green-500/5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-500">
                        {emailSuccessMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={setBalanceByEmailMutation.isPending}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      {setBalanceByEmailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting Balance...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Set Balance
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrefillEmailUser}
                      disabled={setBalanceByEmailMutation.isPending}
                    >
                      Quick Fill ($300)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onNavigateToDashboard}
                      disabled={setBalanceByEmailMutation.isPending}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Principal-based Balance Set Form */}
              <TabsContent value="setbalance" className="space-y-4 mt-6">
                <form onSubmit={handleSetBalanceSubmit} className="space-y-6">
                  {/* User Principal Input */}
                  <div className="space-y-2">
                    <Label htmlFor="setPrincipal">User Principal</Label>
                    <Input
                      id="setPrincipal"
                      type="text"
                      placeholder="e.g., mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae"
                      value={setPrincipal}
                      onChange={(e) => setSetPrincipal(e.target.value)}
                      disabled={setBalanceByPrincipalMutation.isPending}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      The unique Principal ID of the user whose balance you want to set
                    </p>
                  </div>

                  {/* Target Balance Input */}
                  <div className="space-y-2">
                    <Label htmlFor="setBalance">Target Balance (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="setBalance"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={setBalance}
                        onChange={(e) => setSetBalance(e.target.value)}
                        disabled={setBalanceByPrincipalMutation.isPending}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The exact balance to set for the user's wallet (replaces current balance)
                    </p>
                  </div>

                  {/* Validation Error */}
                  {setBalanceValidationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{setBalanceValidationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {setBalanceSuccessMessage && (
                    <Alert className="border-green-500/20 bg-green-500/5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-500">
                        {setBalanceSuccessMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={setBalanceByPrincipalMutation.isPending}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      {setBalanceByPrincipalMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting Balance...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Set Balance
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrefillSpecificUser}
                      disabled={setBalanceByPrincipalMutation.isPending}
                    >
                      Quick Fill ($300)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onNavigateToDashboard}
                      disabled={setBalanceByPrincipalMutation.isPending}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
