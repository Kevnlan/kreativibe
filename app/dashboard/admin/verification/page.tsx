'use client';

import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Eye, Download, Clock, Search, Filter } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'CREATOR' | 'BRAND';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents: {
    nationalId?: string;
    kraPin?: string;
    idFront?: string;
    idBack?: string;
    kraCert?: string;
    businessReg?: string;
    taxCompliance?: string;
  };
  profileData: any;
}

const mockSubmissions: KYCSubmission[] = [
  {
    id: '1',
    userId: 'user-001',
    userName: 'Jane Doe',
    userEmail: 'jane@example.com',
    userRole: 'CREATOR',
    status: 'PENDING',
    submittedAt: '2026-03-22T08:30:00Z',
    documents: {
      nationalId: '12345678',
      kraPin: 'A123456789X',
      idFront: '/uploads/id-front-1.jpg',
      idBack: '/uploads/id-back-1.jpg',
      kraCert: '/uploads/kra-cert-1.pdf',
    },
    profileData: {
      bio: 'Fashion and lifestyle content creator',
      categories: ['Fashion', 'Lifestyle'],
      instagram: '@janedoe',
      instagramFollowers: 25000,
    },
  },
  {
    id: '2',
    userId: 'user-002',
    userName: 'Acme Corp',
    userEmail: 'info@acmecorp.com',
    userRole: 'BRAND',
    status: 'PENDING',
    submittedAt: '2026-03-22T09:15:00Z',
    documents: {
      businessReg: '/uploads/business-reg-2.pdf',
      taxCompliance: '/uploads/tax-comp-2.pdf',
    },
    profileData: {
      companyName: 'Acme Corp',
      industry: 'Technology',
      description: 'Leading tech solutions provider',
    },
  },
  {
    id: '3',
    userId: 'user-003',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    userRole: 'CREATOR',
    status: 'APPROVED',
    submittedAt: '2026-03-21T14:20:00Z',
    reviewedAt: '2026-03-21T16:45:00Z',
    reviewedBy: 'admin@kreativibe.com',
    documents: {
      nationalId: '87654321',
      kraPin: 'B987654321Y',
      idFront: '/uploads/id-front-3.jpg',
      idBack: '/uploads/id-back-3.jpg',
      kraCert: '/uploads/kra-cert-3.pdf',
    },
    profileData: {
      bio: 'Tech reviewer and YouTuber',
      categories: ['Technology'],
      youtube: 'youtube.com/@johnsmith',
      youtubeFollowers: 50000,
    },
  },
];

export default function AdminVerificationPage() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>(mockSubmissions);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    const matchesFilter = filter === 'ALL' || sub.status === filter;
    const matchesSearch = sub.userName.toLowerCase().includes(search.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'APPROVED', 
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'admin@kreativibe.com'
          }
        : sub
    ));
    setSelectedSubmission(null);
    alert('KYC submission approved! User will receive email notification.');
  };

  const handleReject = (submissionId: string) => {
    if (!reviewNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'REJECTED', 
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'admin@kreativibe.com'
          }
        : sub
    ));
    setSelectedSubmission(null);
    setReviewNote('');
    alert('KYC submission rejected. User will receive email notification with reason.');
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons = {
    PENDING: <Clock className="h-4 w-4" />,
    APPROVED: <CheckCircle className="h-4 w-4" />,
    REJECTED: <XCircle className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-8 w-8 text-red-600" />
          KYC Verification Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve creator and brand verification submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => s.status === 'PENDING').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'APPROVED').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {submissions.filter(s => s.status === 'REJECTED').length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {submissions.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Submissions ({filteredSubmissions.length})</h2>
          {filteredSubmissions.map((submission) => (
            <Card 
              key={submission.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSubmission?.id === submission.id ? 'ring-2 ring-brand-blue' : ''
              }`}
              onClick={() => setSelectedSubmission(submission)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{submission.userName}</h3>
                    <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusColors[submission.status]}`}>
                    {statusIcons[submission.status]}
                    {submission.status}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className={`px-2 py-0.5 rounded ${
                    submission.userRole === 'CREATOR' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {submission.userRole}
                  </span>
                  <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No submissions found
            </div>
          )}
        </div>

        {/* Details */}
        <div className="sticky top-6">
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Review Submission</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${statusColors[selectedSubmission.status]}`}>
                    {statusIcons[selectedSubmission.status]}
                    {selectedSubmission.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div>
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedSubmission.userName}</p>
                    <p><span className="font-medium">Email:</span> {selectedSubmission.userEmail}</p>
                    <p><span className="font-medium">Role:</span> {selectedSubmission.userRole}</p>
                    <p><span className="font-medium">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div className="space-y-2">
                    {selectedSubmission.userRole === 'CREATOR' && (
                      <>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">National ID: {selectedSubmission.documents.nationalId}</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">KRA PIN: {selectedSubmission.documents.kraPin}</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">ID Front</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">ID Back</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">KRA Certificate</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    {selectedSubmission.userRole === 'BRAND' && (
                      <>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">Business Registration</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">Tax Compliance</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Data */}
                <div>
                  <h3 className="font-semibold mb-2">Profile Data</h3>
                  <div className="p-3 bg-muted rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(selectedSubmission.profileData, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                {selectedSubmission.status === 'PENDING' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Review Note (required for rejection)</label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Add notes or reason for rejection..."
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(selectedSubmission.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedSubmission.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {selectedSubmission.status !== 'PENDING' && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-sm">
                      <span className="font-medium">Reviewed by:</span> {selectedSubmission.reviewedBy}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Reviewed at:</span> {selectedSubmission.reviewedAt && new Date(selectedSubmission.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Select a submission to review
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
