'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { AnimationType } from '@/types/chart';

const animationTypeOptions: { value: AnimationType; label: string }[] = [
  { value: 'gradual', label: 'Gradual' },
  { value: 'grow', label: 'Grow' },
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
];

export function AnimationsSection() {
  const settings = useEditorStore((s) => s.settings.animations);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('animations', updates);
  };

  return (
    <AccordionSection id="animations" title="Animations">
      {/* Enable Animations */}
      <SettingRow label="Enable animations" variant="inline">
        <Switch
          checked={settings.enabled}
          onCheckedChange={(checked) => update({ enabled: checked })}
        />
      </SettingRow>

      {settings.enabled && (
        <>
          {/* Duration */}
          <NumberInput
            label="Duration"
            value={settings.duration}
            onChange={(v) => update({ duration: v })}
            min={100}
            max={5000}
            step={50}
            suffix="ms"
          />

          {/* Animation Type */}
          <SettingRow label="Animation type">
            <Select
              value={settings.type}
              onValueChange={(v) => update({ type: v as AnimationType })}
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animationTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
        </>
      )}
    </AccordionSection>
  );
}
