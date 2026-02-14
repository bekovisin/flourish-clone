'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberInput({ label, value, onChange, min, max, step = 1, suffix }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500">{label}</Label>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, num));
              onChange(clamped);
            }
          }}
          min={min}
          max={max}
          step={step}
          className="h-8 text-xs w-full"
        />
        {suffix && <span className="text-xs text-gray-400 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}
