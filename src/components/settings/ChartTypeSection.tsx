'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type {
  ChartType,
  StackSortMode,
  GridMode,
  HeightMode,
  AggregationMode,
  SortMode,
} from '@/types/chart';

const chartTypeOptions: { value: ChartType; label: string }[] = [
  { value: 'bar_stacked', label: 'Bar chart (stacked)' },
  { value: 'bar_grouped', label: 'Bar chart (grouped)' },
  { value: 'bar_stacked_100', label: 'Bar chart (stacked 100%)' },
  { value: 'column_stacked', label: 'Column chart (stacked)' },
  { value: 'column_grouped', label: 'Column chart (grouped)' },
  { value: 'column_stacked_100', label: 'Column chart (stacked 100%)' },
];

const stackSortOptions: { value: StackSortMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'ascending', label: 'Ascending' },
  { value: 'descending', label: 'Descending' },
];

export function ChartTypeSection() {
  const settings = useEditorStore((s) => s.settings.chartType);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('chartType', updates);
  };

  return (
    <AccordionSection id="chart-type" title="Chart type" defaultOpen>
      {/* Chart Type */}
      <SettingRow label="Chart type">
        <Select
          value={settings.chartType}
          onValueChange={(v) => update({ chartType: v as ChartType })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chartTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Stack Sort Mode - 3-button toggle */}
      <SettingRow label="Stack sort mode">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {stackSortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ stackSortMode: opt.value })}
              className={`px-3 py-1.5 text-xs transition-colors ${
                settings.stackSortMode === opt.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${opt.value !== 'normal' ? 'border-l border-gray-200' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SettingRow>

      {/* Grid Mode */}
      <SettingRow label="Grid mode">
        <Select
          value={settings.gridMode}
          onValueChange={(v) => update({ gridMode: v as GridMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single" className="text-xs">Single chart</SelectItem>
            <SelectItem value="grid" className="text-xs">Grid of charts</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Height Mode */}
      <SettingRow label="Height mode">
        <Select
          value={settings.heightMode}
          onValueChange={(v) => update({ heightMode: v as HeightMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto" className="text-xs">Auto</SelectItem>
            <SelectItem value="standard" className="text-xs">Standard</SelectItem>
            <SelectItem value="aspect_ratio" className="text-xs">Aspect ratio</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.heightMode === 'standard' && (
        <NumberInput
          label="Height (px)"
          value={settings.standardHeight}
          onChange={(v) => update({ standardHeight: v })}
          min={100}
          max={2000}
          step={10}
          suffix="px"
        />
      )}

      {settings.heightMode === 'aspect_ratio' && (
        <NumberInput
          label="Aspect ratio"
          value={settings.aspectRatio}
          onChange={(v) => update({ aspectRatio: v })}
          min={0.1}
          max={5}
          step={0.1}
        />
      )}

      {/* Aggregation Mode */}
      <SettingRow label="Aggregation mode">
        <Select
          value={settings.aggregationMode}
          onValueChange={(v) => update({ aggregationMode: v as AggregationMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-xs">None</SelectItem>
            <SelectItem value="sum" className="text-xs">Sum</SelectItem>
            <SelectItem value="average" className="text-xs">Average</SelectItem>
            <SelectItem value="count" className="text-xs">Count</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Sort Mode */}
      <SettingRow label="Sort mode">
        <Select
          value={settings.sortMode}
          onValueChange={(v) => update({ sortMode: v as SortMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_sheet" className="text-xs">Data sheet</SelectItem>
            <SelectItem value="value" className="text-xs">Value</SelectItem>
            <SelectItem value="label" className="text-xs">Label</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </AccordionSection>
  );
}
