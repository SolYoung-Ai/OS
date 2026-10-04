// EXPORTS: ContentEditorPage
// 内容编辑器（核心）：钩子/核心观点/结尾 + 轻量 AI Command Bar
// AI 是副驾驶：输出可 插入 / 重新生成 / 放弃

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { CONTENT_TYPE_LABEL, CONTENT_STATUS_LABEL } from '@/data/mock';
import { runAIAction, AI_ACTIONS, type AICmd } from '@/lib/ai';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ContentEditorPage() {
  const { id } = useParams();
  const { db, updateContent, deleteContent } = useDB();
  const navigate = useNavigate();
  const c = db.contents.find((x) => x.id === id);

  const [menuOpen, setMenuOpen] = useState(false);
  const [thinking, setThinking] = useState<AICmd | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  if (!c) {
    return (
      <div className="mx-auto max-w-[900px] py-10 text-center text-[13px] text-muted-foreground">
        这条内容不存在。
      </div>
    );
  }

  const pushVersion = (body: string) => {
    const n = (c.versions[c.versions.length - 1]?.n ?? 0) + 1;
    updateContent(c.id, {
      versions: [...c.versions, { n, at: new Date().toISOString(), body }],
    });
  };

  const save = () => {
    pushVersion(
      `钩子：${c.hook}\n核心：${c.mainPoint}\n结尾：${c.conclusion}`,
    );
    toast.success('已保存 ✓');
  };

  const onDelete = () => {
    if (confirm('确定删除这条创作？')) {
      deleteContent(c.id);
      navigate('/content');
    }
  };

  const run = async (cmd: AICmd) => {
    setThinking(cmd);
    setDraft(null);
    try {
      const out = await runAIAction(db, cmd, {
        title: c.title,
        hook: c.hook,
        mainPoint: c.mainPoint,
        conclusion: c.conclusion,
      });
      setDraft(out);
    } catch {
      toast.error('出错了，请重试');
    } finally {
      setThinking(null);
    }
  };

  const insertDraft = () => {
    if (!draft) return;
    pushVersion(draft);
    // 追加到核心观点
    updateContent(c.id, { mainPoint: c.mainPoint ? `${c.mainPoint}\n\n${draft}` : draft });
    setDraft(null);
    toast.success('已插入');
  };

  const regen = () => {
    if (thinking) return;
    const last = AI_ACTIONS.find((a) => a.id === thinking);
    // 重新生成：直接重跑当前动作（用最近一次动作）
    run(thinking ?? 'improve');
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/content')}
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 返回创作
        </button>
        <div className="flex items-center gap-2">
          {c.versions.length > 1 && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ChevronDown className="h-3 w-3" />
              {c.versions.length} 个版本
            </div>
          )}
          <button
            onClick={save}
            className="rounded-lg bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-colors hover:opacity-90"
          >
            保存
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-border px-3 py-1.5 text-[13px] text-muted-foreground hover:bg-accent hover:text-destructive"
            aria-label="删除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 标题 + 类型 */}
      <div className="mb-6">
        <input
          value={c.title}
          onChange={(e) => updateContent(c.id, { title: e.target.value })}
          className="w-full bg-transparent text-[28px] font-medium tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="无标题"
          aria-label="标题"
        />
        <div className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>{CONTENT_TYPE_LABEL[c.type]}</span>
          <span>·</span>
          <span>{CONTENT_STATUS_LABEL[c.status]}</span>
        </div>
      </div>

      {/* 正文三区 */}
      <div className="space-y-6">
        <Section
          label="钩子 Hook"
          value={c.hook}
          onChange={(v) => updateContent(c.id, { hook: v })}
          placeholder="用一句话抓住注意力的开场。"
        />
        <Section
          label="核心观点 Main Point"
          value={c.mainPoint}
          onChange={(v) => updateContent(c.id, { mainPoint: v })}
          placeholder="这条内容真正想说的东西。"
        />
        <Section
          label="结尾 Conclusion"
          value={c.conclusion}
          onChange={(v) => updateContent(c.id, { conclusion: v })}
          placeholder="把观点收住，给观众一个方向。"
        />
      </div>
    </div>
  );
}

const ACTION_LABEL: Record<AICmd, string> = {
  improve: '润色',
  shorter: '精简',
  hook: '生成钩子',
  outline: '生成大纲',
  script60: '生成脚本',
  title: '生成标题',
  visual: '生成视觉创意',
  translate: '翻译',
  summarize: '总结',
};

function Section({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={label.startsWith('核心') ? 4 : 3}
        className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none"
      />
    </div>
  );
}
