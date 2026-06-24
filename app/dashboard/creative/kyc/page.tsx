'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input, FileUploader, MultiStepWizard, Card, CardContent } from '@/components/ui';
import type { WizardStep } from '@/components/ui/multi-step-wizard';
import type { UploadedFile } from '@/components/ui/file-uploader';
import { kycService, KycStatus } from '@/services/kyc.service';
import { uploadService } from '@/services/upload.service';

export default function KYCPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  useEffect(() => {
    kycService
      .getKycStatus()
      .then(setKycStatus)
      .catch(() => setKycStatus(null))
      .finally(() => setIsStatusLoading(false));
  }, []);

  // Personal Information
  const [nationalId, setNationalId] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Documents
  const [idFrontFiles, setIdFrontFiles] = useState<File[]>([]);
  const [idBackFiles, setIdBackFiles] = useState<File[]>([]);
  const [kraCertFiles, setKraCertFiles] = useState<File[]>([]);

  // Social Media
  const [instagram, setInstagram] = useState('');
  const [instagramFollowers, setInstagramFollowers] = useState(0);
  const [tiktok, setTiktok] = useState('');
  const [tiktokFollowers, setTiktokFollowers] = useState(0);
  const [youtube, setYoutube] = useState('');
  const [youtubeFollowers, setYoutubeFollowers] = useState(0);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const isResubmit = kycStatus?.status === 'REJECTED';

  const handleComplete = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const [idFrontUpload, idBackUpload, kraCertUpload] = await Promise.all([
        uploadService.uploadFile(idFrontFiles[0], undefined, 'KYC_ID_FRONT'),
        uploadService.uploadFile(idBackFiles[0], undefined, 'KYC_ID_BACK'),
        uploadService.uploadFile(kraCertFiles[0], undefined, 'KYC_KRA_CERT'),
      ]);

      const data = {
        nationalId,
        kraPin,
        phone,
        city,
        dateOfBirth,
        idFrontUrl: idFrontUpload.url,
        idBackUrl: idBackUpload.url,
        kraCertUrl: kraCertUpload.url,
        bio: '',
        categories: [] as string[],
        instagram: instagram || undefined,
        instagramFollowers: instagramFollowers || undefined,
        tiktok: tiktok || undefined,
        tiktokFollowers: tiktokFollowers || undefined,
        youtube: youtube || undefined,
        youtubeFollowers: youtubeFollowers || undefined,
      };

      if (isResubmit) {
        await kycService.resubmitKyc(data);
      } else {
        await kycService.submitKyc(data);
      }
      router.push('/dashboard/creative?kyc=submitted');
    } catch (error) {
      console.error('Failed to submit KYC:', error);
      setSubmitError('Failed to submit KYC verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: WizardStep[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Basic details',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-brand-blue/10 rounded-full mb-4">
              <Shield className="h-12 w-12 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verify Your Identity</h2>
            <p className="text-muted-foreground">
              Complete KYC verification to start earning on the platform
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <Input
              label="National ID Number"
              type="text"
              placeholder="Enter your national ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
            />

            <Input
              label="KRA PIN"
              type="text"
              placeholder="e.g., A123456789Z"
              value={kraPin}
              onChange={(e) => setKraPin(e.target.value.toUpperCase())}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+254712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="City"
                type="text"
                placeholder="e.g., Nairobi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>
        </div>
      ),
      isValid: !!(nationalId && kraPin && phone && city && dateOfBirth),
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: 'ID & KRA certificate',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-brand-blue/10 rounded-full mb-4">
              <Upload className="h-12 w-12 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Your Documents</h2>
            <p className="text-muted-foreground">
              We need clear photos of your ID and KRA certificate
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                National ID - Front Side
              </label>
              <FileUploader
                onFileSelect={(files) => setIdFrontFiles(files)}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                preview={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                National ID - Back Side
              </label>
              <FileUploader
                onFileSelect={(files) => setIdBackFiles(files)}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                preview={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                KRA PIN Certificate
              </label>
              <FileUploader
                onFileSelect={(files) => setKraCertFiles(files)}
                accept="image/*,application/pdf"
                maxSize={5 * 1024 * 1024}
                preview={true}
              />
            </div>
          </div>
        </div>
      ),
      isValid: idFrontFiles.length > 0 && idBackFiles.length > 0 && kraCertFiles.length > 0,
    },
    {
      id: 'social-media',
      title: 'Social Media',
      description: 'Your profiles',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-brand-blue/10 rounded-full mb-4">
              <FileText className="h-12 w-12 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Social Media</h2>
            <p className="text-muted-foreground">
              Link your social profiles to showcase your reach
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="space-y-2">
              <Input
                label="Instagram Username"
                type="text"
                placeholder="@yourusername"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                required
              />
              <Input
                label="Instagram Followers"
                type="number"
                placeholder="0"
                value={instagramFollowers || ''}
                onChange={(e) => setInstagramFollowers(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="TikTok Username"
                type="text"
                placeholder="@yourusername"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                required
              />
              <Input
                label="TikTok Followers"
                type="number"
                placeholder="0"
                value={tiktokFollowers || ''}
                onChange={(e) => setTiktokFollowers(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="YouTube Channel (Optional)"
                type="text"
                placeholder="@yourchannel"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
              />
              {youtube && (
                <Input
                  label="YouTube Subscribers"
                  type="number"
                  placeholder="0"
                  value={youtubeFollowers || ''}
                  onChange={(e) => setYoutubeFollowers(parseInt(e.target.value) || 0)}
                />
              )}
            </div>
          </div>
        </div>
      ),
      isValid: !!(instagram && instagramFollowers > 0 && tiktok && tiktokFollowers > 0),
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Confirm details',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Review Your Information</h2>
            <p className="text-muted-foreground">
              Please verify all details before submitting
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">National ID:</span>
                      <span className="font-medium">{nationalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">KRA PIN:</span>
                      <span className="font-medium">{kraPin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span className="font-medium">{city}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>National ID (Front & Back)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>KRA PIN Certificate</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Social Media</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instagram:</span>
                      <span className="font-medium">{instagram} ({instagramFollowers.toLocaleString()} followers)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TikTok:</span>
                      <span className="font-medium">{tiktok} ({tiktokFollowers.toLocaleString()} followers)</span>
                    </div>
                    {youtube && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">YouTube:</span>
                        <span className="font-medium">{youtube} ({youtubeFollowers.toLocaleString()} subscribers)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I confirm that all information provided is accurate and I agree to the{' '}
                <a href="/terms" className="text-brand-blue hover:underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="text-brand-blue hover:underline">Privacy Policy</a>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <p>Your KYC application will be reviewed by our team within 24-48 hours. You'll receive an email notification once your verification is complete.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: termsAccepted,
    },
  ];

  if (isStatusLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Checking verification status...
      </div>
    );
  }

  if (kycStatus && (kycStatus.status === 'PENDING' || kycStatus.status === 'SUBMITTED' || kycStatus.status === 'VERIFIED')) {
    const isVerified = kycStatus.status === 'VERIFIED';
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className={`inline-flex p-4 rounded-full mb-4 ${isVerified ? 'bg-green-100' : 'bg-brand-blue/10'}`}>
          {isVerified ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <Shield className="h-12 w-12 text-brand-blue" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {isVerified ? 'Identity Verified' : 'Verification In Progress'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isVerified
            ? 'Your identity has been verified. You can now start earning on the platform.'
            : "Your KYC submission is under review. We'll notify you once it's complete, usually within 24-48 hours."}
        </p>
        <Button variant="brand" onClick={() => router.push('/dashboard/creative')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {kycStatus?.status === 'REJECTED' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          <p className="font-medium mb-1">Your previous submission was rejected</p>
          <p>{kycStatus.adminComments || 'Please review your information and resubmit.'}</p>
        </div>
      )}
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}
      <MultiStepWizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
