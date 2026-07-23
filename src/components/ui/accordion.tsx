"use client";

import { useId, useState } from "react";

import { PlusIcon } from "@/components/ui/icons";

type AccordionItem = {
  answer: string;
  question: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const id = useId();
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="border-t border-[var(--border)]">
      {items.map((item, index) => {
        const open = openItems.has(index);
        const panelId = `${id}-panel-${index}`;
        const triggerId = `${id}-trigger-${index}`;

        return (
          <div className="border-b border-[var(--border)]" key={item.question}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className="group flex min-h-20 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold tracking-[-0.025em]"
                id={triggerId}
                onClick={() => toggleItem(index)}
                type="button"
              >
                <span>{item.question}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--border)] transition-[background-color,border-color,color] duration-300 group-hover:border-signal-400 group-hover:bg-signal-400 group-hover:text-ink-950">
                  <PlusIcon
                    className={`size-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  />
                </span>
              </button>
            </h3>
            <div
              aria-hidden={!open}
              aria-labelledby={triggerId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              id={panelId}
              role="region"
            >
              <div className="overflow-hidden">
                <p className="max-w-[68ch] pb-7 text-base leading-7 text-[var(--text-muted)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
