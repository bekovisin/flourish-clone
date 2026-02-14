'use client';

import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface SettingRowProps {
  label: string;
  children: ReactNode;
  description?: string;
  variant?: 'stacked' | 'inline';
}

export function SettingRow({ label, children, description, variant = 'stacked' }: SettingRowProps) {
  if (variant === 'inline') {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <Label className="text-xs text-gray-600 shrink-0">{label}</Label>
          <div className="shrink-0">{children}</div>
        </div>
        {description && <p className="text-[10px] text-gray-400">{description}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-600">{label}</Label>
      <div className="w-full">{children}</div>
      {description && <p className="text-[10px] text-gray-400">{description}</p>}
    </div>
  );
}
