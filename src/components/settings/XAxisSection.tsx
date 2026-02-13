'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { ColorPicker } from '@/components/shared/ColorPicker';
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
import type {
  AxisPosition,
  ScaleType,
  AxisTitleType,
  TickPosition,
  AxisStyling,
  XAxisSettings,
} from '@/types/chart';

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2 pb-1">
      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {children}
      </h4>
    </div>
  );
}

const fontFamilyOptions = [
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'system-ui',
];

interface StylingPanelProps {
  styling: AxisStyling;
  onChange: (updates: Partial<AxisStyling>) => void;
}

function StylingPanel({ styling, onChange }: StylingPanelProps) {
  return (
    <div className="space-y-3 pl-2 border-l-2 border-gray-100">
      <SettingRow label="Font family">
        <Select
          value={styling.fontFamily}
          onValueChange={(v) => onChange({ fontFamily: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilyOptions.map((font) => (
              <SelectItem key={font} value={font} className="text-xs">
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>

      <NumberInput
        label="Font size"
        value={styling.fontSize}
        onChange={(v) => onChange({ fontSize: v })}
        min={6}
        max={48}
        step={1}
        suffix="px"
      />

      <SettingRow label="Font weight">
        <Select
          value={styling.fontWeight}
          onValueChange={(v) => onChange({ fontWeight: v as 'normal' | 'bold' })}
        >
          <SelectTrigger className="h-8 text-xs w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal" className="text-xs">Normal</SelectItem>
            <SelectItem value="bold" className="text-xs">Bold</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <ColorPicker
        label="Color"
        value={styling.color}
        onChange={(color) => onChange({ color })}
      />
    </div>
  );
}

interface GridlineStylingPanelProps {
  styling: XAxisSettings['gridlineStyling'];
  onChange: (updates: Partial<XAxisSettings['gridlineStyling']>) => void;
}

function GridlineStylingPanel({ styling, onChange }: GridlineStylingPanelProps) {
  return (
    <div className="space-y-3 pl-2 border-l-2 border-gray-100">
      <ColorPicker
        label="Color"
        value={styling.color}
        onChange={(color) => onChange({ color })}
      />

      <NumberInput
        label="Width"
        value={styling.width}
        onChange={(v) => onChange({ width: v })}
        min={0.5}
        max={5}
        step={0.5}
        suffix="px"
      />

      <NumberInput
        label="Dash"
        value={styling.dashArray}
        onChange={(v) => onChange({ dashArray: v })}
        min={0}
        max={20}
        step={1}
      />
    </div>
  );
}

export function XAxisSection() {
  const settings = useEditorStore((s) => s.settings.xAxis);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<XAxisSettings>) => {
    updateSettings('xAxis', updates);
  };

  const updateTitleStyling = (updates: Partial<AxisStyling>) => {
    update({ titleStyling: { ...settings.titleStyling, ...updates } });
  };

  const updateTickStyling = (updates: Partial<AxisStyling>) => {
    update({ tickStyling: { ...settings.tickStyling, ...updates } });
  };

  const updateGridlineStyling = (updates: Partial<XAxisSettings['gridlineStyling']>) => {
    update({ gridlineStyling: { ...settings.gridlineStyling, ...updates } });
  };

  return (
    <AccordionSection id="x-axis" title="X axis">
      {/* Position */}
      <SettingRow label="Position">
        <Select
          value={settings.position}
          onValueChange={(v) => update({ position: v as AxisPosition })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bottom" className="text-xs">Bottom</SelectItem>
            <SelectItem value="float_down" className="text-xs">Float down</SelectItem>
            <SelectItem value="float_up" className="text-xs">Float up</SelectItem>
            <SelectItem value="top" className="text-xs">Top</SelectItem>
            <SelectItem value="hidden" className="text-xs">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* SCALE */}
      <SubHeader>Scale</SubHeader>

      <SettingRow label="Type">
        <Select
          value={settings.scaleType}
          onValueChange={(v) => update({ scaleType: v as ScaleType })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear" className="text-xs">Linear</SelectItem>
            <SelectItem value="log" className="text-xs">Log</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Min">
        <Input
          value={settings.min}
          onChange={(e) => update({ min: e.target.value })}
          placeholder="Auto"
          className="h-8 text-xs w-[200px]"
        />
      </SettingRow>

      <SettingRow label="Max">
        <Input
          value={settings.max}
          onChange={(e) => update({ max: e.target.value })}
          placeholder="Auto"
          className="h-8 text-xs w-[200px]"
        />
      </SettingRow>

      <SettingRow label="Flip axis">
        <Switch
          checked={settings.flipAxis}
          onCheckedChange={(checked) => update({ flipAxis: checked })}
        />
      </SettingRow>

      {/* AXIS TITLE */}
      <SubHeader>Axis Title</SubHeader>

      <SettingRow label="Title type">
        <Select
          value={settings.titleType}
          onValueChange={(v) => update({ titleType: v as AxisTitleType })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto" className="text-xs">Auto</SelectItem>
            <SelectItem value="custom" className="text-xs">Custom</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.titleType === 'custom' && (
        <SettingRow label="Title text">
          <Input
            value={settings.titleText}
            onChange={(e) => update({ titleText: e.target.value })}
            placeholder="Enter title..."
            className="h-8 text-xs w-[200px]"
          />
        </SettingRow>
      )}

      <SettingRow label="Show styling">
        <Switch
          checked={settings.showTitleStyling}
          onCheckedChange={(checked) => update({ showTitleStyling: checked })}
        />
      </SettingRow>

      {settings.showTitleStyling && (
        <StylingPanel styling={settings.titleStyling} onChange={updateTitleStyling} />
      )}

      {/* TICKS & LABELS */}
      <SubHeader>Ticks &amp; Labels</SubHeader>

      <SettingRow label="Position">
        <Select
          value={settings.tickPosition}
          onValueChange={(v) => update({ tickPosition: v as TickPosition })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" className="text-xs">Default</SelectItem>
            <SelectItem value="left" className="text-xs">Left</SelectItem>
            <SelectItem value="right" className="text-xs">Right</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Show styling">
        <Switch
          checked={settings.showTickStyling}
          onCheckedChange={(checked) => update({ showTickStyling: checked })}
        />
      </SettingRow>

      {settings.showTickStyling && (
        <StylingPanel styling={settings.tickStyling} onChange={updateTickStyling} />
      )}

      {/* GRIDLINES */}
      <SubHeader>Gridlines</SubHeader>

      <SettingRow label="Gridlines">
        <Switch
          checked={settings.gridlines}
          onCheckedChange={(checked) => update({ gridlines: checked })}
        />
      </SettingRow>

      {settings.gridlines && (
        <>
          <SettingRow label="Show styling">
            <Switch
              checked={settings.showGridlineStyling}
              onCheckedChange={(checked) => update({ showGridlineStyling: checked })}
            />
          </SettingRow>

          {settings.showGridlineStyling && (
            <GridlineStylingPanel
              styling={settings.gridlineStyling}
              onChange={updateGridlineStyling}
            />
          )}
        </>
      )}
    </AccordionSection>
  );
}
