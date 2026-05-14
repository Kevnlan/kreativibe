'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Shield, User, Link as LinkIcon } from 'lucide-react';
import { Button, Input, Card, CardContent, MultiStepWizard } from '@/components/ui';
import type { WizardStep } from '@/components/ui/multi-step-wizard';
import { useUser } from '@/contexts/AuthContext';
import { uploadService } from '@/services/upload.service';
import { kycService } from '@/services/kyc.service';

interface KYCData {
  // Step 1: KYC Documents
  nationalId: string;
  kraPin: string;
  idFrontFile?: File;
  idBackFile?: File;
  kraCertFile?: File;
  phone: string;
  city: string;
  dateOfBirth: string;
  
  // Step 2: Profile Setup
  bio: string;
  categories: string[];
  portfolioSamples: File[];
  
  // Step 3: Social Media
  instagram: string;
  instagramFollowers: number;
  tiktok: string;
  tiktokFollowers: number;
  youtube: string;
  youtubeFollowers: number;
  facebook: string;
  twitter: string;
  
  termsAccepted: boolean;
}

const CATEGORIES = [
  'Fashion', 'Beauty', 'Food & Beverage', 'Travel', 'Fitness & Health',
  'Technology', 'Lifestyle', 'Entertainment', 'Business', 'Education', 'Other'
];

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [kycData, setKycData] = useState<Partial<KYCData>>({
    categories: [],
    portfolioSamples: [],
    termsAccepted: false,
  });

  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [idBackPreview, setIdBackPreview] = useState<string>('');
  const [kraCertPreview, setKraCertPreview] = useState<string>('');

  const handleFileUpload = (file: File, field: 'idFrontFile' | 'idBackFile' | 'kraCertFile') => {
    setKycData(prev => ({ ...prev, [field]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (field === 'idFrontFile') setIdFrontPreview(result);
      if (field === 'idBackFile') setIdBackPreview(result);
      if (field === 'kraCertFile') setKraCertPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryToggle = (category: string) => {
    setKycData(prev => {
      const categories = prev.categories || [];
      if (categories.includes(category)) {
        return { ...prev, categories: categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...categories, category] };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let idFrontUrl = '';
      let idBackUrl = '';
      let kraCertUrl = '';
      const portfolioUrls: string[] = [];

      if (kycData.idFrontFile) {
        const r = await uploadService.uploadFile(kycData.idFrontFile);
        idFrontUrl = r.url;
      }
      if (kycData.idBackFile) {
        const r = await uploadService.uploadFile(kycData.idBackFile);
        idBackUrl = r.url;
      }
      if (kycData.kraCertFile) {
        const r = await uploadService.uploadFile(kycData.kraCertFile);
        kraCertUrl = r.url;
      }
      for (const file of kycData.portfolioSamples || []) {
        const r = await uploadService.uploadFile(file);
        portfolioUrls.push(r.url);
      }

      await kycService.submitKyc({
        nationalId: kycData.nationalId!,
        kraPin: kycData.kraPin!,
        phone: kycData.phone!,
        city: kycData.city!,
        dateOfBirth: kycData.dateOfBirth!,
        idFrontUrl,
        idBackUrl,
        kraCertUrl,
        bio: kycData.bio!,
        categories: kycData.categories!,
        portfolioUrls,
        instagram: kycData.instagram,
        instagramFollowers: kycData.instagramFollowers,
        tiktok: kycData.tiktok,
        tiktokFollowers: kycData.tiktokFollowers,
        youtube: kycData.youtube,
        youtubeFollowers: kycData.youtubeFollowers,
        facebook: kycData.facebook,
        twitter: kycData.twitter,
      });

      router.push('/dashboard/creative?kyc=submitted');
    } catch (error: any) {
      console.error('KYC submission failed:', error);
      alert(error?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: WizardStep[] = [
    {
      id: 'kyc-documents',
      title: 'KYC Documents',
      description: 'Verify your identity',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Why we need this</h3>
                <p className="text-sm text-blue-800">
                  We verify all creators to ensure trust and safety on our platform. Your documents are encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="National ID Number"
              type="text"
              placeholder="12345678"
              value={kycData.nationalId || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, nationalId: e.target.value }))}
              required
            />
            <Input
              label="KRA PIN"
              type="text"
              placeholder="A123456789X"
              value={kycData.kraPin || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, kraPin: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="0712345678"
              value={kycData.phone || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            <Input
              label="City"
              type="text"
              placeholder="Nairobi"
              value={kycData.city || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={kycData.dateOfBirth || ''}
            onChange={(e) => setKycData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Upload Documents</h3>
            
            {/* ID Front */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                National ID - Front Side *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
                {idFrontPreview ? (
                  <div className="relative">
                    <img src={idFrontPreview} alt="ID Front" className="max-h-48 mx-auto rounded" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIdFrontPreview('');
                        setKycData(prev => ({ ...prev, idFrontFile: undefined }));
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'idFrontFile')}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* ID Back */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                National ID - Back Side *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
                {idBackPreview ? (
                  <div className="relative">
                    <img src={idBackPreview} alt="ID Back" className="max-h-48 mx-auto rounded" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIdBackPreview('');
                        setKycData(prev => ({ ...prev, idBackFile: undefined }));
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'idBackFile')}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* KRA Certificate */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                KRA PIN Certificate *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
                {kraCertPreview ? (
                  <div className="relative">
                    <img src={kraCertPreview} alt="KRA Certificate" className="max-h-48 mx-auto rounded" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setKraCertPreview('');
                        setKycData(prev => ({ ...prev, kraCertFile: undefined }));
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'kraCertFile')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'profile-setup',
      title: 'Profile Setup',
      description: 'Tell us about yourself',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio *
            </label>
            <textarea
              rows={4}
              placeholder="Tell brands about yourself, your style, and what makes your content unique..."
              value={kycData.bio || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(kycData.bio || '').length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content Categories * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    kycData.categories?.includes(category)
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                      : 'border-border hover:border-brand-blue/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Portfolio Samples (Optional)
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              Upload 3-5 of your best content pieces to showcase your work
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
              <label className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload portfolio samples</p>
                <p className="text-xs text-muted-foreground mt-1">Images or videos, up to 10MB each</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setKycData(prev => ({ ...prev, portfolioSamples: files }));
                  }}
                />
              </label>
            </div>
            {kycData.portfolioSamples && kycData.portfolioSamples.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                {kycData.portfolioSamples.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'social-media',
      title: 'Social Media',
      description: 'Connect your accounts',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex gap-3">
              <LinkIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Connect your social media</h3>
                <p className="text-sm text-purple-800">
                  Link your accounts to show brands your reach and engagement. At least one platform is required.
                </p>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">
                IG
              </div>
              Instagram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Username"
                type="text"
                placeholder="@yourusername"
                value={kycData.instagram || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, instagram: e.target.value }))}
              />
              <Input
                label="Followers"
                type="number"
                placeholder="10000"
                value={kycData.instagramFollowers || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, instagramFollowers: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* TikTok */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">
                TT
              </div>
              TikTok
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Username"
                type="text"
                placeholder="@yourusername"
                value={kycData.tiktok || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, tiktok: e.target.value }))}
              />
              <Input
                label="Followers"
                type="number"
                placeholder="50000"
                value={kycData.tiktokFollowers || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, tiktokFollowers: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* YouTube */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs">
                YT
              </div>
              YouTube
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Channel URL"
                type="text"
                placeholder="youtube.com/@yourchannel"
                value={kycData.youtube || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, youtube: e.target.value }))}
              />
              <Input
                label="Subscribers"
                type="number"
                placeholder="5000"
                value={kycData.youtubeFollowers || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, youtubeFollowers: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Facebook & Twitter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Facebook (Optional)"
              type="text"
              placeholder="facebook.com/yourpage"
              value={kycData.facebook || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, facebook: e.target.value }))}
            />
            <Input
              label="Twitter/X (Optional)"
              type="text"
              placeholder="@yourusername"
              value={kycData.twitter || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, twitter: e.target.value }))}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <input
              type="checkbox"
              id="terms"
              checked={kycData.termsAccepted}
              onChange={(e) => setKycData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-foreground">
              I confirm that all information provided is accurate and I agree to Kreativibe's{' '}
              <a href="/terms" className="text-brand-blue hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-brand-blue hover:underline">Privacy Policy</a>
            </label>
          </div>
        </div>
      ),
    },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return kycData.nationalId && kycData.kraPin && kycData.idFrontFile && kycData.idBackFile && kycData.kraCertFile && kycData.phone && kycData.city && kycData.dateOfBirth;
      case 1:
        return kycData.bio && kycData.categories && kycData.categories.length > 0;
      case 2:
        return kycData.termsAccepted && (kycData.instagram || kycData.tiktok || kycData.youtube);
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/dashboard/creative')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Skip for now
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Creator Profile</h1>
          <p className="text-muted-foreground">
            Get verified to start earning from your content. This takes about 5 minutes.
          </p>
        </div>

        {/* Wizard */}
        <MultiStepWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleSubmit}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              loading={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit for Verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
