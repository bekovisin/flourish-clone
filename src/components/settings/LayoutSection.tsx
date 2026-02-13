'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { NumberInput } from '@/components/shared/NumberInput';
import { ColorPicker } from '@/components/shared/ColorPicker';

export function LayoutSection() {
  const settings = useEditorStore((s) => s.settings.layout);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('layout', updates);
  };

  return (
    <AccordionSection id="layout" title="Layout">
      {/* Max Width */}
      <NumberInput
        label="Max width"
        value={settings.maxWidth}
        onChange={(v) => update({ maxWidth: v })}
        min={0}
        suffix="px"
      />
      <p className="text-[10px] text-gray-400 -mt-2 ml-[88px]">
        Set to 0 for no limit
      </p>

      {/* Padding - 2x2 Grid */}
      <div className="space-y-1.5">
        <span className="text-xs text-gray-500 font-medium">Padding</span>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Top"
            value={settings.paddingTop}
            onChange={(v) => update({ paddingTop: v })}
            min={0}
            suffix="px"
          />
          <NumberInput
            label="Right"
            value={settings.paddingRight}
            onChange={(v) => update({ paddingRight: v })}
            min={0}
            suffix="px"
          />
          <NumberInput
            label="Bottom"
            value={settings.paddingBottom}
            onChange={(v) => update({ paddingBottom: v })}
            min={0}
            suffix="px"
          />
          <NumberInput
            label="Left"
            value={settings.paddingLeft}
            onChange={(v) => update({ paddingLeft: v })}
            min={0}
            suffix="px"
          />
        </div>
      </div>

      {/* Background Color */}
      <ColorPicker
        label="Background"
        value={settings.backgroundColor}
        onChange={(color) => update({ backgroundColor: color })}
      />
    </AccordionSection>
  );
}
