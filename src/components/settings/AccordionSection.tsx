'use client';

import { ReactNode } from 'react';
import {
  Accordion,
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
  defaultOpen = false,
  searchQuery = '',
}: AccordionSectionProps) {
  // If searching and this section's title doesn't match, hide
  if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase())) {
    // Check if any child content might match - we show by default when searching
    // to allow content-level filtering in the parent
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? id : undefined}
      className="border-b border-gray-100"
    >
      <AccordionItem value={id} className="border-0">
        <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:bg-gray-50/50">
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
