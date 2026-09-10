'use client';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({ title, message, action, compact = false }: EmptyStateProps) {
  return (
    <section
      className={`rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-center ${
        compact ? 'px-5 py-10' : 'px-6 py-16'
      }`}
    >
      <h2 className={`${compact ? 'text-base' : 'text-xl'} font-semibold text-white`}>{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
