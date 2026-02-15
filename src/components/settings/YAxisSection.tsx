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
import type { YAxisPosition, ScaleType, AxisTitleType, TickPosition, YAxisSpaceMode } from '@/types/chart';

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
          <SelectTrigger className="h-8 text-xs w-full">
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
          <SelectTrigger className="h-8 text-xs w-full">
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
          className="h-8 text-xs w-full"
          placeholder="Auto"
        />
      </SettingRow>

      <SettingRow label="Max">
        <Input
          value={settings.max}
          onChange={(e) => update({ max: e.target.value })}
          className="h-8 text-xs w-full"
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
          <SelectTrigger className="h-8 text-xs w-full">
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
            className="h-8 text-xs w-full"
            placeholder="Y axis title"
          />
        </SettingRow>
      )}

      <SettingRow label="Show styling" variant="inline">
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
              className="h-8 text-xs w-full"
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
              <SelectTrigger className="h-8 text-xs w-full">
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
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <NumberInput
        label="Label padding"
        value={settings.tickPadding}
        onChange={(v) => update({ tickPadding: v })}
        min={0}
        max={40}
        step={1}
        suffix="px"
      />

      <SettingRow label="Space mode">
        <Select
          value={settings.spaceMode}
          onValueChange={(v: YAxisSpaceMode) => update({ spaceMode: v })}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {settings.spaceMode === 'fixed' && (
        <NumberInput
          label="Label width"
          value={settings.spaceModeValue}
          onChange={(v) => update({ spaceModeValue: v })}
          step={1}
          suffix="px"
        />
      )}

      {/* Tick styling - Color, Size, Weight directly visible */}
      <ColorPicker
        label="Color"
        value={settings.tickStyling.color}
        onChange={(v) =>
          update({
            tickStyling: { ...settings.tickStyling, color: v },
          })
        }
      />

      <NumberInput
        label="Size"
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

      <SettingRow label="Weight">
        <div className="flex rounded-md border border-gray-200 overflow-hidden">
          {(['normal', 'bold'] as const).map((w) => (
            <button
              key={w}
              onClick={() =>
                update({
                  tickStyling: { ...settings.tickStyling, fontWeight: w },
                })
              }
              className={`px-3 py-1.5 text-xs transition-colors ${
                settings.tickStyling.fontWeight === w
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${w === 'bold' ? 'border-l border-gray-200' : ''}`}
            >
              {w === 'normal' ? 'Normal' : 'Bold'}
            </button>
          ))}
        </div>
      </SettingRow>

      <SettingRow label="Font family">
        <Select
          value={settings.tickStyling.fontFamily}
          onValueChange={(v) =>
            update({
              tickStyling: { ...settings.tickStyling, fontFamily: v },
            })
          }
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

      {/* ---- AXIS LINE ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Axis line
        </Label>
      </div>

      <SettingRow label="Show axis line" variant="inline">
        <Switch
          checked={settings.axisLine?.show ?? true}
          onCheckedChange={(v) =>
            update({
              axisLine: { ...(settings.axisLine || { show: true, width: 1, color: '#666666' }), show: v },
            })
          }
        />
      </SettingRow>

      {settings.axisLine?.show !== false && (
        <>
          <ColorPicker
            label="Color"
            value={settings.axisLine?.color || '#666666'}
            onChange={(v) =>
              update({
                axisLine: { ...(settings.axisLine || { show: true, width: 1, color: '#666666' }), color: v },
              })
            }
          />
          <NumberInput
            label="Width"
            value={settings.axisLine?.width || 1}
            onChange={(v) =>
              update({
                axisLine: { ...(settings.axisLine || { show: true, width: 1, color: '#666666' }), width: v },
              })
            }
            min={0.5}
            max={5}
            step={0.5}
            suffix="px"
          />
        </>
      )}

      {/* ---- GRIDLINES ---- */}
      <div className="pt-2 border-t border-gray-100">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Gridlines
        </Label>
      </div>

      <SettingRow label="Show gridlines" variant="inline">
        <Switch
          checked={settings.gridlines}
          onCheckedChange={(v) => update({ gridlines: v })}
        />
      </SettingRow>

      {settings.gridlines && (
        <>
          <SettingRow label="Show styling" variant="inline">
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
