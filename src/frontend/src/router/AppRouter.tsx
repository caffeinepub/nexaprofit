import { useState } from 'react';
import { useHashRoute } from './useHashRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WalletPage } from '@/pages/WalletPage';
import { InvestmentPlansPage } from '@/pages/InvestmentPlansPage';
import { ProtectedDashboardRoute } from './ProtectedDashboardRoute';
import { InternetIdentityRegistrationDialog } from '@/components/auth/InternetIdentityRegistrationDialog';

export function AppRouter() {
  const { route, navigate } = useHashRoute();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInSuccessCallback, setSignInSuccessCallback] = useState<(() => void) | undefined>(undefined);

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToLanding = () => {
    navigate('/');
  };

  const handleNavigateToWallet = () => {
    navigate('/wallet');
  };

  const handleNavigateToPlans = () => {
    navigate('/plans');
  };

  const handleOpenSignIn = (onSuccess?: () => void) => {
    setSignInSuccessCallback(() => onSuccess);
    setIsSignInOpen(true);
  };

  const handleSignInSuccess = () => {
    // If there's a custom callback, execute it
    if (signInSuccessCallback) {
      signInSuccessCallback();
      setSignInSuccessCallback(undefined);
    } else {
      // Default behavior: navigate to dashboard
      handleNavigateToDashboard();
    }
  };

  return (
    <>
      {route === '/' && (
        <LandingPage
          onNavigateToDashboard={handleNavigateToDashboard}
          onOpenSignIn={handleOpenSignIn}
          onNavigateToPlans={handleNavigateToPlans}
        />
      )}
      {route === '/dashboard' && (
        <ProtectedDashboardRoute
          onNavigateToLanding={handleNavigateToLanding}
          onOpenSignIn={handleOpenSignIn}
        >
          <DashboardPage 
            onNavigateToLanding={handleNavigateToLanding}
            onNavigateToWallet={handleNavigateToWallet}
            onNavigateToPlans={handleNavigateToPlans}
          />
        </ProtectedDashboardRoute>
      )}
      {route === '/wallet' && (
        <ProtectedDashboardRoute
          onNavigateToLanding={handleNavigateToLanding}
          onOpenSignIn={handleOpenSignIn}
        >
          <WalletPage 
            onNavigateToLanding={handleNavigateToLanding}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        </ProtectedDashboardRoute>
      )}
      {route === '/plans' && (
        <InvestmentPlansPage
          onNavigateToDashboard={handleNavigateToDashboard}
          onOpenSignIn={handleOpenSignIn}
        />
      )}
      <InternetIdentityRegistrationDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
}
