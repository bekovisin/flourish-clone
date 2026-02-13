'use client';

import { useEditorStore, PreviewDevice } from '@/store/editorStore';
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const devices: { id: PreviewDevice; icon: React.ReactNode; label: string }[] = [
  { id: 'fullscreen', icon: <Maximize2 className="w-4 h-4" />, label: 'Fullscreen' },
  { id: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
  { id: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
  { id: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
];

export function ResponsiveToolbar() {
  const { previewDevice, setPreviewDevice } = useEditorStore();

  return (
    <TooltipProvider>
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
    </TooltipProvider>
  );
}
