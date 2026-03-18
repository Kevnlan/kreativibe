'use client';

import { ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: <Info className="h-6 w-6" />,
    iconBg: 'bg-blue-100 text-blue-600',
    confirmButton: 'bg-brand-blue hover:bg-brand-blue-dark',
  },
  danger: {
    icon: <XCircle className="h-6 w-6" />,
    iconBg: 'bg-red-100 text-red-600',
    confirmButton: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconBg: 'bg-yellow-100 text-yellow-600',
    confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
  },
  success: {
    icon: <CheckCircle className="h-6 w-6" />,
    iconBg: 'bg-green-100 text-green-600',
    confirmButton: 'bg-green-600 hover:bg-green-700',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4">
            <div className={cn('p-2 rounded-full', config.iconBg)}>
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mb-6">
                  {description}
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={config.confirmButton}
                >
                  {loading ? 'Processing...' : confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
