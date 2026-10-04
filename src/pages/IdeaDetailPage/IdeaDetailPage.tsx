// EXPORTS: IdeaDetailPage
// 灵感详情：原文 + 编辑/删除 + 转为内容

import { useParams, useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { IDEA_STATUS_LABEL, POTENTIAL_LABEL } from '@/data/mock';
import { EmptyState } from '@/components/blocks';
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from 'lucide-react';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const { db, updateIdea, archiveIdea, addContent } = useDB();
  const navigate = useNavigate();

  const idea = db.ideas.find((i) => i.id === id);
  if (!idea) {
    return <EmptyState title="这条灵感不见了。" hint="它可能已被移除。" />;
  }

  const turnIntoContent = () => {
    const cid = addContent({
      title: idea.title,
      type: 'shortvideo',
      status: 'idea',
      hook: '',
      mainPoint: idea.originalThought,
      conclusion: '',
      sourceIdeaId: idea.id,
      projectId: idea.projectId,
      tags: idea.tags,
    });
    navigate(`/content/${cid}`);
  };

  const onDelete = () => {
    if (confirm('确定删除这条灵感？')) {
      archiveIdea(idea.id);
      navigate('/ideas');
    }
  };

  const onEdit = () => {
    const title = prompt('标题', idea.title);
    if (title === null) return;
    const text = prompt('内容', idea.originalThought);
    if (text === null) return;
    updateIdea(idea.id, { title, originalThought: text });
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <button
        onClick={() => navigate('/ideas')}
        className="mb-5 inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回灵感
      </button>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            {idea.topic || '未分类'}
          </span>
          <span className="text-[12px] text-muted-foreground">{IDEA_STATUS_LABEL[idea.status]}</span>
          <span className="text-[12px] text-muted-foreground">潜力：{POTENTIAL_LABEL[idea.potential]}</span>
        </div>
        <h1 className="mb-5 text-[22px] font-medium tracking-tight text-foreground">
          {idea.title}
        </h1>

        <p className="mb-4 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          原始想法
        </p>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {idea.originalThought}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-accent"
          >
            <Pencil className="h-3.5 w-3.5" /> 编辑
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-accent hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> 删除
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={turnIntoContent}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90"
        >
          转为内容 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
