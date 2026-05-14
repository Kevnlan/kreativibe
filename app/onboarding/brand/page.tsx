'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Building2, FileText, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Card, CardContent, MultiStepWizard } from '@/components/ui';
import type { WizardStep } from '@/components/ui/multi-step-wizard';
import { useUser } from '@/contexts/AuthContext';
import { uploadService } from '@/services/upload.service';
import { brandService } from '@/services/brand.service';

interface BrandKYCData {
  // Step 1: Business Details
  companyName: string;
  industry: string;
  registrationNumber: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  contactEmail: string;
  
  // Step 2: KYC Documents
  registrationCertFile?: File;
  taxComplianceFile?: File;
  contactPersonName: string;
  contactPersonId: string;
  contactPersonRole: string;
  
  // Step 3: Profile
  logoFile?: File;
  coverImageFile?: File;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  
  termsAccepted: boolean;
}

const INDUSTRIES = [
  'Retail & E-commerce',
  'Food & Beverage',
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Technology',
  'Healthcare',
  'Education',
  'Real Estate',
  'Automotive',
  'Entertainment',
  'Financial Services',
  'Hospitality & Tourism',
  'Other',
];

export default function BrandOnboardingPage() {
  const router = useRouter();
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [kycData, setKycData] = useState<Partial<BrandKYCData>>({
    termsAccepted: false,
  });

  const [regCertPreview, setRegCertPreview] = useState<string>('');
  const [taxCompliancePreview, setTaxCompliancePreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const handleFileUpload = (
    file: File,
    field: 'registrationCertFile' | 'taxComplianceFile' | 'logoFile' | 'coverImageFile'
  ) => {
    setKycData(prev => ({ ...prev, [field]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (field === 'registrationCertFile') setRegCertPreview(result);
      if (field === 'taxComplianceFile') setTaxCompliancePreview(result);
      if (field === 'logoFile') setLogoPreview(result);
      if (field === 'coverImageFile') setCoverPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let logoUrl = '';
      let coverImageUrl = '';
      let registrationCertUrl = '';
      let taxComplianceUrl = '';

      if (kycData.logoFile) {
        const r = await uploadService.uploadFile(kycData.logoFile);
        logoUrl = r.url;
      }
      if (kycData.coverImageFile) {
        const r = await uploadService.uploadFile(kycData.coverImageFile);
        coverImageUrl = r.url;
      }
      if (kycData.registrationCertFile) {
        const r = await uploadService.uploadFile(kycData.registrationCertFile);
        registrationCertUrl = r.url;
      }
      if (kycData.taxComplianceFile) {
        const r = await uploadService.uploadFile(kycData.taxComplianceFile);
        taxComplianceUrl = r.url;
      }

      await brandService.submitBrandProfile({
        companyName: kycData.companyName!,
        industry: kycData.industry!,
        description: kycData.description!,
        address: kycData.address!,
        city: kycData.city!,
        phone: kycData.phone!,
        contactEmail: kycData.contactEmail!,
        registrationNumber: kycData.registrationNumber,
        contactPersonName: kycData.contactPersonName!,
        contactPersonId: kycData.contactPersonId!,
        contactPersonRole: kycData.contactPersonRole!,
        logoUrl,
        coverImageUrl,
        website: kycData.website,
        instagram: kycData.instagram,
        facebook: kycData.facebook,
        twitter: kycData.twitter,
        linkedin: kycData.linkedin,
        registrationCertUrl,
        taxComplianceUrl,
      });

      router.push('/dashboard/brand?verification=submitted');
    } catch (error: any) {
      console.error('Brand KYC submission failed:', error);
      alert(error?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: WizardStep[] = [
    {
      id: 'business-details',
      title: 'Business Details',
      description: 'Tell us about your company',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Brand Verification</h3>
                <p className="text-sm text-blue-800">
                  We verify all brands to ensure quality partnerships for our creators. This helps build trust in our marketplace.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Company Name"
            type="text"
            placeholder="Your Company Ltd"
            value={kycData.companyName || ''}
            onChange={(e) => setKycData(prev => ({ ...prev, companyName: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Industry *
              </label>
              <select
                value={kycData.industry || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Registration Number"
              type="text"
              placeholder="PVT-123456 (Optional for unregistered SMEs)"
              value={kycData.registrationNumber || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, registrationNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe your business, products/services, and target market..."
              value={kycData.description || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              required
            />
          </div>

          <Input
            label="Business Address"
            type="text"
            placeholder="123 Main Street, Building Name"
            value={kycData.address || ''}
            onChange={(e) => setKycData(prev => ({ ...prev, address: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              placeholder="Nairobi"
              value={kycData.city || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="0712345678"
              value={kycData.phone || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Contact Email"
            type="email"
            placeholder="contact@yourcompany.com"
            value={kycData.contactEmail || ''}
            onChange={(e) => setKycData(prev => ({ ...prev, contactEmail: e.target.value }))}
            required
          />
        </div>
      ),
    },
    {
      id: 'kyc-documents',
      title: 'KYC Documents',
      description: 'Verify your business',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Document Verification</h3>
                <p className="text-sm text-green-800">
                  Upload your business documents for verification. For unregistered SMEs, you can skip the registration certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Registration Certificate */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Registration Certificate (Optional for SMEs)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
              {regCertPreview ? (
                <div className="relative">
                  <img src={regCertPreview} alt="Registration Certificate" className="max-h-48 mx-auto rounded" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRegCertPreview('');
                      setKycData(prev => ({ ...prev, registrationCertFile: undefined }));
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
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'registrationCertFile')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Tax Compliance */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tax Compliance Certificate *
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
              {taxCompliancePreview ? (
                <div className="relative">
                  <img src={taxCompliancePreview} alt="Tax Compliance" className="max-h-48 mx-auto rounded" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTaxCompliancePreview('');
                      setKycData(prev => ({ ...prev, taxComplianceFile: undefined }));
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
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'taxComplianceFile')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Contact Person Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Person Details</h3>
            
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={kycData.contactPersonName || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, contactPersonName: e.target.value }))}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="National ID"
                type="text"
                placeholder="12345678"
                value={kycData.contactPersonId || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, contactPersonId: e.target.value }))}
                required
              />
              <Input
                label="Role/Position"
                type="text"
                placeholder="CEO, Marketing Manager, etc."
                value={kycData.contactPersonRole || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, contactPersonRole: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'brand-profile',
      title: 'Brand Profile',
      description: 'Complete your profile',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ImageIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Brand Identity</h3>
                <p className="text-sm text-purple-800">
                  Add your logo and cover image to make your brand stand out to creators.
                </p>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Brand Logo *
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="Logo" className="max-h-32 mx-auto rounded" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogoPreview('');
                      setKycData(prev => ({ ...prev, logoFile: undefined }));
                    }}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload your logo</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG (Square, min 200x200px)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logoFile')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
              {coverPreview ? (
                <div className="relative">
                  <img src={coverPreview} alt="Cover" className="max-h-48 mx-auto rounded" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCoverPreview('');
                      setKycData(prev => ({ ...prev, coverImageFile: undefined }));
                    }}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload cover image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG (1200x400px recommended)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'coverImageFile')}
                  />
                </label>
              )}
            </div>
          </div>

          <Input
            label="Website"
            type="url"
            placeholder="https://yourcompany.com"
            value={kycData.website || ''}
            onChange={(e) => setKycData(prev => ({ ...prev, website: e.target.value }))}
          />

          {/* Social Media Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Social Media (Optional)</h3>
            
            <Input
              label="Instagram"
              type="text"
              placeholder="@yourbrand"
              value={kycData.instagram || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, instagram: e.target.value }))}
            />

            <Input
              label="Facebook"
              type="text"
              placeholder="facebook.com/yourbrand"
              value={kycData.facebook || ''}
              onChange={(e) => setKycData(prev => ({ ...prev, facebook: e.target.value }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Twitter/X"
                type="text"
                placeholder="@yourbrand"
                value={kycData.twitter || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, twitter: e.target.value }))}
              />
              <Input
                label="LinkedIn"
                type="text"
                placeholder="linkedin.com/company/yourbrand"
                value={kycData.linkedin || ''}
                onChange={(e) => setKycData(prev => ({ ...prev, linkedin: e.target.value }))}
              />
            </div>
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
        return kycData.companyName && kycData.industry && kycData.description && kycData.address && kycData.city && kycData.phone && kycData.contactEmail;
      case 1:
        return kycData.taxComplianceFile && kycData.contactPersonName && kycData.contactPersonId && kycData.contactPersonRole;
      case 2:
        return kycData.logoFile && kycData.termsAccepted;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/dashboard/brand')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Skip for now
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Brand Profile</h1>
          <p className="text-muted-foreground">
            Get verified to start working with creators. Our team will review your application within 24-48 hours.
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
              className="bg-brand-blue hover:bg-brand-blue-dark"
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
