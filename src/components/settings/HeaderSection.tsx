'use client';

import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { TextAlignment, TextStyling, BorderStyle } from '@/types/chart';

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

interface TextBlockProps {
  subHeader: string;
  text: string;
  onTextChange: (text: string) => void;
  styling: TextStyling;
  onStylingChange: (updates: Partial<TextStyling>) => void;
}

function TextBlock({ subHeader, text, onTextChange, styling, onStylingChange }: TextBlockProps) {
  const [showStyling, setShowStyling] = useState(false);

  return (
    <div className="space-y-3">
      {/* Sub-header */}
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-100">
        {subHeader}
      </div>

      {/* Text Input */}
      <SettingRow label={`${subHeader.charAt(0)}${subHeader.slice(1).toLowerCase()} text`}>
        <Input
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="h-8 text-xs w-full"
          placeholder={`Enter ${subHeader.toLowerCase()}...`}
        />
      </SettingRow>

      {/* Show Styling Toggle */}
      <SettingRow label="Show styling" variant="inline">
        <Switch
          checked={showStyling}
          onCheckedChange={setShowStyling}
        />
      </SettingRow>

      {showStyling && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          {/* Font Family */}
          <SettingRow label="Font family">
            <Input
              value={styling.fontFamily}
              onChange={(e) => onStylingChange({ fontFamily: e.target.value })}
              className="h-8 text-xs w-full"
              placeholder="e.g. Arial, sans-serif"
            />
          </SettingRow>

          {/* Font Size */}
          <NumberInput
            label="Font size"
            value={styling.fontSize}
            onChange={(v) => onStylingChange({ fontSize: v })}
            min={1}
            max={200}
            suffix="px"
          />

          {/* Font Weight */}
          <SettingRow label="Font weight">
            <Select
              value={styling.fontWeight}
              onValueChange={(v) => onStylingChange({ fontWeight: v as 'normal' | 'bold' })}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal" className="text-xs">Normal</SelectItem>
                <SelectItem value="bold" className="text-xs">Bold</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          {/* Color */}
          <ColorPicker
            label="Color"
            value={styling.color}
            onChange={(color) => onStylingChange({ color })}
          />

          {/* Line Height */}
          <NumberInput
            label="Line height"
            value={styling.lineHeight}
            onChange={(v) => onStylingChange({ lineHeight: v })}
            min={0.5}
            max={5}
            step={0.1}
          />
        </div>
      )}
    </div>
  );
}

export function HeaderSection() {
  const settings = useEditorStore((s) => s.settings.header);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('header', updates);
  };

  const updateTitleStyling = (updates: Partial<TextStyling>) => {
    updateSettings('header', {
      titleStyling: { ...settings.titleStyling, ...updates },
    });
  };

  const updateSubtitleStyling = (updates: Partial<TextStyling>) => {
    updateSettings('header', {
      subtitleStyling: { ...settings.subtitleStyling, ...updates },
    });
  };

  const updateTextStyling = (updates: Partial<TextStyling>) => {
    updateSettings('header', {
      textStyling: { ...settings.textStyling, ...updates },
    });
  };

  return (
    <AccordionSection id="header" title="Header">
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

      {/* TITLE */}
      <TextBlock
        subHeader="TITLE"
        text={settings.title}
        onTextChange={(text) => update({ title: text })}
        styling={settings.titleStyling}
        onStylingChange={updateTitleStyling}
      />

      {/* SUBTITLE */}
      <TextBlock
        subHeader="SUBTITLE"
        text={settings.subtitle}
        onTextChange={(text) => update({ subtitle: text })}
        styling={settings.subtitleStyling}
        onStylingChange={updateSubtitleStyling}
      />

      {/* TEXT */}
      <TextBlock
        subHeader="TEXT"
        text={settings.text}
        onTextChange={(text) => update({ text })}
        styling={settings.textStyling}
        onStylingChange={updateTextStyling}
      />

      {/* BORDER */}
      <div className="space-y-3">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-100">
          Border
        </div>
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
      </div>
    </AccordionSection>
  );
}
