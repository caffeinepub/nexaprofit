import { useState, useCallback } from 'react';
import { useHashRoute } from './useHashRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WalletPage } from '@/pages/WalletPage';
import { InvestmentPlansPage } from '@/pages/InvestmentPlansPage';
import { MyProfilePage } from '@/pages/MyProfilePage';
import { ProtectedDashboardRoute } from './ProtectedDashboardRoute';
import { InternetIdentityRegistrationDialog } from '@/components/auth/InternetIdentityRegistrationDialog';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export function AppRouter() {
  const { route, navigate } = useHashRoute();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInSuccessCallback, setSignInSuccessCallback] = useState<(() => void) | undefined>(undefined);

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleNavigateToLanding = () => {
    navigate('/');
  };

  const handleNavigateToWallet = () => {
    navigate('/wallet');
  };

  const handleNavigateToPlans = () => {
    navigate('/plans');
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
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

  // Apply inactivity timeout to all routes except '/' and '/dashboard'
  useInactivityTimeout({
    currentRoute: route,
    onTimeout: handleNavigateToDashboard,
  });

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
            onNavigateToProfile={handleNavigateToProfile}
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
      {route === '/profile' && (
        <ProtectedDashboardRoute
          onNavigateToLanding={handleNavigateToLanding}
          onOpenSignIn={handleOpenSignIn}
        >
          <MyProfilePage 
            onNavigateToLanding={handleNavigateToLanding}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        </ProtectedDashboardRoute>
      )}
      <InternetIdentityRegistrationDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
}
