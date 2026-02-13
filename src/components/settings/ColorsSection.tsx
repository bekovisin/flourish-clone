'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { SettingRow } from '@/components/shared/SettingRow';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { colorPalettes } from '@/lib/chart/palettes';
import type { ColorMode } from '@/types/chart';

export function ColorsSection() {
  const settings = useEditorStore((s) => s.settings.colors);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('colors', updates);
  };

  return (
    <AccordionSection id="colors" title="Colors">
      {/* Color Mode */}
      <SettingRow label="Color mode">
        <Select
          value={settings.colorMode}
          onValueChange={(v) => update({ colorMode: v as ColorMode })}
        >
          <SelectTrigger className="h-8 text-xs w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="by_column" className="text-xs">By column</SelectItem>
            <SelectItem value="by_row" className="text-xs">By row</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      {/* Palette Selector */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Palette</Label>
        <div className="grid gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => update({ palette: palette.id })}
              className={`flex items-center gap-3 px-3 py-2 rounded-md border transition-all text-left ${
                settings.palette === palette.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex gap-0.5 shrink-0">
                {palette.colors.slice(0, 8).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 truncate">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Extend */}
      <SettingRow label="Extend">
        <Switch
          checked={settings.extend}
          onCheckedChange={(checked) => update({ extend: checked })}
        />
      </SettingRow>

      {/* Custom Overrides */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600">Custom overrides</Label>
        <Textarea
          value={settings.customOverrides}
          onChange={(e) => update({ customOverrides: e.target.value })}
          placeholder={"SeriesName: #hexcolor\nAnother Series: #ff0000"}
          className="text-xs font-mono min-h-[80px] resize-y"
          rows={4}
        />
        <p className="text-[10px] text-gray-400">
          Format: SeriesName: #hexcolor (one per line)
        </p>
      </div>
    </AccordionSection>
  );
}
