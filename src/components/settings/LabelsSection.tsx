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
import type {
  BarLabelStyle,
  DataPointLabelPosition,
  DataPointLabelColorMode,
  StackLabelMode,
  LabelsSettings,
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
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'system-ui',
];

export function LabelsSection() {
  const settings = useEditorStore((s) => s.settings.labels);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<LabelsSettings>) => {
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
          <SelectTrigger className="h-8 text-xs w-full">
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

      <SettingRow label="Show labels on data points" variant="inline">
        <Switch
          checked={settings.showDataPointLabels}
          onCheckedChange={(checked) => update({ showDataPointLabels: checked })}
        />
      </SettingRow>

      {settings.showDataPointLabels && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <SettingRow label="Position">
            <Select
              value={settings.dataPointPosition}
              onValueChange={(v) =>
                update({ dataPointPosition: v as DataPointLabelPosition })
              }
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left" className="text-xs">Left</SelectItem>
                <SelectItem value="center" className="text-xs">Center</SelectItem>
                <SelectItem value="right" className="text-xs">Right</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow label="Custom padding" variant="inline">
            <Switch
              checked={settings.dataPointCustomPadding}
              onCheckedChange={(checked) => update({ dataPointCustomPadding: checked })}
            />
          </SettingRow>

          {settings.dataPointCustomPadding && (
            <div className="space-y-2 pl-2 border-l-2 border-gray-100">
              <NumberInput
                label="Top"
                value={settings.dataPointPaddingTop}
                onChange={(v) => update({ dataPointPaddingTop: v })}
                min={-50}
                max={50}
                step={1}
                suffix="px"
              />
              <NumberInput
                label="Right"
                value={settings.dataPointPaddingRight}
                onChange={(v) => update({ dataPointPaddingRight: v })}
                min={-50}
                max={50}
                step={1}
                suffix="px"
              />
              <NumberInput
                label="Bottom"
                value={settings.dataPointPaddingBottom}
                onChange={(v) => update({ dataPointPaddingBottom: v })}
                min={-50}
                max={50}
                step={1}
                suffix="px"
              />
              <NumberInput
                label="Left"
                value={settings.dataPointPaddingLeft}
                onChange={(v) => update({ dataPointPaddingLeft: v })}
                min={-50}
                max={50}
                step={1}
                suffix="px"
              />
            </div>
          )}

          <SettingRow label="Font family">
            <Select
              value={settings.dataPointFontFamily}
              onValueChange={(v) => update({ dataPointFontFamily: v })}
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
            value={settings.dataPointFontSize}
            onChange={(v) => update({ dataPointFontSize: v })}
            min={6}
            max={48}
            step={1}
            suffix="px"
          />

          <SettingRow label="Font weight">
            <Select
              value={settings.dataPointFontWeight}
              onValueChange={(v) => update({ dataPointFontWeight: v as 'normal' | 'bold' })}
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

          <SettingRow label="Color mode">
            <Select
              value={settings.dataPointColorMode}
              onValueChange={(v) => update({ dataPointColorMode: v as DataPointLabelColorMode })}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto" className="text-xs">Auto (contrast)</SelectItem>
                <SelectItem value="custom" className="text-xs">Custom</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          {settings.dataPointColorMode === 'custom' && (
            <ColorPicker
              label="Color"
              value={settings.dataPointColor}
              onChange={(color) => update({ dataPointColor: color })}
            />
          )}
        </div>
      )}

      {/* STACK LABELS */}
      <SubHeader>Stack Labels</SubHeader>

      <SettingRow label="Stack labels">
        <Select
          value={settings.stackLabelMode}
          onValueChange={(v) => update({ stackLabelMode: v as StackLabelMode })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
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
