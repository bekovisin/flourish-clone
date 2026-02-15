'use client';

import { ReactNode } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  searchQuery?: string;
}

export function AccordionSection({
  id,
  title,
  children,
}: AccordionSectionProps) {
  return (
    <AccordionItem value={id} className="border-b border-gray-200 border-t-0">
      <AccordionTrigger className="px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:bg-blue-50 [&[data-state=open]]:text-blue-900">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 bg-gray-50">
        <div className="space-y-3 pt-3">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
