// EXPORTS: CapturePage
// 记录页：巨型编辑区 + 保存 + AI 自动整理（类型/主题/潜力/建议角度）

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { runAIOrganize, type AIOrganizeResult } from '@/lib/ai';
import { toast } from 'sonner';
import { Sparkles, Save } from 'lucide-react';

export default function CapturePage() {
  const { db, addIdea, updateIdea, archiveIdeaByTitle } = useDB();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [organizing, setOrganizing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<AIOrganizeResult | null>(null);

  const save = async () => {
    const t = text.trim();
    if (!t) return;
    const id = addIdea({
      title: t.slice(0, 30),
      originalThought: t,
      type: 'idea',
      topic: '未分类',
      potential: 'medium',
      status: 'inbox',
      suggestedAngles: [],
      candidateTitles: [],
      relatedIdeaIds: [],
      tags: [],
    });
    setSaved(true);
    toast.success('已保存 ✓');
    setTimeout(() => setSaved(false), 1800);

    // AI 自动整理
    setOrganizing(true);
    setResult(null);
    try {
      const r = await runAIOrganize(db, t);
      updateIdea(id, {
        topic: r.topic,
        potential: r.potential === '高' ? 'high' : r.potential === '低' ? 'low' : 'medium',
        suggestedAngles: r.angles,
        status: 'developing',
      });
      archiveIdeaByTitle(r.topic || t.slice(0, 24), '整理了一条灵感');
      setResult(r);
    } catch {
      toast.error('出错了，请重试');
    } finally {
      setOrganizing(false);
    }
  };

  const canSave = text.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">记录</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          趁灵感还在，先把它记下来。
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div
          className="min-h-[240px] text-[16px] leading-relaxed text-foreground focus:outline-none"
          contentEditable
          data-placeholder="此刻在想什么？"
          onInput={(e) => setText(e.currentTarget.textContent ?? '')}
          suppressContentEditableWarning
        />
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-[12px] text-muted-foreground">
            {organizing ? '整理中…' : '支持文字、链接，保存后 AI 自动整理'}
          </span>
          <button
            onClick={save}
            disabled={!canSave || organizing}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90 disabled:opacity-40"
          >
            {saved ? '已保存 ✓' : organizing ? (
              <><Sparkles className="h-4 w-4 animate-pulse" /> 整理中…</>
            ) : (
              <><Save className="h-4 w-4" /> 保存</>
            )}
          </button>
        </div>
      </div>

      {/* AI 整理结果 */}
      {result && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-medium text-foreground">
            <Sparkles className="h-4 w-4" /> AI 整理结果
            <span className="text-[11px] font-normal text-muted-foreground">
              （AI 只建议，你来做决定）
            </span>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-3">
            <div className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">类型</p>
              <p className="mt-0.5 text-foreground">{result.type}</p>
            </div>
            <div className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">主题</p>
              <p className="mt-0.5 text-foreground">{result.topic}</p>
            </div>
            <div className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">内容潜力</p>
              <p className="mt-0.5 text-foreground">{result.potential}</p>
            </div>
          </div>
          <p className="mb-2 text-[13px] font-medium text-foreground">建议角度</p>
          <div className="space-y-1.5">
            {result.angles.map((a, idx) => (
              <p key={idx} className="text-[13px] text-muted-foreground">· {a}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate('/ideas')}
          className="text-[13px] text-muted-foreground hover:text-foreground"
        >
          去灵感列表看看 →
        </button>
      </div>
    </div>
  );
}
