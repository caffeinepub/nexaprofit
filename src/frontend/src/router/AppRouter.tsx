import { useState, useCallback } from 'react';
import { useHashRoute } from './useHashRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WalletPage } from '@/pages/WalletPage';
import { InvestmentPlansPage } from '@/pages/InvestmentPlansPage';
import { MyProfilePage } from '@/pages/MyProfilePage';
import { AdminWalletCreditPage } from '@/pages/AdminWalletCreditPage';
import { ProtectedDashboardRoute } from './ProtectedDashboardRoute';
import { InternetIdentityRegistrationDialog } from '@/components/auth/InternetIdentityRegistrationDialog';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { consumePostLoginIntent, setPostLoginIntent } from '@/utils/urlParams';

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

  const handleNavigateToAdminWalletCredit = () => {
    navigate('/admin/wallet-credit');
  };

  const handleOpenSignIn = (onSuccess?: () => void) => {
    setSignInSuccessCallback(() => onSuccess);
    setIsSignInOpen(true);
  };

  const handleSignInSuccess = () => {
    // Check for post-login intent first
    const intent = consumePostLoginIntent();
    
    if (intent) {
      // Navigate to the intended route
      navigate(intent.route);
      
      // If there's a custom callback from the intent, execute it
      if (signInSuccessCallback) {
        // Small delay to ensure navigation completes
        setTimeout(() => {
          if (signInSuccessCallback) {
            signInSuccessCallback();
          }
        }, 100);
      }
      
      setSignInSuccessCallback(undefined);
      return;
    }

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
            onNavigateToAdminWalletCredit={handleNavigateToAdminWalletCredit}
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
            onOpenSignIn={handleOpenSignIn}
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
      {route === '/admin/wallet-credit' && (
        <ProtectedDashboardRoute
          onNavigateToLanding={handleNavigateToLanding}
          onOpenSignIn={handleOpenSignIn}
        >
          <AdminWalletCreditPage 
            onNavigateToLanding={handleNavigateToLanding}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToProfile={handleNavigateToProfile}
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
