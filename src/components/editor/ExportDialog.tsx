'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Download, FileImage, FileCode, FileText, FileType } from 'lucide-react';

type ExportFormat = 'png' | 'svg' | 'html' | 'pdf';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: ExportFormat;
  onExport: (format: ExportFormat, options: ExportOptions) => void;
  defaultWidth: number;
  defaultHeight: number;
}

export interface ExportOptions {
  width?: number;
  height?: number;
  transparent?: boolean;
}

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  png: <FileImage className="w-5 h-5" />,
  svg: <FileCode className="w-5 h-5" />,
  pdf: <FileText className="w-5 h-5" />,
  html: <FileType className="w-5 h-5" />,
};

const formatLabels: Record<ExportFormat, string> = {
  png: 'PNG Image',
  svg: 'SVG Vector',
  pdf: 'PDF Document',
  html: 'HTML Page',
};

export function ExportDialog({
  open,
  onOpenChange,
  format,
  onExport,
  defaultWidth,
  defaultHeight,
}: ExportDialogProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [transparent, setTransparent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Reset values when dialog opens
  useEffect(() => {
    if (open) {
      setWidth(Math.round(defaultWidth));
      setHeight(Math.round(defaultHeight));
      setTransparent(false);
      setIsExporting(false);
    }
  }, [open, defaultWidth, defaultHeight]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format, {
        width: width || undefined,
        height: height || undefined,
        transparent,
      });
    } finally {
      setIsExporting(false);
      onOpenChange(false);
    }
  };

  const supportsTransparency = format === 'png' || format === 'svg';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formatIcons[format]}
            Export as {formatLabels[format]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Width */}
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="export-width" className="text-sm whitespace-nowrap">
              Width (px)
            </Label>
            <Input
              id="export-width"
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
              className="h-8 w-32 text-sm"
              min={1}
            />
          </div>

          {/* Height */}
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="export-height" className="text-sm whitespace-nowrap">
              Height (px)
            </Label>
            <Input
              id="export-height"
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              className="h-8 w-32 text-sm"
              min={1}
            />
          </div>

          {/* Transparent background */}
          {supportsTransparency && (
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="export-transparent" className="text-sm">
                Transparent background
              </Label>
              <Switch
                id="export-transparent"
                checked={transparent}
                onCheckedChange={setTransparent}
              />
            </div>
          )}

          {/* Size info */}
          <p className="text-xs text-gray-400">
            Default size matches the current canvas dimensions. You can adjust the dimensions to export at a different size.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleExport} disabled={isExporting} className="gap-1.5">
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
