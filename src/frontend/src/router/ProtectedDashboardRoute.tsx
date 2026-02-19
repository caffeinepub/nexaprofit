import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useEnsureRegisteredUser } from '@/hooks/useEnsureRegisteredUser';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';

interface ProtectedDashboardRouteProps {
  children: ReactNode;
  onNavigateToLanding: () => void;
  onOpenSignIn: (onSuccess?: () => void) => void;
}

export function ProtectedDashboardRoute({
  children,
  onNavigateToLanding,
  onOpenSignIn,
}: ProtectedDashboardRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { isRegistering, isRegistered } = useEnsureRegisteredUser();

  // Show loading while checking auth state or registering user
  if (isInitializing || (identity && isRegistering)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-muted-foreground">
            {isRegistering ? 'Setting up your account...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show sign-in prompt
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="rounded-full bg-red-500/10 p-4 w-20 h-20 mx-auto flex items-center justify-center">
            <LogIn className="h-10 w-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">
              Please sign in to access the dashboard and start managing your investments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => onOpenSignIn()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              size="lg"
            >
              Sign In
            </Button>
            <Button
              onClick={onNavigateToLanding}
              variant="outline"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and registered, render the protected content
  return <>{children}</>;
}
