// EXPORTS: CapturePage
// 记录页：巨型编辑区 + 保存。简单直接，比备忘录还快。

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function CapturePage() {
  const { addIdea } = useDB();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const t = text.trim();
    if (!t) return;
    addIdea({
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
    setText('');
    setSaved(true);
    toast.success('已保存 ✓');
    setTimeout(() => setSaved(false), 1800);
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
            支持文字、链接，点击保存记下此刻的想法
          </span>
          <button
            onClick={save}
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90 disabled:opacity-40"
          >
            {saved ? '已保存 ✓' : <><Save className="h-4 w-4" /> 保存</>}
          </button>
        </div>
      </div>

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
