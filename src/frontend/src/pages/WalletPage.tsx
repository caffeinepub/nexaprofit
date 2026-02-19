import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Loader2, AlertCircle, Upload, X, CheckCircle2, UserPlus, Mail } from 'lucide-react';
import { useGetCallerWalletBalance } from '@/hooks/useWallet';
import { useDepositSubmission } from '@/hooks/useDepositSubmission';
import { useDepositEligibility } from '@/hooks/useDepositEligibility';
import { useRegisterUserNumber } from '@/hooks/useRegisterUserNumber';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { formatBalanceUSD } from '@/utils/availableBalance';
import { WalletTransferMethodsList } from '@/components/wallet/WalletTransferMethodsList';
import { consumePostLoginIntent, setPostLoginIntent } from '@/utils/urlParams';

interface WalletPageProps {
  onNavigateToLanding: () => void;
  onNavigateToDashboard: () => void;
  onOpenSignIn: (onSuccess?: () => void) => void;
}

export function WalletPage({ onNavigateToLanding, onNavigateToDashboard, onOpenSignIn }: WalletPageProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Fetch wallet balance from backend
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useGetCallerWalletBalance();
  const balance = balanceData ?? 0;

  // Fetch deposit eligibility
  const { data: eligibility, isLoading: eligibilityLoading, refetch: refetchEligibility } = useDepositEligibility();

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Registration state
  const [registrationStep, setRegistrationStep] = useState<'number' | 'email' | 'ready'>('ready');
  const [uniqueNumber, setUniqueNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  // Deposit submission state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const depositMutation = useDepositSubmission();
  const registerNumberMutation = useRegisterUserNumber();
  const saveProfileMutation = useSaveCallerUserProfile();

  // Check for post-login intent to auto-open deposit dialog
  useEffect(() => {
    const intent = consumePostLoginIntent();
    if (intent && intent.action === 'openDeposit' && isAuthenticated) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        setDepositOpen(true);
      }, 300);
    }
  }, [isAuthenticated]);

  // Determine registration step based on eligibility
  useEffect(() => {
    if (eligibility && !eligibility.isEligible) {
      if (eligibility.requiresNumber) {
        setRegistrationStep('number');
      } else if (eligibility.requiresProfile) {
        setRegistrationStep('email');
        // Pre-fill email if available
        if (userProfile?.email) {
          setEmail(userProfile.email);
        }
      } else {
        setRegistrationStep('ready');
      }
    } else if (eligibility?.isEligible) {
      setRegistrationStep('ready');
    }
  }, [eligibility, userProfile]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValidationError('');
    setSuccessMessage('');

    if (!file) {
      clearFileSelection();
      return;
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (JPEG, PNG, etc.)');
      clearFileSelection();
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setValidationError('Image file size must be less than 10MB');
      clearFileSelection();
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Clear file selection and preview
  const clearFileSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadProgress(0);
    setValidationError('');
  };

  // Handle unique number registration
  const handleRegisterNumber = async () => {
    setRegistrationError('');
    
    const numberValue = parseInt(uniqueNumber, 10);
    if (isNaN(numberValue) || numberValue < 10000 || numberValue > 1000000) {
      setRegistrationError('Please enter a valid number between 10,000 and 1,000,000');
      return;
    }

    try {
      await registerNumberMutation.mutateAsync(numberValue);
      await refetchEligibility();
      setUniqueNumber('');
    } catch (error: any) {
      setRegistrationError(error.message || 'Failed to register number. It may already be taken.');
    }
  };

  // Handle email update
  const handleUpdateEmail = async () => {
    setRegistrationError('');
    
    if (!email.trim() || !email.includes('@')) {
      setRegistrationError('Please enter a valid email address');
      return;
    }

    try {
      await saveProfileMutation.mutateAsync({
        name: userProfile?.name || '',
        email: email.trim(),
        investmentPreference: userProfile?.investmentPreference || '',
      });
      await refetchEligibility();
      setEmail('');
    } catch (error: any) {
      setRegistrationError(error.message || 'Failed to update email');
    }
  };

  // Handle deposit submission
  const handleDepositSubmit = async () => {
    if (!selectedFile) {
      setValidationError('Please select a payment screenshot to upload');
      return;
    }

    setValidationError('');
    setSuccessMessage('');
    setUploadProgress(0);

    try {
      const result = await depositMutation.mutateAsync({
        file: selectedFile,
        onProgress: (percentage) => {
          setUploadProgress(percentage);
        },
      });

      setSuccessMessage(result || 'Deposit request submitted successfully!');
      clearFileSelection();

      // Close dialog after success
      setTimeout(() => {
        setDepositOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error: any) {
      console.error('Deposit submission error:', error);
      setValidationError(error.message || 'Failed to submit deposit. Please try again.');
      setUploadProgress(0);
    }
  };

  // Handle deposit dialog open when not authenticated
  const handleDepositClick = () => {
    if (!isAuthenticated) {
      // Store intent to return to wallet and open deposit after login
      setPostLoginIntent({ route: '/wallet', action: 'openDeposit' });
      onOpenSignIn();
    } else {
      setDepositOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onNavigateToLanding={onNavigateToLanding} />

      <main className="container py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onNavigateToDashboard}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Wallet Balance Card */}
        <Card className="border-red-500/20 bg-gradient-to-br from-background to-red-950/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-500/10 p-3">
                <Wallet className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                <CardDescription>Your available funds</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                <span className="text-muted-foreground">Loading balance...</span>
              </div>
            ) : balanceError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load balance</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  {formatBalanceUSD(balance)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Available for investment</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Deposit Card */}
          <Card className="border-green-500/20 hover:border-green-500/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <ArrowDownToLine className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>Add money to your wallet</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleDepositClick}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    size="lg"
                  >
                    Deposit Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                    <DialogDescription>
                      {registrationStep === 'number' && 'Register your unique number to continue'}
                      {registrationStep === 'email' && 'Add your email to continue'}
                      {registrationStep === 'ready' && 'Upload your payment screenshot to complete the deposit'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Authentication Required */}
                    {!isAuthenticated && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You must be logged in to submit deposits.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Registration Step: Unique Number */}
                    {isAuthenticated && registrationStep === 'number' && (
                      <div className="space-y-4">
                        <Alert>
                          <UserPlus className="h-4 w-4" />
                          <AlertDescription>
                            Please register your unique number before submitting a deposit.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="uniqueNumber">Unique Number (10,000 - 1,000,000)</Label>
                          <Input
                            id="uniqueNumber"
                            type="number"
                            placeholder="Enter your unique number"
                            value={uniqueNumber}
                            onChange={(e) => setUniqueNumber(e.target.value)}
                            min={10000}
                            max={1000000}
                          />
                        </div>

                        {registrationError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{registrationError}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={handleRegisterNumber}
                          disabled={registerNumberMutation.isPending || !uniqueNumber}
                          className="w-full"
                        >
                          {registerNumberMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            'Register Number'
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Registration Step: Email */}
                    {isAuthenticated && registrationStep === 'email' && (
                      <div className="space-y-4">
                        <Alert>
                          <Mail className="h-4 w-4" />
                          <AlertDescription>
                            Please add a valid email address to your profile before submitting a deposit.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        {registrationError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{registrationError}</AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={handleUpdateEmail}
                          disabled={saveProfileMutation.isPending || !email.trim()}
                          className="w-full"
                        >
                          {saveProfileMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Email'
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Ready to Upload */}
                    {isAuthenticated && registrationStep === 'ready' && (
                      <>
                        {/* Transfer Methods */}
                        <div className="space-y-3">
                          <Label>Transfer to one of these addresses:</Label>
                          <WalletTransferMethodsList />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                          <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                          
                          {!selectedFile ? (
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-red-500/50 transition-colors">
                              <Input
                                id="screenshot"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                              <label
                                htmlFor="screenshot"
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  PNG, JPG up to 10MB
                                </span>
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="relative border border-border rounded-lg p-2">
                                {previewUrl && (
                                  <img
                                    src={previewUrl}
                                    alt="Payment screenshot preview"
                                    className="w-full h-48 object-contain rounded"
                                  />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                                  onClick={clearFileSelection}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Upload Progress */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} />
                          </div>
                        )}

                        {/* Validation Error */}
                        {validationError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{validationError}</AlertDescription>
                          </Alert>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                          <Alert className="border-green-500/50 bg-green-500/10">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-500">
                              {successMessage}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                          onClick={handleDepositSubmit}
                          disabled={!selectedFile || depositMutation.isPending || uploadProgress > 0}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                          size="lg"
                        >
                          {depositMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Deposit Request'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Withdraw Card */}
          <Card className="border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-500/10 p-3">
                  <ArrowUpFromLine className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Transfer money out</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500/30 hover:bg-orange-500/10"
                    size="lg"
                  >
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                      Withdrawal functionality coming soon
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
