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
import type { BarLabelStyle, DataPointLabelPosition, StackLabelMode } from '@/types/chart';

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2 pb-1">
      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {children}
      </h4>
    </div>
  );
}

export function LabelsSection() {
  const settings = useEditorStore((s) => s.settings.labels);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('labels', updates);
  };

  return (
    <AccordionSection id="labels" title="Labels">
      {/* BAR LABELS */}
      <SubHeader>Bar Labels</SubHeader>

      <SettingRow label="Label style">
        <Select
          value={settings.barLabelStyle}
          onValueChange={(v) => update({ barLabelStyle: v as BarLabelStyle })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above_bars" className="text-xs">Above bars</SelectItem>
            <SelectItem value="axis" className="text-xs">Axis</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* DATA POINT LABELS */}
      <SubHeader>Data Point Labels</SubHeader>

      <SettingRow label="Show labels on data points">
        <Switch
          checked={settings.showDataPointLabels}
          onCheckedChange={(checked) => update({ showDataPointLabels: checked })}
        />
      </SettingRow>

      {settings.showDataPointLabels && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <NumberInput
            label="Font size"
            value={settings.dataPointFontSize}
            onChange={(v) => update({ dataPointFontSize: v })}
            min={6}
            max={48}
            step={1}
            suffix="px"
          />

          <ColorPicker
            label="Color"
            value={settings.dataPointColor}
            onChange={(color) => update({ dataPointColor: color })}
          />

          <SettingRow label="Position">
            <Select
              value={settings.dataPointPosition}
              onValueChange={(v) =>
                update({ dataPointPosition: v as DataPointLabelPosition })
              }
            >
              <SelectTrigger className="h-8 text-xs w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inside" className="text-xs">Inside</SelectItem>
                <SelectItem value="outside" className="text-xs">Outside</SelectItem>
                <SelectItem value="center" className="text-xs">Center</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      )}

      {/* STACK LABELS */}
      <SubHeader>Stack Labels</SubHeader>

      <SettingRow label="Stack labels">
        <Select
          value={settings.stackLabelMode}
          onValueChange={(v) => update({ stackLabelMode: v as StackLabelMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="text-xs">None</SelectItem>
            <SelectItem value="net_sum" className="text-xs">Net sum</SelectItem>
            <SelectItem value="separate" className="text-xs">Separate +/-</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>
    </AccordionSection>
  );
}
