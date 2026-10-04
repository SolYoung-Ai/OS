// EXPORTS: IdeaDetailPage
// 灵感详情：左侧原文 + 右侧 AI 建议 + 转为内容

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { IDEA_STATUS_LABEL, POTENTIAL_LABEL } from '@/data/mock';
import { KindBadge, EmptyState } from '@/components/blocks';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const { db, addContent } = useDB();
  const navigate = useNavigate();

  const idea = db.ideas.find((i) => i.id === id);
  if (!idea) {
    return <EmptyState title="这条灵感不见了。" hint="它可能已被移除。" />;
  }

  const related = db.ideas.filter((r) => idea.relatedIdeaIds.includes(r.id));

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

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <button
        onClick={() => navigate('/ideas')}
        className="mb-5 inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回灵感
      </button>

      {/* 左侧：原文 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <KindBadge>{idea.topic}</KindBadge>
          <span className="text-[12px] text-muted-foreground">{IDEA_STATUS_LABEL[idea.status]}</span>
          <span className="text-[12px] text-muted-foreground">潜力：{POTENTIAL_LABEL[idea.potential]}</span>
        </div>
        <h1 className="mb-5 text-[22px] font-medium tracking-tight text-foreground">
          {idea.title}
        </h1>

        <p className="mb-4 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          原始想法
        </p>
        <p className="text-[15px] leading-relaxed text-foreground">
          {idea.originalThought}
        </p>
      </div>

      {/* 右侧：AI 建议 */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2 text-[13px] font-medium text-foreground">
          <Sparkles className="h-4 w-4" /> AI 建议
        </div>

        {idea.suggestedAngles.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">建议角度</p>
            <div className="space-y-1.5">
              {idea.suggestedAngles.map((a, i) => (
                <p key={i} className="text-[13px] text-foreground">· {a}</p>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">相关想法</p>
            <div className="space-y-1">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/ideas/${r.id}`}
                  className="block text-[13px] text-foreground underline-offset-2 hover:underline"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {idea.candidateTitles.length > 0 && (
          <div>
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">候选标题</p>
            <div className="space-y-1.5">
              {idea.candidateTitles.map((t, i) => (
                <p key={i} className="text-[13px] text-muted-foreground">· {t}</p>
              ))}
            </div>
          </div>
        )}
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
