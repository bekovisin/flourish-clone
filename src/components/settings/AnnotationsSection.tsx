'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Annotation } from '@/types/chart';

export function AnnotationsSection() {
  const settings = useEditorStore((s) => s.settings.annotations);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const addAnnotation = () => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: '',
      x: 0,
      y: 0,
      fontSize: 12,
      fontWeight: 'normal',
      color: '#333333',
      backgroundColor: '#ffffff',
    };
    updateSettings('annotations', {
      annotations: [...settings.annotations, newAnnotation],
    });
  };

  const removeAnnotation = (id: string) => {
    updateSettings('annotations', {
      annotations: settings.annotations.filter((a) => a.id !== id),
    });
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    updateSettings('annotations', {
      annotations: settings.annotations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    });
  };

  return (
    <AccordionSection id="annotations" title="Annotations">
      {settings.annotations.length === 0 && (
        <p className="text-xs text-gray-400 italic">No annotations added yet.</p>
      )}

      {settings.annotations.map((annotation, index) => (
        <div
          key={annotation.id}
          className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3"
        >
          {/* Header with index and delete */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-600">
              Annotation {index + 1}
            </Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-red-500"
              onClick={() => removeAnnotation(annotation.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Text */}
          <SettingRow label="Text">
            <Input
              value={annotation.text}
              onChange={(e) =>
                updateAnnotation(annotation.id, { text: e.target.value })
              }
              className="h-8 text-xs w-full"
              placeholder="Annotation text"
            />
          </SettingRow>

          {/* X position */}
          <NumberInput
            label="X position"
            value={annotation.x}
            onChange={(v) => updateAnnotation(annotation.id, { x: v })}
          />

          {/* Y position */}
          <NumberInput
            label="Y position"
            value={annotation.y}
            onChange={(v) => updateAnnotation(annotation.id, { y: v })}
          />

          {/* Font size */}
          <NumberInput
            label="Font size"
            value={annotation.fontSize}
            onChange={(v) => updateAnnotation(annotation.id, { fontSize: v })}
            min={6}
            max={72}
            suffix="px"
          />

          {/* Font weight */}
          <SettingRow label="Font weight">
            <Select
              value={annotation.fontWeight}
              onValueChange={(v: 'normal' | 'bold') =>
                updateAnnotation(annotation.id, { fontWeight: v })
              }
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          {/* Color */}
          <ColorPicker
            label="Color"
            value={annotation.color}
            onChange={(v) => updateAnnotation(annotation.id, { color: v })}
          />

          {/* Background color */}
          <ColorPicker
            label="Background"
            value={annotation.backgroundColor}
            onChange={(v) =>
              updateAnnotation(annotation.id, { backgroundColor: v })
            }
          />
        </div>
      ))}

      {/* Add annotation button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={addAnnotation}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add annotation
      </Button>
    </AccordionSection>
  );
}
