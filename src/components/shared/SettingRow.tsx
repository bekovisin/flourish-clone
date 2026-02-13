'use client';

import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface SettingRowProps {
  label: string;
  children: ReactNode;
  description?: string;
}

export function SettingRow({ label, children, description }: SettingRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <Label className="text-xs text-gray-600 shrink-0">{label}</Label>
        <div className="flex-1 flex justify-end">{children}</div>
      </div>
      {description && <p className="text-[10px] text-gray-400">{description}</p>}
    </div>
  );
}
