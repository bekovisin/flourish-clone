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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {
  FilterMode,
  LegendAlignment,
  LegendOrientation,
  DataColorsHeader,
} from '@/types/chart';

const alignmentOptions: { value: LegendAlignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'inline', label: 'Inline' },
];

export function LegendSection() {
  const settings = useEditorStore((s) => s.settings.legend);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('legend', updates);
  };

  return (
    <AccordionSection id="legend" title="Legend">
      {/* Click legend to filter */}
      <SettingRow label="Click to filter">
        <Select
          value={settings.clickToFilter}
          onValueChange={(v: FilterMode) => update({ clickToFilter: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">Off</SelectItem>
            <SelectItem value="single_select">Single select</SelectItem>
            <SelectItem value="multi_select">Multi select</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Alignment - button group */}
      <SettingRow label="Alignment">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {alignmentOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ alignment: opt.value })}
              className={`px-3 py-1.5 text-xs transition-colors ${
                settings.alignment === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${opt.value !== 'left' ? 'border-l border-gray-200' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SettingRow>

      {/* Title weight */}
      <SettingRow label="Title weight">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {(['normal', 'bold'] as const).map((w) => (
            <button
              key={w}
              onClick={() => update({ titleWeight: w })}
              className={`px-3 py-1.5 text-xs transition-colors ${
                settings.titleWeight === w
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${w === 'bold' ? 'border-l border-gray-200' : ''}`}
            >
              {w === 'normal' ? 'Normal' : 'Bold'}
            </button>
          ))}
        </div>
      </SettingRow>

      {/* Text weight */}
      <SettingRow label="Text weight">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {(['normal', 'bold'] as const).map((w) => (
            <button
              key={w}
              onClick={() => update({ textWeight: w })}
              className={`px-3 py-1.5 text-xs transition-colors ${
                settings.textWeight === w
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${w === 'bold' ? 'border-l border-gray-200' : ''}`}
            >
              {w === 'normal' ? 'Normal' : 'Bold'}
            </button>
          ))}
        </div>
      </SettingRow>

      {/* Color */}
      <ColorPicker
        label="Color"
        value={settings.color}
        onChange={(v) => update({ color: v })}
      />

      {/* Size */}
      <NumberInput
        label="Size"
        value={settings.size}
        onChange={(v) => update({ size: v })}
        min={6}
        max={48}
        suffix="px"
      />

      {/* Title text */}
      <SettingRow label="Title text">
        <Input
          value={settings.titleText}
          onChange={(e) => update({ titleText: e.target.value })}
          className="h-8 text-xs w-[140px]"
          placeholder="Legend title"
        />
      </SettingRow>

      {/* ---- SWATCHES ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Swatches
        </Label>
      </div>

      <NumberInput
        label="Width"
        value={settings.swatchWidth}
        onChange={(v) => update({ swatchWidth: v })}
        min={4}
        max={40}
        suffix="px"
      />

      <NumberInput
        label="Height"
        value={settings.swatchHeight}
        onChange={(v) => update({ swatchHeight: v })}
        min={4}
        max={40}
        suffix="px"
      />

      <NumberInput
        label="Roundness"
        value={settings.swatchRoundness}
        onChange={(v) => update({ swatchRoundness: v })}
        min={0}
        max={20}
        suffix="px"
      />

      <NumberInput
        label="Padding"
        value={settings.swatchPadding}
        onChange={(v) => update({ swatchPadding: v })}
        min={0}
        max={20}
        suffix="px"
      />

      {/* Outline */}
      <SettingRow label="Outline">
        <Switch
          checked={settings.outline}
          onCheckedChange={(v) => update({ outline: v })}
        />
      </SettingRow>

      {/* Custom order */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">Custom order</Label>
        <Textarea
          value={settings.customOrder}
          onChange={(e) => update({ customOrder: e.target.value })}
          className="text-xs min-h-[60px]"
          placeholder="Enter custom legend order, one item per line"
        />
      </div>

      {/* Max width */}
      <NumberInput
        label="Max width"
        value={settings.maxWidth}
        onChange={(v) => update({ maxWidth: v })}
        min={0}
        max={100}
        suffix="%"
      />

      {/* Orientation */}
      <SettingRow label="Orientation">
        <Select
          value={settings.orientation}
          onValueChange={(v: LegendOrientation) => update({ orientation: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Add data colors to header */}
      <SettingRow label="Data colors in header">
        <Select
          value={settings.dataColorsHeader}
          onValueChange={(v: DataColorsHeader) =>
            update({ dataColorsHeader: v })
          }
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="off">Off</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </AccordionSection>
  );
}
