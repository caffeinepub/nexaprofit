import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Hash, Key, Loader2, AlertCircle } from 'lucide-react';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useGetCallerNumber } from '@/hooks/useUniqueNumber';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface MyProfilePageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
}

export function MyProfilePage({ onNavigateToLanding, onNavigateToDashboard }: MyProfilePageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: uniqueNumber, isLoading: numberLoading, error: numberError } = useGetCallerNumber();

  const principalId = identity?.getPrincipal().toString() || 'Not available';

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} />

      <main className="container py-8 space-y-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onNavigateToDashboard}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-lg">
            View your account information and unique identifier
          </p>
        </div>

        {/* Profile Information Card */}
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-red-500" />
              Profile Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Name
              </div>
              {profileLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              ) : (
                <div className="text-lg font-semibold">
                  {userProfile?.name || 'Not set'}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              {profileLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              ) : (
                <div className="text-lg font-semibold break-all">
                  {userProfile?.email || 'Not set'}
                </div>
              )}
            </div>

            {/* UID (Principal) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Key className="h-4 w-4" />
                UID (Principal)
              </div>
              <div className="text-sm font-mono bg-muted/50 p-3 rounded-md break-all">
                {principalId}
              </div>
            </div>

            {/* Unique Number */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="h-4 w-4" />
                Unique Number
              </div>
              {numberLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              ) : numberError || uniqueNumber === null || uniqueNumber === undefined ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Not assigned yet</span>
                </div>
              ) : (
                <div className="text-2xl font-bold text-red-500">
                  {uniqueNumber.toString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Quick Navigation</CardTitle>
              <CardDescription>Navigate to other sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={onNavigateToDashboard}
                variant="outline"
                className="w-full justify-start"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button
                onClick={onNavigateToLanding}
                variant="outline"
                className="w-full justify-start"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Account Security</CardTitle>
              <CardDescription>Your account is secured with Internet Identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Cryptographic authentication</p>
                <p>✓ No passwords required</p>
                <p>✓ Decentralized identity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
