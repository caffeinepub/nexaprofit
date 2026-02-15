import { useState } from 'react';
import { useHashRoute } from './useHashRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WalletPage } from '@/pages/WalletPage';
import { ProtectedDashboardRoute } from './ProtectedDashboardRoute';
import { InternetIdentityRegistrationDialog } from '@/components/auth/InternetIdentityRegistrationDialog';

export function AppRouter() {
  const { route, navigate } = useHashRoute();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToLanding = () => {
    navigate('/');
  };

  const handleNavigateToWallet = () => {
    navigate('/wallet');
  };

  const handleOpenSignIn = () => {
    setIsSignInOpen(true);
  };

  return (
    <>
      {route === '/' && (
        <LandingPage
          onNavigateToDashboard={handleNavigateToDashboard}
          onOpenSignIn={handleOpenSignIn}
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
      <InternetIdentityRegistrationDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleNavigateToDashboard}
      />
    </>
  );
}
