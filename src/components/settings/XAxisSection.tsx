'use client';

import { useMemo, useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import type {
  AxisPosition,
  ScaleType,
  AxisTitleType,
  TickPosition,
  AxisStyling,
  XAxisSettings,
  TicksToShowMode,
  TickMarkPosition,
  TickLabelCountMode,
  FontWeight,
  ChartSettings,
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
  'Montserrat, sans-serif',
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
          onValueChange={(v) => onChange({ fontWeight: v as FontWeight })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal" className="text-xs">Normal</SelectItem>
            <SelectItem value="600" className="text-xs">Semi-bold</SelectItem>
            <SelectItem value="bold" className="text-xs">Bold</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Font style">
        <Select
          value={styling.fontStyle || 'normal'}
          onValueChange={(v) => onChange({ fontStyle: v as 'normal' | 'italic' })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal" className="text-xs">Normal</SelectItem>
            <SelectItem value="italic" className="text-xs">Italic</SelectItem>
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

// ── Tick generation helpers (mirrors CustomBarChart logic) ──
function generateNiceTicks(min: number, max: number, desiredCount = 5): number[] {
  if (max <= min) return [0];
  const range = max - min;
  const roughStep = range / desiredCount;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  let step: number;
  const normalized = roughStep / mag;
  if (normalized <= 1.5) step = 1 * mag;
  else if (normalized <= 3) step = 2 * mag;
  else if (normalized <= 7) step = 5 * mag;
  else step = 10 * mag;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 0.001; v += step) {
    ticks.push(Math.round(v * 1e10) / 1e10);
  }
  return ticks;
}

function generateCustomStepTicks(min: number, max: number, step: number): number[] {
  if (step <= 0 || max <= min) return [0];
  const niceMin = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= max + step * 0.001; v += step) {
    ticks.push(Math.round(v * 1e10) / 1e10);
  }
  return ticks;
}

function formatNumberForLabel(value: number, nf: ChartSettings['numberFormatting']): string {
  const factor = Math.pow(10, nf.decimalPlaces);
  const rounded = Math.round(value * factor) / factor;
  let str = rounded.toFixed(nf.decimalPlaces);
  const [intPart, decPart] = str.split('.');
  let formattedInt = intPart;
  if (nf.thousandsSeparator !== 'none') {
    formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, nf.thousandsSeparator);
  }
  str = decPart ? `${formattedInt}${nf.decimalSeparator}${decPart}` : formattedInt;
  return `${nf.prefix}${str}${nf.suffix}`;
}

// ── Multi-select dropdown for label visibility ──
function LabelVisibilityDropdown({
  allLabels,
  hiddenLabels,
  onChange,
}: {
  allLabels: string[];
  hiddenLabels: string[];
  onChange: (hidden: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const hiddenSet = new Set(hiddenLabels);
  const visibleCount = allLabels.length - hiddenSet.size;

  const toggleLabel = (label: string) => {
    const newSet = new Set(hiddenSet);
    if (newSet.has(label)) {
      newSet.delete(label);
    } else {
      newSet.add(label);
    }
    onChange(Array.from(newSet));
  };

  const showAll = () => onChange([]);
  const hideAll = () => onChange([...allLabels]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full h-8 px-3 rounded-md border border-gray-200 bg-white text-xs hover:bg-gray-50 transition-colors">
          <span className="text-gray-700 truncate">
            {visibleCount === allLabels.length
              ? 'All labels visible'
              : visibleCount === 0
                ? 'All labels hidden'
                : `${visibleCount} of ${allLabels.length} visible`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start" side="bottom">
        {/* Bulk actions */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
          <button
            onClick={showAll}
            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
          >
            Show all
          </button>
          <button
            onClick={hideAll}
            className="text-[10px] text-gray-500 hover:text-gray-700 font-medium"
          >
            Hide all
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto py-1">
          {allLabels.map((label) => {
            const isHidden = hiddenSet.has(label);
            return (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                  isHidden ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
                <span className={`truncate ${isHidden ? 'line-through' : ''}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function XAxisSection() {
  const settings = useEditorStore((s) => s.settings.xAxis);
  const numberFormatting = useEditorStore((s) => s.settings.numberFormatting);
  const chartData = useEditorStore((s) => s.data);
  const columnMapping = useEditorStore((s) => s.columnMapping);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  // Generate all tick labels for the multi-select dropdown
  const allTickLabels = useMemo(() => {
    // Compute min/max from data (mirrors CustomBarChart logic)
    if (!columnMapping.values || columnMapping.values.length === 0) return [];
    let maxV = 0;
    let minV = 0;
    for (let ci = 0; ci < chartData.length; ci++) {
      let posSum = 0;
      let negSum = 0;
      for (const col of columnMapping.values) {
        const raw = chartData[ci]?.[col];
        const v = typeof raw === 'number' ? raw : parseFloat(String(raw)) || 0;
        if (v >= 0) posSum += v;
        else negSum += v;
      }
      if (posSum > maxV) maxV = posSum;
      if (negSum < minV) minV = negSum;
    }
    const userMin = settings.min ? parseFloat(settings.min) : undefined;
    const userMax = settings.max ? parseFloat(settings.max) : undefined;
    const finalMax = userMax !== undefined ? userMax : maxV;
    const finalMin = userMin !== undefined ? userMin : Math.min(0, minV);

    let ticks: number[];
    if (settings.ticksToShowMode === 'custom') {
      ticks = generateCustomStepTicks(finalMin, finalMax, settings.tickStep || 10);
    } else if (settings.ticksToShowMode === 'number') {
      ticks = generateNiceTicks(finalMin, finalMax, settings.ticksToShowNumber);
    } else {
      ticks = generateNiceTicks(finalMin, finalMax);
    }
    return ticks.map((t) => formatNumberForLabel(t, numberFormatting));
  }, [chartData, columnMapping, settings.min, settings.max, settings.ticksToShowMode, settings.ticksToShowNumber, settings.tickStep, numberFormatting]);

  const update = (updates: Partial<XAxisSettings>) => {
    updateSettings('xAxis', updates);
  };

  const updateZeroLine = (updates: Partial<XAxisSettings['axisLine']>) => {
    update({ zeroLine: { ...(settings.zeroLine || { show: true, width: 1, color: '#666666' }), ...updates } });
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

      {/* ZERO LINE */}
      <SubHeader>Zero Line</SubHeader>
      <p className="text-[10px] text-gray-400 -mt-1 mb-2">
        The vertical line at value 0 on the X axis.
      </p>

      <SettingRow label="Show zero line" variant="inline">
        <Switch
          checked={settings.zeroLine?.show !== false}
          onCheckedChange={(checked) => updateZeroLine({ show: checked })}
        />
      </SettingRow>

      {settings.zeroLine?.show !== false && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <ColorPicker
            label="Color"
            value={settings.zeroLine?.color || '#666666'}
            onChange={(color) => updateZeroLine({ color })}
          />

          <NumberInput
            label="Width"
            value={settings.zeroLine?.width || 1}
            onChange={(v) => updateZeroLine({ width: v })}
            min={0.5}
            max={5}
            step={0.5}
            suffix="px"
          />
        </div>
      )}

      {/* LABEL COUNT */}
      <SubHeader>Label Visibility</SubHeader>
      <p className="text-[10px] text-gray-400 -mt-1 mb-2">
        Control how many tick labels are visible and toggle individual labels.
      </p>

      <SettingRow label="Mode">
        <Select
          value={settings.tickLabelCountMode || 'all'}
          onValueChange={(v) => update({ tickLabelCountMode: v as TickLabelCountMode })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All</SelectItem>
            <SelectItem value="custom" className="text-xs">Custom count</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.tickLabelCountMode === 'custom' && (
        <NumberInput
          label="Label count"
          value={settings.tickLabelCount || 0}
          onChange={(v) => update({ tickLabelCount: v })}
          min={0}
          max={100}
          step={1}
        />
      )}

      {/* Individual label toggle */}
      {allTickLabels.length > 0 && (
        <SettingRow label="Toggle labels">
          <LabelVisibilityDropdown
            allLabels={allTickLabels}
            hiddenLabels={settings.hiddenTickLabels || []}
            onChange={(hidden) => update({ hiddenTickLabels: hidden })}
          />
        </SettingRow>
      )}

      {/* LAST LABEL PADDING */}
      <SubHeader>Last Label</SubHeader>
      <p className="text-[10px] text-gray-400 -mt-1 mb-2">
        Push the last (rightmost) tick label inward so it&apos;s not clipped.
      </p>

      <NumberInput
        label="Inward padding"
        value={settings.lastLabelPadding || 0}
        onChange={(v) => update({ lastLabelPadding: v })}
        min={0}
        max={100}
        step={1}
        suffix="px"
      />
    </AccordionSection>
  );
}
