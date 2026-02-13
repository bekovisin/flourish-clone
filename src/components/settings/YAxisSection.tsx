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
import type { YAxisPosition, ScaleType, AxisTitleType, TickPosition } from '@/types/chart';

export function YAxisSection() {
  const settings = useEditorStore((s) => s.settings.yAxis);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('yAxis', updates);
  };

  return (
    <AccordionSection id="y-axis" title="Y axis">
      {/* Position */}
      <SettingRow label="Position">
        <Select
          value={settings.position}
          onValueChange={(v: YAxisPosition) => update({ position: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Scale type */}
      <SettingRow label="Scale type">
        <Select
          value={settings.scaleType}
          onValueChange={(v: ScaleType) => update({ scaleType: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="log">Log</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Min / Max */}
      <SettingRow label="Min">
        <Input
          value={settings.min}
          onChange={(e) => update({ min: e.target.value })}
          className="h-8 text-xs w-[140px]"
          placeholder="Auto"
        />
      </SettingRow>

      <SettingRow label="Max">
        <Input
          value={settings.max}
          onChange={(e) => update({ max: e.target.value })}
          className="h-8 text-xs w-[140px]"
          placeholder="Auto"
        />
      </SettingRow>

      {/* ---- AXIS TITLE ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Axis title
        </Label>
      </div>

      <SettingRow label="Title type">
        <Select
          value={settings.titleType}
          onValueChange={(v: AxisTitleType) => update({ titleType: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.titleType === 'custom' && (
        <SettingRow label="Title text">
          <Input
            value={settings.titleText}
            onChange={(e) => update({ titleText: e.target.value })}
            className="h-8 text-xs w-[140px]"
            placeholder="Y axis title"
          />
        </SettingRow>
      )}

      <SettingRow label="Show styling">
        <Switch
          checked={settings.showTitleStyling}
          onCheckedChange={(v) => update({ showTitleStyling: v })}
        />
      </SettingRow>

      {settings.showTitleStyling && (
        <>
          <SettingRow label="Font family">
            <Input
              value={settings.titleStyling.fontFamily}
              onChange={(e) =>
                update({
                  titleStyling: { ...settings.titleStyling, fontFamily: e.target.value },
                })
              }
              className="h-8 text-xs w-[140px]"
            />
          </SettingRow>
          <NumberInput
            label="Font size"
            value={settings.titleStyling.fontSize}
            onChange={(v) =>
              update({
                titleStyling: { ...settings.titleStyling, fontSize: v },
              })
            }
            min={6}
            max={48}
            suffix="px"
          />
          <SettingRow label="Font weight">
            <Select
              value={settings.titleStyling.fontWeight}
              onValueChange={(v: 'normal' | 'bold') =>
                update({
                  titleStyling: { ...settings.titleStyling, fontWeight: v },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <ColorPicker
            label="Color"
            value={settings.titleStyling.color}
            onChange={(v) =>
              update({
                titleStyling: { ...settings.titleStyling, color: v },
              })
            }
          />
        </>
      )}

      {/* ---- TICKS & LABELS ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Ticks &amp; labels
        </Label>
      </div>

      <SettingRow label="Tick position">
        <Select
          value={settings.tickPosition}
          onValueChange={(v: TickPosition) => update({ tickPosition: v })}
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Show styling">
        <Switch
          checked={settings.showTickStyling}
          onCheckedChange={(v) => update({ showTickStyling: v })}
        />
      </SettingRow>

      {settings.showTickStyling && (
        <>
          <SettingRow label="Font family">
            <Input
              value={settings.tickStyling.fontFamily}
              onChange={(e) =>
                update({
                  tickStyling: { ...settings.tickStyling, fontFamily: e.target.value },
                })
              }
              className="h-8 text-xs w-[140px]"
            />
          </SettingRow>
          <NumberInput
            label="Font size"
            value={settings.tickStyling.fontSize}
            onChange={(v) =>
              update({
                tickStyling: { ...settings.tickStyling, fontSize: v },
              })
            }
            min={6}
            max={48}
            suffix="px"
          />
          <SettingRow label="Font weight">
            <Select
              value={settings.tickStyling.fontWeight}
              onValueChange={(v: 'normal' | 'bold') =>
                update({
                  tickStyling: { ...settings.tickStyling, fontWeight: v },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <ColorPicker
            label="Color"
            value={settings.tickStyling.color}
            onChange={(v) =>
              update({
                tickStyling: { ...settings.tickStyling, color: v },
              })
            }
          />
        </>
      )}

      {/* ---- GRIDLINES ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Gridlines
        </Label>
      </div>

      <SettingRow label="Show gridlines">
        <Switch
          checked={settings.gridlines}
          onCheckedChange={(v) => update({ gridlines: v })}
        />
      </SettingRow>

      {settings.gridlines && (
        <>
          <SettingRow label="Show styling">
            <Switch
              checked={settings.showGridlineStyling}
              onCheckedChange={(v) => update({ showGridlineStyling: v })}
            />
          </SettingRow>

          {settings.showGridlineStyling && (
            <>
              <ColorPicker
                label="Color"
                value={settings.gridlineStyling.color}
                onChange={(v) =>
                  update({
                    gridlineStyling: { ...settings.gridlineStyling, color: v },
                  })
                }
              />
              <NumberInput
                label="Width"
                value={settings.gridlineStyling.width}
                onChange={(v) =>
                  update({
                    gridlineStyling: { ...settings.gridlineStyling, width: v },
                  })
                }
                min={0.5}
                max={5}
                step={0.5}
                suffix="px"
              />
              <NumberInput
                label="Dash array"
                value={settings.gridlineStyling.dashArray}
                onChange={(v) =>
                  update({
                    gridlineStyling: { ...settings.gridlineStyling, dashArray: v },
                  })
                }
                min={0}
                max={20}
              />
            </>
          )}
        </>
      )}
    </AccordionSection>
  );
}
