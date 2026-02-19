import { useEffect, useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useEnsureRegisteredUser } from '@/hooks/useEnsureRegisteredUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InternetIdentityRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InternetIdentityRegistrationDialog({
  open,
  onOpenChange,
  onSuccess,
}: InternetIdentityRegistrationDialogProps) {
  const { login, loginStatus, identity, isLoginError, isLoggingIn, loginError } = useInternetIdentity();
  const { isRegistering, isRegistered, registrationError } = useEnsureRegisteredUser();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isLoginSuccess = loginStatus === 'success' && !!identity;
  const isFullyComplete = isLoginSuccess && isRegistered && !isRegistering;

  // Handle login errors
  useEffect(() => {
    if (isLoginError && loginError) {
      setErrorMessage(loginError.message || 'Authentication failed. Please try again.');
    }
  }, [isLoginError, loginError]);

  // Handle registration errors
  useEffect(() => {
    if (registrationError) {
      setErrorMessage('Failed to complete registration. Please try again.');
    }
  }, [registrationError]);

  // Navigate on successful login AND registration
  useEffect(() => {
    if (isFullyComplete) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFullyComplete, onOpenChange, onSuccess]);

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleTryAgain = () => {
    // If user is already authenticated and registered, navigate to success callback
    if (identity && isRegistered) {
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
      return;
    }
    
    // Otherwise, retry login
    setErrorMessage('');
    handleLogin();
  };

  // Determine current state message
  const getStatusMessage = () => {
    if (isFullyComplete) {
      return 'Registration complete! Redirecting...';
    }
    if (isRegistering) {
      return 'Setting up your account...';
    }
    if (isLoggingIn) {
      return 'Connecting to Internet Identity...';
    }
    return '';
  };

  const statusMessage = getStatusMessage();
  const showLoading = (isLoggingIn || isRegistering) && !isFullyComplete;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isFullyComplete ? 'Welcome!' : 'Sign In'}
          </DialogTitle>
          <DialogDescription>
            {isFullyComplete
              ? 'You have successfully signed in to your account.'
              : 'Sign in or create an account to access the NexaProfit platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success State */}
          {isFullyComplete && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-center text-muted-foreground">
                {statusMessage}
              </p>
            </div>
          )}

          {/* Loading State */}
          {showLoading && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
              <p className="text-center text-muted-foreground">
                {statusMessage}
              </p>
            </div>
          )}

          {/* Error State */}
          {errorMessage && !showLoading && !isFullyComplete && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Initial/Error State - Show Login Button */}
          {!showLoading && !isFullyComplete && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-500/10 p-2">
                    <LogIn className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Internet Identity</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure blockchain authentication
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Internet Identity provides secure, anonymous authentication without passwords.
                  {!errorMessage && ' Click below to sign in or create a new account.'}
                </p>
              </div>

              <Button
                onClick={errorMessage ? handleTryAgain : handleLogin}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                size="lg"
              >
                {errorMessage ? 'Continue' : 'Sign In with Internet Identity'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
