'use client';

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
            <input
              type="number"
              value={customPreviewWidth}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 100;
                setCustomPreviewSize(Math.max(100, Math.min(3000, val)), customPreviewHeight);
              }}
              className="w-16 h-7 rounded-md border border-gray-200 px-2 text-xs text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={100}
              max={3000}
            />
            <span className="text-xs text-gray-400">×</span>
            <input
              type="number"
              value={customPreviewHeight}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 100;
                setCustomPreviewSize(customPreviewWidth, Math.max(100, Math.min(3000, val)));
              }}
              className="w-16 h-7 rounded-md border border-gray-200 px-2 text-xs text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={100}
              max={3000}
            />
            <span className="text-xs text-gray-400">px</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
