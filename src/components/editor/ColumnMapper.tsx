'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, X } from 'lucide-react';

export function ColumnMapper() {
  const { data, columnMapping, setColumnMapping } = useEditorStore();

  const availableColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const autoSetColumns = () => {
    if (availableColumns.length === 0) return;
    const labels = availableColumns[0];
    const values = availableColumns.slice(1);
    setColumnMapping({ ...columnMapping, labels, values });
  };

  const toggleValue = (col: string) => {
    const current = columnMapping.values || [];
    if (current.includes(col)) {
      setColumnMapping({
        ...columnMapping,
        values: current.filter((c) => c !== col),
      });
    } else {
      setColumnMapping({
        ...columnMapping,
        values: [...current, col],
      });
    }
  };

  return (
    <div className="w-[260px] border-l bg-white flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Column mapping
        </h3>
        <Button variant="ghost" size="sm" onClick={autoSetColumns} className="gap-1 text-xs h-7">
          <Wand2 className="w-3 h-3" />
          Auto
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Labels / Time (REQUIRED) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-xs font-medium text-gray-700">Labels / time</Label>
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 text-red-500 border-red-200">
                REQUIRED
              </Badge>
            </div>
            <Select
              value={columnMapping.labels || ''}
              onValueChange={(val) => setColumnMapping({ ...columnMapping, labels: val })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {availableColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Values */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">Values</Label>
            <div className="space-y-1">
              {availableColumns
                .filter((col) => col !== columnMapping.labels)
                .map((col) => {
                  const isSelected = (columnMapping.values || []).includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleValue(col)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <span>{col}</span>
                      {isSelected && <X className="w-3 h-3" />}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Charts grid (optional) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">Charts grid</Label>
            <Select
              value={columnMapping.chartsGrid || ''}
              onValueChange={(val) =>
                setColumnMapping({ ...columnMapping, chartsGrid: val || undefined })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="None (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">
                  None
                </SelectItem>
                {availableColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row filter (optional) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">Row filter</Label>
            <Select
              value={columnMapping.rowFilter || ''}
              onValueChange={(val) =>
                setColumnMapping({ ...columnMapping, rowFilter: val || undefined })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="None (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">
                  None
                </SelectItem>
                {availableColumns.map((col) => (
                  <SelectItem key={col} value={col} className="text-xs">
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info for custom popups (optional) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">Info for custom popups</Label>
            <div className="space-y-1">
              {availableColumns.map((col) => {
                const isSelected = (columnMapping.infoPopups || []).includes(col);
                return (
                  <button
                    key={col}
                    onClick={() => {
                      const current = columnMapping.infoPopups || [];
                      setColumnMapping({
                        ...columnMapping,
                        infoPopups: isSelected
                          ? current.filter((c) => c !== col)
                          : [...current, col],
                      });
                    }}
                    className={`flex items-center w-full px-2.5 py-1 rounded text-xs ${
                      isSelected ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span>{col}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
