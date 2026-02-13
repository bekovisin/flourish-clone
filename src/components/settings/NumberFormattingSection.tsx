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
import { Input } from '@/components/ui/input';
import type { ThousandsSeparator, DecimalSeparator } from '@/types/chart';

export function NumberFormattingSection() {
  const settings = useEditorStore((s) => s.settings.numberFormatting);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('numberFormatting', updates);
  };

  return (
    <AccordionSection id="number-formatting" title="Number formatting">
      {/* Decimal places */}
      <NumberInput
        label="Decimal places"
        value={settings.decimalPlaces}
        onChange={(v) => update({ decimalPlaces: v })}
        min={0}
        max={10}
      />

      {/* Thousands separator */}
      <SettingRow label="Thousands separator">
        <Select
          value={settings.thousandsSeparator}
          onValueChange={(v: ThousandsSeparator) =>
            update({ thousandsSeparator: v })
          }
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=",">, (comma)</SelectItem>
            <SelectItem value=".">. (dot)</SelectItem>
            <SelectItem value=" ">(space)</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Decimal separator */}
      <SettingRow label="Decimal separator">
        <Select
          value={settings.decimalSeparator}
          onValueChange={(v: DecimalSeparator) =>
            update({ decimalSeparator: v })
          }
        >
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=".">. (dot)</SelectItem>
            <SelectItem value=",">, (comma)</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Prefix */}
      <SettingRow label="Prefix">
        <Input
          value={settings.prefix}
          onChange={(e) => update({ prefix: e.target.value })}
          className="h-8 text-xs w-[140px]"
          placeholder="e.g. $"
        />
      </SettingRow>

      {/* Suffix */}
      <SettingRow label="Suffix">
        <Input
          value={settings.suffix}
          onChange={(e) => update({ suffix: e.target.value })}
          className="h-8 text-xs w-[140px]"
          placeholder="e.g. %"
        />
      </SettingRow>
    </AccordionSection>
  );
}
