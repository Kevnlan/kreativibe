'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, ChevronDown, ChevronRight, Calendar, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ReportField {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'text';
  value?: any;
}

interface ReportGeneratorProps {
  availableFields: ReportField[];
  onGenerateReport?: (fields: string[], filters: ReportFilter[]) => void;
  onSaveTemplate?: (name: string, fields: string[]) => void;
}

const fieldCategories = ['Campaign', 'Creative', 'Engagement', 'Revenue', 'Platform', 'Content'];

export function ReportGenerator({ availableFields, onGenerateReport, onSaveTemplate }: ReportGeneratorProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState('');

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const addFilter = () => {
    setFilters([...filters, { id: `filter-${Date.now()}`, name: 'New Filter', type: 'select' }]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleGenerate = () => {
    onGenerateReport?.(Array.from(selectedFields), filters);
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate?.(templateName, Array.from(selectedFields));
      setTemplateName('');
    }
  };

  const groupedFields = fieldCategories.reduce((acc, category) => {
    acc[category] = availableFields.filter(f => f.category === category);
    return acc;
  }, {} as Record<string, ReportField[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Report Generator</CardTitle>
          </div>
          <Badge variant="outline">{selectedFields.size} fields selected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Template Name (Optional)</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Save this as a template..."
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {templateName && (
            <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
              Save Template
            </Button>
          )}
        </div>

        {/* Fields Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Select Report Fields</h4>
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-3 flex items-center justify-between hover:bg-muted/50"
              >
                <span className="font-medium">{category}</span>
                {expandedCategories.has(category) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedCategories.has(category) && (
                <div className="p-3 border-t space-y-2">
                  {fields.map((field) => (
                    <label key={field.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields.has(field.id)}
                        onChange={() => toggleField(field.id)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <span className="text-sm">{field.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            <Button variant="outline" size="sm" onClick={addFilter} leftIcon={<Plus className="h-4 w-4" />}>
              Add Filter
            </Button>
          </div>
          {filters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No filters added</p>
          ) : (
            <div className="space-y-2">
              {filters.map((filter) => (
                <div key={filter.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={filter.name}
                    onChange={(e) => setFilters(filters.map(f => f.id === filter.id ? { ...f, name: e.target.value } : f))}
                    className="flex-1 px-3 py-1 rounded border border-input bg-background text-sm"
                  />
                  <select
                    value={filter.type}
                    onChange={(e) => setFilters(filters.map(f => f.id === filter.id ? { ...f, type: e.target.value as any } : f))}
                    className="px-3 py-1 rounded border border-input bg-background text-sm"
                  >
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                    <option value="text">Text</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="brand"
            onClick={handleGenerate}
            disabled={selectedFields.size === 0}
            className="flex-1"
            leftIcon={<FileText className="h-4 w-4" />}
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedFields(new Set())}
          >
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
