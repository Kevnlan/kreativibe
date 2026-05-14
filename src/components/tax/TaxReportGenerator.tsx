'use client';

import { useState } from 'react';
import { FileText, Calendar, Download, Filter, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface TaxReportData {
  reportId: string;
  year: number;
  quarter?: number;
  type: 'annual' | 'quarterly';
  currency: string;
  income: number;
  expenses: number;
  taxableIncome: number;
  taxRate: number;
  taxDue: number;
  generatedAt: string;
}

interface TaxReportGeneratorProps {
  onGenerate?: (reportData: Omit<TaxReportData, 'reportId' | 'generatedAt'>) => void;
}

export function TaxReportGenerator({ onGenerate }: TaxReportGeneratorProps) {
  const [reportType, setReportType] = useState<'annual' | 'quarterly'>('annual');
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState<number>(1);
  const [currency] = useState('KES');
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateTax = () => {
    const taxableIncome = Math.max(0, income - expenses);
    // Simple tax calculation - in production this would use actual tax brackets
    const taxRate = taxableIncome > 1000000 ? 0.3 : taxableIncome > 500000 ? 0.25 : taxableIncome > 300000 ? 0.2 : 0.15;
    const taxDue = taxableIncome * taxRate;
    return { taxableIncome, taxRate, taxDue };
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const { taxableIncome, taxRate, taxDue } = calculateTax();
    
    const reportData = {
      year,
      quarter: reportType === 'quarterly' ? quarter : undefined,
      type: reportType,
      currency,
      income,
      expenses,
      taxableIncome,
      taxRate,
      taxDue,
    };

    setTimeout(() => {
      onGenerate?.(reportData);
      setIsGenerating(false);
    }, 1500);
  };

  const { taxableIncome, taxRate, taxDue } = calculateTax();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Tax Report Generator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="annual"
                checked={reportType === 'annual'}
                onChange={(e) => setReportType(e.target.value as 'annual' | 'quarterly')}
                className="h-4 w-4"
              />
              <span>Annual</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="quarterly"
                checked={reportType === 'quarterly'}
                onChange={(e) => setReportType(e.target.value as 'annual' | 'quarterly')}
                className="h-4 w-4"
              />
              <span>Quarterly</span>
            </label>
          </div>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tax Year</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Quarter (if quarterly) */}
        {reportType === 'quarterly' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Quarter</label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={1}>Q1 (Jan-Mar)</option>
              <option value={2}>Q2 (Apr-Jun)</option>
              <option value={3}>Q3 (Jul-Sep)</option>
              <option value={4}>Q4 (Oct-Dec)</option>
            </select>
          </div>
        )}

        {/* Income */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Income</label>
          <div className="relative">
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="w-full pl-16 pr-4 py-3 rounded-lg border border-input text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currency}
            </span>
          </div>
        </div>

        {/* Expenses */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Deductible Expenses</label>
          <div className="relative">
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
              className="w-full pl-16 pr-4 py-3 rounded-lg border border-input text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {currency}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Taxable Income</span>
            <span className="font-semibold">{currency} {taxableIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tax Rate</span>
            <span className="font-semibold">{(taxRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-sm font-medium">Estimated Tax Due</span>
            <span className="font-bold text-lg">{currency} {taxDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="brand"
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
          leftIcon={isGenerating ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          This is an estimate. Consult a tax professional for accurate calculations.
        </p>
      </CardContent>
    </Card>
  );
}
