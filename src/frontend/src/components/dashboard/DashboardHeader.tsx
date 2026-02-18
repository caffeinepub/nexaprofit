import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, User } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  onNavigateToLanding: () => void;
  onNavigateToProfile?: () => void;
}

export function DashboardHeader({ onNavigateToLanding, onNavigateToProfile }: DashboardHeaderProps) {
  const { clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await clear();
      queryClient.clear();
      onNavigateToLanding();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/1771048883652-8.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            NexaProfit Secure
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onNavigateToProfile && (
            <Button
              onClick={onNavigateToProfile}
              variant="ghost"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              My Profile
            </Button>
          )}
          <Button
            onClick={handleSignOut}
            disabled={isLoggingOut || isLoggingIn}
            variant="outline"
            className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
