'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { SettingRow } from '@/components/shared/SettingRow';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SliderWithInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function SliderWithInput({ label, value, onChange, min, max, step }: SliderWithInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-xs text-gray-600 shrink-0">{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              onChange(Math.max(min, Math.min(max, num)));
            }
          }}
          min={min}
          max={max}
          step={step}
          className="h-7 text-xs w-full"
        />
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

export function BarsSection() {
  const settings = useEditorStore((s) => s.settings.bars);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('bars', updates);
  };

  return (
    <AccordionSection id="bars" title="Bars">
      {/* Bar Height */}
      <SliderWithInput
        label="Bar height"
        value={settings.barHeight}
        onChange={(v) => update({ barHeight: v })}
        min={1}
        max={10}
        step={1}
      />

      {/* Bar Opacity */}
      <SliderWithInput
        label="Bar opacity"
        value={settings.barOpacity}
        onChange={(v) => update({ barOpacity: v })}
        min={0}
        max={1}
        step={0.05}
      />

      {/* Spacing (main) */}
      <SliderWithInput
        label="Spacing (main)"
        value={settings.spacingMain}
        onChange={(v) => update({ spacingMain: v })}
        min={0}
        max={1}
        step={0.05}
      />

      {/* Spacing (in stack) */}
      <SliderWithInput
        label="Spacing (in stack)"
        value={settings.spacingInStack}
        onChange={(v) => update({ spacingInStack: v })}
        min={0}
        max={1}
        step={0.05}
      />

      {/* Outline */}
      <SettingRow label="Outline" variant="inline">
        <Switch
          checked={settings.outline}
          onCheckedChange={(checked) => update({ outline: checked })}
        />
      </SettingRow>

      {settings.outline && (
        <div className="space-y-3 pl-2 border-l-2 border-gray-100">
          <ColorPicker
            label="Outline color"
            value={settings.outlineColor}
            onChange={(color) => update({ outlineColor: color })}
          />
          <NumberInput
            label="Outline width"
            value={settings.outlineWidth}
            onChange={(v) => update({ outlineWidth: v })}
            min={1}
            max={5}
            step={1}
            suffix="px"
          />
        </div>
      )}
    </AccordionSection>
  );
}
