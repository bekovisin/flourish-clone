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
    <AccordionItem value={id} className="border-b border-gray-100 border-t-0">
      <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:bg-gray-200/60 [&[data-state=open]]:font-semibold">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
