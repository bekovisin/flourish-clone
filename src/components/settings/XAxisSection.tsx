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
  TicksToShowMode,
  TickMarkPosition,
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
  'Inter, sans-serif',
  'Roboto, sans-serif',
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
          <SelectTrigger className="h-8 text-xs w-full">
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
          <SelectTrigger className="h-8 text-xs w-full">
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

  const updateTickMarks = (updates: Partial<XAxisSettings['tickMarks']>) => {
    update({ tickMarks: { ...settings.tickMarks, ...updates } });
  };

  const updateAxisLine = (updates: Partial<XAxisSettings['axisLine']>) => {
    update({ axisLine: { ...settings.axisLine, ...updates } });
  };

  return (
    <AccordionSection id="x-axis" title="X axis">
      {/* Position */}
      <SettingRow label="Position">
        <Select
          value={settings.position}
          onValueChange={(v) => update({ position: v as AxisPosition })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
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
          <SelectTrigger className="h-8 text-xs w-full">
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
          className="h-8 text-xs w-full"
        />
      </SettingRow>

      <SettingRow label="Max">
        <Input
          value={settings.max}
          onChange={(e) => update({ max: e.target.value })}
          placeholder="Auto"
          className="h-8 text-xs w-full"
        />
      </SettingRow>

      <SettingRow label="Flip axis" variant="inline">
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
          <SelectTrigger className="h-8 text-xs w-full">
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
            className="h-8 text-xs w-full"
          />
        </SettingRow>
      )}

      <SettingRow label="Show styling" variant="inline">
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
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" className="text-xs">Default</SelectItem>
            <SelectItem value="left" className="text-xs">Left</SelectItem>
            <SelectItem value="right" className="text-xs">Right</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <NumberInput
        label="Padding"
        value={settings.tickPadding}
        onChange={(v) => update({ tickPadding: v })}
        min={-20}
        max={40}
        step={1}
        suffix="px"
      />

      <NumberInput
        label="Angle"
        value={settings.tickAngle}
        onChange={(v) => update({ tickAngle: v })}
        min={-90}
        max={90}
        step={5}
        suffix="°"
      />

      <SettingRow label="Show styling" variant="inline">
        <Switch
          checked={settings.showTickStyling}
          onCheckedChange={(checked) => update({ showTickStyling: checked })}
        />
      </SettingRow>

      {settings.showTickStyling && (
        <StylingPanel styling={settings.tickStyling} onChange={updateTickStyling} />
      )}

      {/* TICKS TO SHOW */}
      <SubHeader>Ticks to show</SubHeader>
      <p className="text-[10px] text-gray-400 -mt-1 mb-2">
        &quot;Auto&quot; picks nice tick intervals automatically. &quot;Custom&quot; lets you set a specific step interval between ticks.
      </p>

      <SettingRow label="Mode">
        <Select
          value={settings.ticksToShowMode}
          onValueChange={(v) => update({ ticksToShowMode: v as TicksToShowMode })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto" className="text-xs">Auto</SelectItem>
            <SelectItem value="custom" className="text-xs">Custom step</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.ticksToShowMode === 'custom' && (
        <NumberInput
          label="Step interval"
          value={settings.tickStep ?? 10}
          onChange={(v) => update({ tickStep: v })}
          min={1}
          max={10000}
          step={1}
        />
      )}

      {/* TICK MARKS & AXIS LINE */}
      <SubHeader>Tick Marks &amp; Axis Line</SubHeader>

      <SettingRow label="Show tick marks" variant="inline">
        <Switch
          checked={settings.tickMarks.show}
          onCheckedChange={(checked) => updateTickMarks({ show: checked })}
        />
      </SettingRow>

      {settings.tickMarks.show && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <SettingRow label="Position">
            <Select
              value={settings.tickMarks.position}
              onValueChange={(v) => updateTickMarks({ position: v as TickMarkPosition })}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outside" className="text-xs">Outside</SelectItem>
                <SelectItem value="inside" className="text-xs">Inside</SelectItem>
                <SelectItem value="cross" className="text-xs">Cross</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <NumberInput
            label="Length"
            value={settings.tickMarks.length}
            onChange={(v) => updateTickMarks({ length: v })}
            min={1}
            max={20}
            step={1}
            suffix="px"
          />

          <NumberInput
            label="Width"
            value={settings.tickMarks.width}
            onChange={(v) => updateTickMarks({ width: v })}
            min={0.5}
            max={5}
            step={0.5}
            suffix="px"
          />

          <ColorPicker
            label="Color"
            value={settings.tickMarks.color}
            onChange={(color) => updateTickMarks({ color })}
          />
        </div>
      )}

      <SettingRow label="Show axis line" variant="inline">
        <Switch
          checked={settings.axisLine.show}
          onCheckedChange={(checked) => updateAxisLine({ show: checked })}
        />
      </SettingRow>

      {settings.axisLine.show && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <NumberInput
            label="Width"
            value={settings.axisLine.width}
            onChange={(v) => updateAxisLine({ width: v })}
            min={0.5}
            max={5}
            step={0.5}
            suffix="px"
          />

          <ColorPicker
            label="Color"
            value={settings.axisLine.color}
            onChange={(color) => updateAxisLine({ color })}
          />
        </div>
      )}

      {/* GRIDLINES */}
      <SubHeader>Gridlines</SubHeader>

      <SettingRow label="Gridlines" variant="inline">
        <Switch
          checked={settings.gridlines}
          onCheckedChange={(checked) => update({ gridlines: checked })}
        />
      </SettingRow>

      {settings.gridlines && (
        <>
          <SettingRow label="Show styling" variant="inline">
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
