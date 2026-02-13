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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PopupStyle } from '@/types/chart';

export function PopupsPanelsSection() {
  const settings = useEditorStore((s) => s.settings.popupsPanels);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('popupsPanels', updates);
  };

  return (
    <AccordionSection id="popups-panels" title="Popups &amp; panels">
      {/* Show popup */}
      <SettingRow label="Show popup">
        <Switch
          checked={settings.showPopup}
          onCheckedChange={(v) => update({ showPopup: v })}
        />
      </SettingRow>

      {settings.showPopup && (
        <>
          {/* Popup content */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Popup content</Label>
            <Textarea
              value={settings.popupContent}
              onChange={(e) => update({ popupContent: e.target.value })}
              className="text-xs min-h-[80px] font-mono"
              placeholder="Use {{column_name}} for dynamic values"
            />
          </div>

          {/* Popup style */}
          <SettingRow label="Popup style">
            <Select
              value={settings.popupStyle}
              onValueChange={(v: PopupStyle) => update({ popupStyle: v })}
            >
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </>
      )}
    </AccordionSection>
  );
}
