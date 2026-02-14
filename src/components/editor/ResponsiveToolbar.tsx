'use client';

import { useState, useEffect } from 'react';
import { useEditorStore, PreviewDevice } from '@/store/editorStore';
import { Monitor, Tablet, Smartphone, Maximize2, Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const devices: { id: PreviewDevice; icon: React.ReactNode; label: string }[] = [
  { id: 'fullscreen', icon: <Maximize2 className="w-4 h-4" />, label: 'Fullscreen' },
  { id: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
  { id: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
  { id: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  { id: 'custom', icon: <Settings2 className="w-4 h-4" />, label: 'Custom size' },
];

function DimensionInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      onBlur={() => {
        const num = parseInt(localValue);
        if (!isNaN(num) && num >= 100 && num <= 3000) {
          onChange(num);
        } else {
          setLocalValue(String(value));
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const num = parseInt(localValue);
          if (!isNaN(num) && num >= 100 && num <= 3000) {
            onChange(num);
          } else {
            setLocalValue(String(value));
          }
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-16 h-7 rounded-md border border-gray-200 px-2 text-xs text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function ResponsiveToolbar() {
  const {
    previewDevice,
    setPreviewDevice,
    customPreviewWidth,
    customPreviewHeight,
    setCustomPreviewSize,
  } = useEditorStore();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
          {devices.map((device) => (
            <Tooltip key={device.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPreviewDevice(device.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                    previewDevice === device.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {device.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {device.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {previewDevice === 'custom' && (
          <div className="flex items-center gap-1.5 ml-1">
            <DimensionInput
              value={customPreviewWidth}
              onChange={(w) => setCustomPreviewSize(w, customPreviewHeight)}
            />
            <span className="text-xs text-gray-400">×</span>
            <DimensionInput
              value={customPreviewHeight}
              onChange={(h) => setCustomPreviewSize(customPreviewWidth, h)}
            />
            <span className="text-xs text-gray-400">px</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
