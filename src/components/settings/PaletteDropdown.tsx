'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Pencil } from 'lucide-react';
import { colorPalettes, getPaletteColors } from '@/lib/chart/palettes';

interface PaletteDropdownProps {
  selectedPaletteId: string;
  customPaletteColors?: string[];
  onSelectPalette: (paletteId: string) => void;
  onEditPalette: () => void;
}

function PaletteStrip({ colors, size = 'sm' }: { colors: string[]; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-3' : 'h-4';
  return (
    <div className="flex gap-0.5">
      {colors.slice(0, 8).map((color, i) => (
        <div
          key={i}
          className={`${h} w-4 rounded-[2px]`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export function PaletteDropdown({
  selectedPaletteId,
  customPaletteColors,
  onSelectPalette,
  onEditPalette,
}: PaletteDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentColors = getPaletteColors(selectedPaletteId, customPaletteColors);
  const currentPalette = colorPalettes.find((p) => p.id === selectedPaletteId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <PaletteStrip colors={currentColors} size="md" />
            <span className="text-xs text-gray-600 truncate">
              {customPaletteColors && customPaletteColors.length > 0
                ? 'Custom'
                : currentPalette?.name || 'Select palette'}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Edit palette button */}
        <button
          onClick={() => {
            setOpen(false);
            onEditPalette();
          }}
          className="flex items-center gap-2 w-full px-3 py-2.5 border-b text-xs text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit color palette
        </button>

        {/* Palette list */}
        <div className="max-h-64 overflow-y-auto py-1">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => {
                onSelectPalette(palette.id);
                setOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                selectedPaletteId === palette.id && !customPaletteColors?.length
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              <PaletteStrip colors={palette.colors} />
              <span className="text-gray-700 truncate">{palette.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
