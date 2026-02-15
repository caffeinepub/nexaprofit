import { useEffect, useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isLoginSuccess = loginStatus === 'success' && !!identity;

  // Handle login errors
  useEffect(() => {
    if (isLoginError && loginError) {
      setErrorMessage(loginError.message || 'Authentication failed. Please try again.');
    }
  }, [isLoginError, loginError]);

  // Navigate to dashboard on successful login
  useEffect(() => {
    if (isLoginSuccess) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoginSuccess, onOpenChange, onSuccess]);

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
    // If user is already authenticated, navigate to dashboard instead of retrying login
    if (identity) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isLoginSuccess ? 'Welcome!' : 'Get Started'}
          </DialogTitle>
          <DialogDescription>
            {isLoginSuccess
              ? 'You have successfully signed in to your account.'
              : 'Sign in or create an account to access the NexaProfit platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success State */}
          {isLoginSuccess && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-center text-muted-foreground">
                Authentication successful! Redirecting...
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoggingIn && !isLoginSuccess && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
              <p className="text-center text-muted-foreground">
                Connecting to Internet Identity...
              </p>
            </div>
          )}

          {/* Error State */}
          {errorMessage && !isLoggingIn && !isLoginSuccess && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Initial/Error State - Show Login Button */}
          {!isLoggingIn && !isLoginSuccess && (
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
                {errorMessage ? 'Open Dashboard' : 'Sign In with Internet Identity'}
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
