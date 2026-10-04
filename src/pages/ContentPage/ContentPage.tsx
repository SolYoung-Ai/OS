// EXPORTS: ContentPage
// 创作工作台：极简分组列表（草稿/制作中/待发布/已发布）

import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { CONTENT_TYPE_LABEL, CONTENT_STATUS_LABEL } from '@/data/mock';
import type { ContentStatus } from '@/data/types';
import { KindBadge, EmptyState, TimeAgo } from '@/components/blocks';
import { Plus } from 'lucide-react';

const GROUPS: { id: ContentStatus; label: string; title: string }[] = [
  { id: 'draft', label: '草稿', title: '草稿' },
  { id: 'production', label: '制作中', title: '制作中' },
  { id: 'published', label: '已发布', title: '已发布' },
];

export default function ContentPage() {
  const { db, addContent } = useDB();
  const navigate = useNavigate();

  const groups = GROUPS.map((g) => ({
    ...g,
    items: db.contents.filter((c) => c.status === g.id),
  }));
  const hasAny = db.contents.length > 0;

  const newContent = () => {
    const cid = addContent({
      title: '未命名创作',
      type: 'shortvideo',
      status: 'draft',
      hook: '',
      mainPoint: '',
      conclusion: '',
      tags: [],
    });
    navigate(`/content/${cid}`);
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="flex items-end justify-between pb-6 pt-2">
        <div>
          <h1 className="text-[24px] font-medium tracking-tight text-foreground">创作</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            把灵感变成真正做完的东西。
          </p>
        </div>
        <button
          onClick={newContent}
          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> 新建
        </button>
      </div>

      {!hasAny ? (
        <EmptyState
          title="你的下一篇内容，从一个灵感开始。"
          hint="先去记录一条灵感，再到这里把它做出来。"
        />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
                  {g.title}
                </span>
                <span className="text-[12px] text-muted-foreground/70">
                  {g.items.length} 条
                </span>
              </div>
              {g.items.length === 0 ? (
                <div className="rounded-md border border-dashed border-border px-4 py-5 text-[13px] text-muted-foreground">
                  还没有{g.label}的内容。
                </div>
              ) : (
                <div className="space-y-1.5">
                  {g.items.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/content/${c.id}`)}
                      className="flex w-full items-center justify-between rounded-lg border border-transparent px-4 py-3 text-left transition-colors hover:border-border hover:bg-card"
                    >
                      <span className="text-[14px] font-medium text-foreground">
                        {c.title}
                      </span>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <KindBadge variant="outline">{CONTENT_TYPE_LABEL[c.type]}</KindBadge>
                        <span>{CONTENT_STATUS_LABEL[c.status]}</span>
                        <span>{TimeAgo({ iso: c.updatedAt })}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
