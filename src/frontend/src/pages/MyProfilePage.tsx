import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Hash, Key, Loader2, AlertCircle } from 'lucide-react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
import { useGetCallerNumber } from '@/hooks/useUniqueNumber';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { ProfileInlineEditField } from '@/components/profile/ProfileInlineEditField';
import type { UserProfile } from '@/backend';

interface MyProfilePageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
}

export function MyProfilePage({ onNavigateToLanding, onNavigateToDashboard }: MyProfilePageProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: uniqueNumber, isLoading: numberLoading, error: numberError } = useGetCallerNumber();
  const saveProfileMutation = useSaveCallerUserProfile();

  const principalId = identity?.getPrincipal().toString() || 'Not available';

  // Helper to build a complete UserProfile with safe defaults
  const buildCompleteProfile = (field: 'name' | 'email', value: string): UserProfile => {
    const currentProfile = userProfile || { name: '', email: '', investmentPreference: '' };
    
    return {
      name: field === 'name' ? value : currentProfile.name,
      email: field === 'email' ? value : currentProfile.email,
      investmentPreference: currentProfile.investmentPreference,
    };
  };

  const handleSaveName = async (name: string) => {
    const profile = buildCompleteProfile('name', name);
    await saveProfileMutation.mutateAsync(profile);
  };

  const handleSaveEmail = async (email: string) => {
    const profile = buildCompleteProfile('email', email);
    await saveProfileMutation.mutateAsync(profile);
  };

  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name cannot be empty';
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return 'Email cannot be empty';
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

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
            View and edit your account information
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
            {profileLoading ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Name
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              </div>
            ) : (
              <ProfileInlineEditField
                label="Name"
                value={userProfile?.name || ''}
                onSave={handleSaveName}
                validate={validateName}
                inputType="text"
                icon={<User className="h-4 w-4" />}
                placeholder="Enter your name"
              />
            )}

            {/* Email */}
            {profileLoading ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
              </div>
            ) : (
              <ProfileInlineEditField
                label="Email"
                value={userProfile?.email || ''}
                onSave={handleSaveEmail}
                validate={validateEmail}
                inputType="email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
              />
            )}

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
