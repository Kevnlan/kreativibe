'use client';

import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  isValid?: boolean;
}

interface MultiStepWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onCancel?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isSubmitting?: boolean;
  className?: string;
}

export function MultiStepWizard({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onCancel,
  canGoNext = true,
  canGoPrevious = true,
  isSubmitting = false,
  className,
}: MultiStepWizardProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    index < currentStep && 'bg-brand-blue border-brand-blue text-white',
                    index === currentStep && 'border-brand-blue text-brand-blue',
                    index > currentStep && 'border-gray-300 text-gray-400'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 transition-colors',
                      index < currentStep ? 'bg-brand-blue' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  'text-sm font-medium',
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.title}
                </p>
                {step.description && index === currentStep && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {steps[currentStep]?.content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious || isSubmitting}
            >
              Previous
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            disabled={(!canGoNext && !isLastStep) || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : isLastStep ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
