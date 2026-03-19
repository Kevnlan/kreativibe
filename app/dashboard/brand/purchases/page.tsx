'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Download, Eye, Calendar, DollarSign } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface Purchase {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  creatorName: string;
  creatorAvatar?: string;
  amount: number;
  status: 'COMPLETED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  purchasedAt: string;
  deliveredAt?: string;
  downloadUrl?: string;
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          contentId: 'c1',
          contentTitle: 'Fashion Lookbook Reel',
          contentType: 'Instagram Reel',
          creatorName: 'Sarah Kimani',
          amount: 5000,
          status: 'DELIVERED',
          purchasedAt: '2024-03-18T11:30:00Z',
          deliveredAt: '2024-03-18T14:00:00Z',
          downloadUrl: '#',
        },
        {
          id: '2',
          contentId: 'c2',
          contentTitle: 'Unboxing & Review Video',
          contentType: 'YouTube Video',
          creatorName: 'Michael Kamau',
          amount: 15000,
          status: 'PROCESSING',
          purchasedAt: '2024-03-17T14:00:00Z',
        },
        {
          id: '3',
          contentId: 'c3',
          contentTitle: 'Recipe Integration Post',
          contentType: 'Instagram Post',
          creatorName: 'Grace Wanjiru',
          amount: 3500,
          status: 'DELIVERED',
          purchasedAt: '2024-03-16T16:00:00Z',
          deliveredAt: '2024-03-17T10:00:00Z',
          downloadUrl: '#',
        },
        {
          id: '4',
          contentId: 'c4',
          contentTitle: 'Skincare Routine TikTok',
          contentType: 'TikTok Video',
          creatorName: 'Aisha Ndungu',
          amount: 4000,
          status: 'DELIVERED',
          purchasedAt: '2024-03-15T09:00:00Z',
          deliveredAt: '2024-03-15T18:00:00Z',
          downloadUrl: '#',
        },
        {
          id: '5',
          contentId: 'c5',
          contentTitle: 'Destination Travel Vlog',
          contentType: 'YouTube Video',
          creatorName: 'James Mutua',
          amount: 18000,
          status: 'COMPLETED',
          purchasedAt: '2024-03-14T12:00:00Z',
        },
      ];
      setPurchases(mockPurchases);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const getStatusVariant = (status: Purchase['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PROCESSING':
        return 'pending';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
    }
  };

  const columns = [
    {
      key: 'purchasedAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(value).toLocaleDateString('en-KE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'contentTitle',
      label: 'Content',
      sortable: true,
      render: (value: string, row: Purchase) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.contentType}</div>
        </div>
      ),
    },
    {
      key: 'creatorName',
      label: 'Creator',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: Purchase['status']) => (
        <StatusBadge variant={getStatusVariant(value)} size="sm">
          {value}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Purchase) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/brand/purchases/${row.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {row.downloadUrl && row.status === 'DELIVERED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(row.downloadUrl, '_blank')}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
        </div>
      ),
    },
  ];

  const stats = {
    totalPurchases: purchases.length,
    totalSpent: purchases.reduce((sum, p) => sum + p.amount, 0),
    delivered: purchases.filter(p => p.status === 'DELIVERED').length,
    processing: purchases.filter(p => p.status === 'PROCESSING').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your content purchases
          </p>
        </div>
        <Button onClick={() => router.push('/marketplace')}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Purchases"
          value={stats.totalPurchases.toString()}
          icon={<ShoppingBag className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={<DollarSign className="h-4 w-4" />}
          iconColor="text-green-600"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered.toString()}
          icon={<Download className="h-4 w-4" />}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Processing"
          value={stats.processing.toString()}
          icon={<Calendar className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
      </div>

      {/* Purchase Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={purchases}
            columns={columns}
            loading={loading}
            searchable={true}
            emptyMessage="No purchases yet. Browse the marketplace to get started!"
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchases.slice(0, 3).map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{purchase.contentTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      by {purchase.creatorName} • {formatCurrency(purchase.amount)}
                    </p>
                  </div>
                </div>
                <StatusBadge variant={getStatusVariant(purchase.status)} size="sm">
                  {purchase.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
