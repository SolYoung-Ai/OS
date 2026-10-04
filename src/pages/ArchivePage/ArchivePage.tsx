// EXPORTS: ArchivePage
// 档案：时间线式的数字记忆，按年/月/类型筛选

import { useState } from 'react';
import { useDB } from '@/data/db-context';
import type { ArchiveKind, IArchiveEntry } from '@/data/types';
import { EmptyState } from '@/components/blocks';

const KINDS: { id: ArchiveKind | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'now', label: '此刻' },
  { id: 'idea', label: '灵感' },
  { id: 'content', label: '创作' },
  { id: 'project', label: '项目' },
  { id: 'milestone', label: '里程碑' },
];

interface MonthGroup {
  key: string;
  monthLabel: string;
  entries: IArchiveEntry[];
}

export default function ArchivePage() {
  const { db } = useDB();
  const [kind, setKind] = useState<ArchiveKind | 'all'>('all');

  const dbEntries = db.archiveEntries
    .filter((a) => (kind === 'all' ? true : a.kind === kind))
    .sort((a, b) => b.occurredOn.localeCompare(a.occurredOn));

  // 按 年月 分组
  const groups: MonthGroup[] = [];
  for (const e of dbEntries) {
    const month = Number(e.occurredOn.slice(5, 7));
    const year = e.occurredOn.slice(0, 4);
    const key = `${year}-${month}`;
    const label = `${year}年${month}月`;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, monthLabel: label, entries: [] };
      groups.push(g);
    }
    g.entries.push(e);
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">档案</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          数字记忆。现在发生的，终将成为过去的记录。
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-1">
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => setKind(k.id)}
            className={`rounded-md px-3 py-1.5 text-[12px] transition-colors ${
              kind === k.id
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {dbEntries.length === 0 ? (
        <EmptyState title="未来的你，会在这里找到过往记录。" hint="发布此刻、归档灵感后会自动沉淀到这里。" />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className="mb-3 text-[13px] font-medium uppercase tracking-widest text-muted-foreground">
                {g.monthLabel}
              </h2>
              <div className="border-l border-border pl-5">
                {g.entries.map((e) => (
                  <div key={e.id} className="relative mb-4 pl-2">
                    <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <p className="text-[14px] text-foreground">
                      <span className="mr-2 tabular-nums text-[12px] text-muted-foreground">
                        {Number(e.occurredOn.slice(8, 10))}
                      </span>
                      {e.title}
                    </p>
                    {e.subtitle && (
                      <p className="ml-6 mt-0.5 text-[13px] text-muted-foreground">{e.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
