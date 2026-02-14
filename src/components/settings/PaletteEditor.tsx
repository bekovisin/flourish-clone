'use client';

import { useState, useCallback } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GripVertical, Plus, Trash2, Save } from 'lucide-react';

interface PaletteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: string[];
  onApply: (colors: string[]) => void;
  onSaveAsTheme: (name: string, colors: string[]) => void;
}

export function PaletteEditor({
  open,
  onOpenChange,
  colors: initialColors,
  onApply,
  onSaveAsTheme,
}: PaletteEditorProps) {
  const [colors, setColors] = useState<string[]>(initialColors);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [themeName, setThemeName] = useState('');

  // Reset colors when dialog opens with new initial colors
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        setColors(initialColors);
      }
      onOpenChange(newOpen);
    },
    [initialColors, onOpenChange]
  );

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 1) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors([...colors, '#888888']);
  };

  const moveColor = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= colors.length) return;
    const newColors = [...colors];
    [newColors[index], newColors[newIndex]] = [newColors[newIndex], newColors[index]];
    setColors(newColors);
  };

  const handleApply = () => {
    onApply(colors);
    onOpenChange(false);
  };

  const handleSaveAsTheme = () => {
    if (!themeName.trim()) return;
    onSaveAsTheme(themeName.trim(), colors);
    setThemeName('');
    setShowSaveDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Edit Color Palette</DialogTitle>
          </DialogHeader>

          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 group">
                {/* Grip / Reorder buttons */}
                <div className="flex flex-col shrink-0">
                  <button
                    onClick={() => moveColor(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30 p-0 leading-none"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color swatch with picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="w-8 h-8 rounded-md border border-gray-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start" side="right">
                    <div className="space-y-3">
                      <HexColorPicker color={color} onChange={(c) => updateColor(index, c)} />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">#</span>
                        <HexColorInput
                          color={color}
                          onChange={(c) => updateColor(index, c)}
                          className="flex h-8 w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                          prefixed={false}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Hex value display */}
                <span className="text-xs font-mono text-gray-500 flex-1">{color}</span>

                {/* Delete button */}
                <button
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 1}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-opacity p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add color */}
          <button
            onClick={addColor}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 py-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add color
          </button>

          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="gap-1.5 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Save as theme
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply} className="text-xs">
                Apply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save as theme dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Save as Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">Theme name</label>
              <Input
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="My custom theme..."
                className="h-8 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAsTheme();
                }}
              />
            </div>
            {/* Preview */}
            <div className="flex gap-0.5">
              {colors.slice(0, 10).map((color, i) => (
                <div
                  key={i}
                  className="h-5 flex-1 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAsTheme}
              disabled={!themeName.trim()}
              className="text-xs"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
