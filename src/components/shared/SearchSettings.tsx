'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/store/editorStore';

export function SearchSettings() {
  const { settingsSearchQuery, setSettingsSearchQuery } = useEditorStore();

  return (
    <div className="relative px-4 py-2">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      <Input
        value={settingsSearchQuery}
        onChange={(e) => setSettingsSearchQuery(e.target.value)}
        placeholder="Search for setting..."
        className="h-8 pl-7 pr-7 text-xs bg-gray-50 border-gray-200"
      />
      {settingsSearchQuery && (
        <button
          onClick={() => setSettingsSearchQuery('')}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
