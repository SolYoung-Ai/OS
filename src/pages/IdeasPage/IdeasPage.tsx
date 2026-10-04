// EXPORTS: IdeasPage
// 灵感列表：搜索 + 状态筛选 + 极简列表

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { IDEA_STATUS_LABEL, IDEA_TYPE_LABEL, POTENTIAL_LABEL } from '@/data/mock';
import type { IdeaStatus } from '@/data/types';
import { EmptyState, KindBadge, TimeAgo } from '@/components/blocks';
import { Search, Pencil, Trash2 } from 'lucide-react';

const FILTERS: { id: IdeaStatus | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'inbox', label: '收件箱' },
  { id: 'developing', label: '整理中' },
  { id: 'ready', label: '就绪' },
  { id: 'archived', label: '已归档' },
];

export default function IdeasPage() {
  const { db, updateIdea, deleteIdea } = useDB();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const list = db.ideas
    .filter((i) => (filter === 'all' ? true : i.status === filter))
    .filter((i) => !q || i.title.toLowerCase().includes(q) || i.topic.toLowerCase().includes(q));

  const onEdit = (id: string) => {
    const idea = db.ideas.find((i) => i.id === id);
    if (!idea) return;
    const title = prompt('标题', idea.title);
    if (title === null) return;
    const text = prompt('内容', idea.originalThought);
    if (text === null) return;
    updateIdea(id, { title, originalThought: text });
  };

  const onDelete = (id: string) => {
    if (confirm('确定删除这条灵感？')) {
      deleteIdea(id);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">灵感</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          所有想法的集合，从记录开始。
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索灵感..."
            className="h-9 w-full bg-transparent text-[13px] placeholder:text-muted-foreground focus:outline-none"
            aria-label="搜索灵感"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                filter === f.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="这里还什么都没有。趁忘记之前，先记下来。"
          hint="从「记录」页开始，或直接按 N"
        />
      ) : (
        <div className="space-y-1">
          {list.map((i) => (
            <div
              key={i.id}
              onClick={() => navigate(`/ideas/${i.id}`)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card"
            >
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] font-medium text-foreground">{i.title}</span>
                  <span className="shrink-0 text-[12px] text-muted-foreground">
                    捕获于 {TimeAgo({ iso: i.createdAt })}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <KindBadge variant="outline">{i.topic}</KindBadge>
                  <span>{IDEA_TYPE_LABEL[i.type]}</span>
                  <span>潜力：{POTENTIAL_LABEL[i.potential]}</span>
                  <span>· {IDEA_STATUS_LABEL[i.status]}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(i.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="编辑"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(i.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                  aria-label="删除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
