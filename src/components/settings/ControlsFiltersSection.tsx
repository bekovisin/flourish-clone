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
import { Switch } from '@/components/ui/switch';
import type { FilterMode, ControlPosition } from '@/types/chart';

const controlPositionLabels: Record<ControlPosition, string> = {
  top_left: 'Top left',
  top_right: 'Top right',
  bottom_left: 'Bottom left',
  bottom_right: 'Bottom right',
};

export function ControlsFiltersSection() {
  const settings = useEditorStore((s) => s.settings.controlsFilters);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('controlsFilters', updates);
  };

  return (
    <AccordionSection id="controls-filters" title="Controls & filters">
      {/* Series Filter */}
      <SettingRow label="Series filter">
        <Select
          value={settings.seriesFilter}
          onValueChange={(v) => update({ seriesFilter: v as FilterMode })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off" className="text-xs">Off</SelectItem>
            <SelectItem value="single_select" className="text-xs">Single select</SelectItem>
            <SelectItem value="multi_select" className="text-xs">Multi select</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Max Series to Show */}
      <NumberInput
        label="Max series to show"
        value={settings.maxSeriesToShow}
        onChange={(v) => update({ maxSeriesToShow: v })}
        min={1}
        max={100}
      />

      {/* Filter Rows with No Data */}
      <SettingRow label="Filter rows with no data" variant="inline">
        <Switch
          checked={settings.filterRowsNoData}
          onCheckedChange={(checked) => update({ filterRowsNoData: checked })}
        />
      </SettingRow>

      {/* Control Position */}
      <SettingRow label="Control position">
        <Select
          value={settings.controlPosition}
          onValueChange={(v) => update({ controlPosition: v as ControlPosition })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(controlPositionLabels) as [ControlPosition, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </SettingRow>
    </AccordionSection>
  );
}
