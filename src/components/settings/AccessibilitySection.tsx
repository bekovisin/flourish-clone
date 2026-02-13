'use client';

import { useEditorStore } from '@/store/editorStore';
import { AccordionSection } from '@/components/settings/AccordionSection';
import { Textarea } from '@/components/ui/textarea';

export function AccessibilitySection() {
  const settings = useEditorStore((s) => s.settings.accessibility);
  const updateSettings = useEditorStore((s) => s.updateSettings);

  const update = (updates: Partial<typeof settings>) => {
    updateSettings('accessibility', updates);
  };

  return (
    <AccordionSection id="accessibility" title="Accessibility">
      {/* Alternative Description */}
      <div className="space-y-1.5">
        <span className="text-xs text-gray-600">Alternative description</span>
        <Textarea
          value={settings.alternativeDescription}
          onChange={(e) => update({ alternativeDescription: e.target.value })}
          className="text-xs min-h-[80px] resize-y"
          placeholder="Provide an alternative text description of the visualization. This is used by screen readers and other assistive technologies to describe the content to users who cannot see the chart."
        />
        <p className="text-[10px] text-gray-400">
          A text alternative to the visualization, used by screen readers and assistive technologies.
        </p>
      </div>

      {/* Alt Text for Chart */}
      <div className="space-y-1.5">
        <span className="text-xs text-gray-600">Alt text for chart</span>
        <Textarea
          value={settings.altText}
          onChange={(e) => update({ altText: e.target.value })}
          className="text-xs min-h-[80px] resize-y"
          placeholder="Describe the key information or trends shown in the chart for users who cannot view it visually."
        />
      </div>
    </AccordionSection>
  );
}
