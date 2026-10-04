// EXPORTS: NowPage
// 此刻：一句话发布，立即 Published ✓，自动归档

import { useState } from 'react';
import { useDB } from '@/data/db-context';
import { toast } from 'sonner';

export default function NowPage() {
  const { db, addNow } = useDB();
  const [text, setText] = useState('');
  const [published, setPublished] = useState(false);

  const publish = () => {
    const t = text.trim();
    if (!t) return;
    addNow(t);
    setText('');
    setPublished(true);
    toast.success('已发布 ✓');
    setTimeout(() => setPublished(false), 2500);
  };

  const nows = db.nowEntries.slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">此刻</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          现在正在经历什么。今天记下的，终将成为档案。
        </p>
      </div>

      {/* 输入区 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && publish()}
          placeholder="此刻你在做什么？"
          className="w-full bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="此刻在做什么"
        />
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className={`text-[13px] ${published ? 'text-success' : 'text-muted-foreground'}`}>
            {published ? 'Published ✓' : '发布后会自动进入档案'}
          </span>
          <button
            onClick={publish}
            disabled={!text.trim()}
            className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90 disabled:opacity-40"
          >
            发布
          </button>
        </div>
      </div>

      {/* 时间线 */}
      <div className="space-y-2">
        {nows.map((n) => (
          <div key={n.id} className="flex items-baseline gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card">
            <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
              {new Date(n.publishedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} ·{' '}
              {new Date(n.publishedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[14px] text-foreground">{n.text}</span>
          </div>
        ))}
        {nows.length === 0 && (
          <p className="py-8 text-center text-[13px] text-muted-foreground">
            还没有发布过此刻。现在正是记录的好时候。
          </p>
        )}
      </div>
    </div>
  );
}
