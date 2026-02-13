'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { ColorPicker } from '@/components/shared/ColorPicker';
import { NumberInput } from '@/components/shared/NumberInput';
import { SettingRow } from '@/components/shared/SettingRow';
import { Switch } from '@/components/ui/switch';

export function PlotBackgroundSection() {
  const settings = useEditorStore((s) => s.settings.plotBackground);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('plotBackground', updates);
  };

  return (
    <AccordionSection id="plot-background" title="Plot background">
      {/* Background color */}
      <ColorPicker
        label="Background color"
        value={settings.backgroundColor}
        onChange={(v) => update({ backgroundColor: v })}
      />

      {/* Border toggle */}
      <SettingRow label="Border">
        <Switch
          checked={settings.border}
          onCheckedChange={(v) => update({ border: v })}
        />
      </SettingRow>

      {/* Border options when enabled */}
      {settings.border && (
        <>
          <ColorPicker
            label="Border color"
            value={settings.borderColor}
            onChange={(v) => update({ borderColor: v })}
          />
          <NumberInput
            label="Border width"
            value={settings.borderWidth}
            onChange={(v) => update({ borderWidth: v })}
            min={1}
            max={5}
            suffix="px"
          />
        </>
      )}
    </AccordionSection>
  );
}
