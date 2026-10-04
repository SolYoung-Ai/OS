// EXPORTS: HomePage
// 首页 = 创作者工作桌面：问候 + 快速捕获 + 继续处理 / 最近灵感 / 此刻

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { CONTENT_TYPE_LABEL, CONTENT_STATUS_LABEL } from '@/data/mock';
import { KindBadge, TimeAgo } from '@/components/blocks';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { db, addIdea } = useDB();
  const navigate = useNavigate();
  const [capture, setCapture] = useState('');

  // Continue：进行中的内容（草稿/制作中/待发布）与进行中项目
  const continueContents = db.contents.filter((c) =>
    ['draft', 'production', 'ready'].includes(c.status),
  );
  const continueProjects = db.projects.filter((p) => p.status === 'active');
  const recentIdeas = db.ideas.filter((i) => i.status !== 'archived').slice(0, 4);
  const nows = db.nowEntries.slice(0, 3);

  const submitCapture = () => {
    const text = capture.trim();
    if (!text) return;
    addIdea({
      title: text.slice(0, 30),
      originalThought: text,
      type: 'idea',
      topic: '未分类',
      potential: 'medium',
      status: 'inbox',
      suggestedAngles: [],
      candidateTitles: [],
      relatedIdeaIds: [],
      tags: [],
    });
    setCapture('');
    navigate('/ideas');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
  const name = db.userSettings?.name?.trim();

  return (
    <div className="mx-auto w-full max-w-[900px]">
      {/* ── 问候 + 快速输入 ───────────────────── */}
      <div className="pt-4 pb-8">
        <h1 className="text-[26px] font-medium tracking-tight text-foreground">
          {greeting}{name ? `，${name}。` : '。'}
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">今天想做什么？</p>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-1 shadow-sm transition-shadow focus-within:shadow-md">
          <input
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitCapture()}
            placeholder="记下一个想法…  有什么想法，现在就记下来。"
            className="h-12 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="快速记录想法"
          />
          <button
            onClick={submitCapture}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="保存想法"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── A. 继续处理 ───────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
          继续处理
        </h2>
        <div className="space-y-2">
          {continueContents.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/content/${c.id}`)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-medium text-foreground">{c.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <KindBadge>{CONTENT_TYPE_LABEL[c.type]}</KindBadge>
                <KindBadge variant="outline">{CONTENT_STATUS_LABEL[c.status]}</KindBadge>
                <span>{TimeAgo({ iso: c.updatedAt })}</span>
              </div>
            </button>
          ))}
          {continueProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/50"
            >
              <span className="text-[14px] font-medium text-foreground">{p.name}</span>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <KindBadge>项目</KindBadge>
                <KindBadge variant="outline">进行中</KindBadge>
                <span>{TimeAgo({ iso: p.updatedAt })}</span>
              </div>
            </button>
          ))}
          {continueContents.length === 0 && continueProjects.length === 0 && (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-[13px] text-muted-foreground">
              还没有正在做的事。从一个想法开始吧。
            </div>
          )}
        </div>
      </section>

      {/* ── B. 最近灵感 ───────────────────────── */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            最近灵感
          </h2>
          <button
            onClick={() => navigate('/ideas')}
            className="text-[12px] text-muted-foreground hover:text-foreground"
          >
            查看全部
          </button>
        </div>
        <div className="space-y-1">
          {recentIdeas.map((i) => (
            <button
              key={i.id}
              onClick={() => navigate(`/ideas/${i.id}`)}
              className="flex w-full items-baseline justify-between rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
            >
              <span className="text-[14px] text-foreground">{i.title}</span>
              <span className="ml-4 shrink-0 text-[12px] text-muted-foreground">
                {TimeAgo({ iso: i.createdAt })}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── C. 此刻 ───────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            此刻
          </h2>
          <button
            onClick={() => navigate('/now')}
            className="text-[12px] text-muted-foreground hover:text-foreground"
          >
            发布一条
          </button>
        </div>
        <div className="space-y-2">
          {nows.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <p className="text-[14px] text-foreground">{n.text}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {new Date(n.publishedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
