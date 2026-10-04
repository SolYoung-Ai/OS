// EXPORTS: KindBadge, StatusDot, EmptyState, TimeAgo
// 各页面共享的小部件

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function KindBadge({
  children,
  variant = 'secondary',
  className,
}: {
  children: ReactNode;
  variant?: 'secondary' | 'outline';
  className?: string;
}) {
  return (
    <Badge variant={variant} className={`font-normal text-[11px] ${className ?? ''}`}>
      {children}
    </Badge>
  );
}

export function StatusDot({ done, className }: { done?: boolean; className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${done ? 'bg-success' : 'bg-muted-foreground/40'} ${className ?? ''}`}
      aria-hidden
    />
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-14 text-center">
      <p className="text-[14px] text-foreground">{title}</p>
      {hint && <p className="mt-1.5 text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TimeAgo({ iso }: { iso: string }) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: zhCN });
  } catch {
    return '';
  }
}
