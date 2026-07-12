'use client';

import { useState } from 'react';
import { User, MapPin, FileText, Save, Upload, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface TaxInfoData {
  taxId: string;
  fullName: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxResidency: string;
  taxNumber: string;
  documents: {
    idCard?: string;
    taxCertificate?: string;
    proofOfAddress?: string;
  };
}

interface TaxInfoFormProps {
  initialData?: Partial<TaxInfoData>;
  onSave?: (data: TaxInfoData) => void | Promise<void>;
  onUploadDocument?: (type: string, file: File) => void | Promise<void>;
}

export function TaxInfoForm({ initialData, onSave, onUploadDocument }: TaxInfoFormProps) {
  const [formData, setFormData] = useState<Partial<TaxInfoData>>(initialData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave?.(formData as TaxInfoData);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save tax info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadDocument?.(type, file);
      setUploadedFiles(prev => ({ ...prev, [type]: file.name }));
    }
  };

  const updateAddressField = (field: keyof NonNullable<TaxInfoData['address']>, value: string) => {
    const currentAddress: NonNullable<TaxInfoData['address']> = formData.address || { street: '', city: '', state: '', postalCode: '', country: '' };
    setFormData({ ...formData, address: { ...currentAddress, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Tax Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </h4>

          <div className="space-y-2">
            <label className="text-sm font-medium">Street Address</label>
            <input
              type="text"
              value={formData.address?.street || ''}
              onChange={(e) => updateAddressField('street', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input
                type="text"
                value={formData.address?.city || ''}
                onChange={(e) => setFormData({ ...formData, address: { street: formData.address?.street || '', city: e.target.value, state: formData.address?.state || '', postalCode: formData.address?.postalCode || '', country: formData.address?.country || '' } })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="City"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">State/Province</label>
              <input
                type="text"
                value={formData.address?.state || ''}
                onChange={(e) => updateAddressField('state', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="State"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Postal Code</label>
              <input
                type="text"
                value={formData.address?.postalCode || ''}
                onChange={(e) => updateAddressField('postalCode', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Postal code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select
              value={formData.address?.country || ''}
              onChange={(e) => updateAddressField('country', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select country</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
            </select>
          </div>
        </div>

        {/* Tax Details */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tax Details
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Residency</label>
              <select
                value={formData.taxResidency || ''}
                onChange={(e) => setFormData({ ...formData, taxResidency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select residency</option>
                <option value="resident">Resident</option>
                <option value="non-resident">Non-Resident</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tax PIN/Number</label>
              <input
                type="text"
                value={formData.taxNumber || ''}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter tax PIN"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Supporting Documents
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">National ID / Passport</span>
              <div className="flex items-center gap-2">
                {uploadedFiles.idCard && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload('idCard', e)}
                  />
                  <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    Upload
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Tax Certificate</span>
              <div className="flex items-center gap-2">
                {uploadedFiles.taxCertificate && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload('taxCertificate', e)}
                  />
                  <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    Upload
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Proof of Address</span>
              <div className="flex items-center gap-2">
                {uploadedFiles.proofOfAddress && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload('proofOfAddress', e)}
                  />
                  <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    Upload
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {saveError && (
          <p className="text-sm text-red-600">{saveError}</p>
        )}
        <Button
          variant="brand"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving}
          leftIcon={isSaving ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        >
          {isSaving ? 'Saving...' : 'Save Tax Information'}
        </Button>
      </CardContent>
    </Card>
  );
}
