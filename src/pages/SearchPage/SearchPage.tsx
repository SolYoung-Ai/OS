// EXPORTS: SearchPage
// 全局搜索：Ideas / Content / Projects / Now 分类结果

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { EmptyState } from '@/components/blocks';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { db } = useDB();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);

  const ideas = q ? db.ideas.filter((i) => match(i.title) || match(i.topic)) : [];
  const contents = q ? db.contents.filter((c) => match(c.title)) : [];
  const projects = q ? db.projects.filter((p) => match(p.name)) : [];
  const nows = q ? db.nowEntries.filter((n) => match(n.text)) : [];
  const total = ideas.length + contents.length + projects.length + nows.length;

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">搜索</h1>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索所有内容…"
          className="h-12 w-full bg-transparent text-[15px] placeholder:text-muted-foreground focus:outline-none"
          aria-label="全局搜索"
        />
        {q && (
          <span className="text-[12px] text-muted-foreground">{total} 条结果</span>
        )}
      </div>

      {!q ? (
        <EmptyState title="输入关键词，找到过去的自己。" hint="按 ⌘K 也能打开全局搜索。" />
      ) : total === 0 ? (
        <EmptyState title="没有找到相关内容。" hint="换个关键词试试。" />
      ) : (
        <div className="space-y-6">
          {ideas.length > 0 && (
            <ResultGroup label="灵感" count={ideas.length}>
              {ideas.map((i) => (
                <button key={i.id} onClick={() => navigate(`/ideas/${i.id}`)} className={ROW}>
                  {i.title}
                </button>
              ))}
            </ResultGroup>
          )}
          {contents.length > 0 && (
            <ResultGroup label="创作" count={contents.length}>
              {contents.map((c) => (
                <button key={c.id} onClick={() => navigate(`/content/${c.id}`)} className={ROW}>
                  {c.title}
                </button>
              ))}
            </ResultGroup>
          )}
          {projects.length > 0 && (
            <ResultGroup label="项目" count={projects.length}>
              {projects.map((p) => (
                <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className={ROW}>
                  {p.name}
                </button>
              ))}
            </ResultGroup>
          )}
          {nows.length > 0 && (
            <ResultGroup label="此刻" count={nows.length}>
              {nows.map((n) => (
                <button key={n.id} onClick={() => navigate('/now')} className={ROW}>
                  {n.text}
                </button>
              ))}
            </ResultGroup>
          )}
        </div>
      )}
    </div>
  );
}

const ROW =
  'block w-full rounded-md px-3 py-2 text-left text-[14px] text-foreground transition-colors hover:bg-accent/60';

function ResultGroup({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
        {label} · {count} 条
      </h2>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}
