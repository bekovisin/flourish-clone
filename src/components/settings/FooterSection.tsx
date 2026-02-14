'use client';

import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { TextAlignment, BorderStyle } from '@/types/chart';

const alignmentOptions: { value: TextAlignment; icon: typeof AlignLeft }[] = [
  { value: 'left', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'right', icon: AlignRight },
];

const borderOptions: { value: BorderStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'both', label: 'Both' },
];

export function FooterSection() {
  const settings = useEditorStore((s) => s.settings.footer);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('footer', updates);
  };

  return (
    <AccordionSection id="footer" title="Footer">
      {/* Alignment */}
      <SettingRow label="Alignment">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {alignmentOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => update({ alignment: opt.value })}
                className={`px-3 py-1.5 transition-colors ${
                  settings.alignment === opt.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } ${opt.value !== 'left' ? 'border-l border-gray-200' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </SettingRow>

      {/* Size */}
      <NumberInput
        label="Size"
        value={settings.size}
        onChange={(v) => update({ size: v })}
        min={1}
        max={100}
        suffix="px"
      />

      {/* Color */}
      <ColorPicker
        label="Color"
        value={settings.color}
        onChange={(color) => update({ color })}
      />

      {/* Advanced Footer Styles */}
      <SettingRow label="Advanced footer styles" variant="inline">
        <Switch
          checked={settings.advancedStyles}
          onCheckedChange={(checked) => update({ advancedStyles: checked })}
        />
      </SettingRow>

      {/* Source Name */}
      <SettingRow label="Source name">
        <Input
          value={settings.sourceName}
          onChange={(e) => update({ sourceName: e.target.value })}
          className="h-8 text-xs w-full"
          placeholder="Enter source name..."
        />
      </SettingRow>

      {/* Source URL */}
      <SettingRow label="Source URL">
        <Input
          value={settings.sourceUrl}
          onChange={(e) => update({ sourceUrl: e.target.value })}
          className="h-8 text-xs w-full"
          placeholder="https://..."
        />
      </SettingRow>

      {/* Multiple Sources */}
      <SettingRow label="Multiple sources" variant="inline">
        <Switch
          checked={settings.multipleSources}
          onCheckedChange={(checked) => update({ multipleSources: checked })}
        />
      </SettingRow>

      {/* Source Label */}
      <SettingRow label="Source label">
        <Input
          value={settings.sourceLabel}
          onChange={(e) => update({ sourceLabel: e.target.value })}
          className="h-8 text-xs w-full"
          placeholder="Source"
        />
      </SettingRow>

      {/* Note (Primary) */}
      <div className="space-y-1.5">
        <span className="text-xs text-gray-600">Note (primary)</span>
        <Textarea
          value={settings.notePrimary}
          onChange={(e) => update({ notePrimary: e.target.value })}
          className="text-xs min-h-[60px] resize-y"
          placeholder="Add a primary note..."
        />
      </div>

      {/* Note (Secondary) */}
      <div className="space-y-1.5">
        <span className="text-xs text-gray-600">Note (secondary)</span>
        <Textarea
          value={settings.noteSecondary}
          onChange={(e) => update({ noteSecondary: e.target.value })}
          className="text-xs min-h-[60px] resize-y"
          placeholder="Add a secondary note..."
        />
      </div>

      {/* Logo URL */}
      <SettingRow label="Logo URL">
        <Input
          value={settings.logoUrl}
          onChange={(e) => update({ logoUrl: e.target.value })}
          className="h-8 text-xs w-full"
          placeholder="https://..."
        />
      </SettingRow>

      {/* Border */}
      <SettingRow label="Border">
        <Select
          value={settings.border}
          onValueChange={(v) => update({ border: v as BorderStyle })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {borderOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
    </AccordionSection>
  );
}
