// EXPORTS: ProjectDetailPage
// 项目详情：目标 + 任务（勾选）+ 关联灵感/创作 + 备注

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { PROJECT_STATUS_LABEL } from '@/data/mock';
import { KindBadge, EmptyState } from '@/components/blocks';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { db, toggleTask, addTask, updateProject, archiveProject } = useDB();
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showUndo, setShowUndo] = useState(false);

  const p = db.projects.find((x) => x.id === id);
  if (!p) {
    return <EmptyState title="这个项目不见了。" />;
  }

  const tasks = db.tasks.filter((t) => p.taskIds.includes(t.id));
  const ideas = db.ideas.filter((i) => p.ideaIds.includes(i.id));
  const contents = db.contents.filter((c) => p.contentIds.includes(c.id));

  const submitTask = () => {
    const t = newTask.trim();
    if (!t) return;
    addTask(p.id, t);
    setNewTask('');
  };

  const submitNote = () => {
    const n = newNote.trim();
    if (!n) return;
    updateProject(p.id, { notes: [...p.notes, n] });
    setNewNote('');
  };

  const archive = () => {
    archiveProject(p.id);
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
    setTimeout(() => navigate('/projects'), 800);
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <button
        onClick={() => navigate('/projects')}
        className="mb-5 inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回项目
      </button>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-[22px] font-medium tracking-tight text-foreground">{p.name}</h1>
          <div className="flex items-center gap-2">
            <KindBadge>{PROJECT_STATUS_LABEL[p.status]}</KindBadge>
            <button
              onClick={archive}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
              aria-label="归档项目"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mb-5">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">目标</p>
          <p className="text-[14px] text-foreground">{p.goal || '还没有设定目标。'}</p>
        </div>

        {/* 任务 */}
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">任务</p>
          <div className="space-y-1.5">
            {tasks.map((t) => (
              <label
                key={t.id}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/50"
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="h-4 w-4 accent-foreground"
                />
                <span className={`text-[14px] ${t.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {t.title}
                </span>
              </label>
            ))}
            {tasks.length === 0 && (
              <p className="px-3 text-[13px] text-muted-foreground">还没有任务。</p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitTask()}
              placeholder="添加任务，回车确认"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] focus:border-foreground/30 focus:outline-none"
            />
            <button
              onClick={submitTask}
              className="rounded-lg px-2 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="添加任务"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 关联灵感 */}
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            关联灵感
          </p>
          {ideas.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">还没有关联的灵感。</p>
          ) : (
            <div className="space-y-1">
              {ideas.map((i) => (
                <button
                  key={i.id}
                  onClick={() => navigate(`/ideas/${i.id}`)}
                  className="block w-full text-left text-[14px] text-foreground hover:underline"
                >
                  · {i.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 关联创作 */}
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            关联创作
          </p>
          {contents.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">还没有关联的创作。</p>
          ) : (
            <div className="space-y-1">
              {contents.map((cc) => (
                <button
                  key={cc.id}
                  onClick={() => navigate(`/content/${cc.id}`)}
                  className="block w-full text-left text-[14px] text-foreground hover:underline"
                >
                  · {cc.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 备注 */}
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">备注</p>
          <div className="space-y-1.5">
            {p.notes.map((n, i) => (
              <p key={i} className="text-[13px] text-muted-foreground">· {n}</p>
            ))}
          </div>
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitNote()}
            placeholder="记一条备注，回车确认"
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] focus:border-foreground/30 focus:outline-none"
          />
        </div>
      </div>

      {showUndo && (
        <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-foreground px-4 py-2 text-[13px] text-background shadow-lg">
          项目已移入档案
          <button
            onClick={() => navigate('/archive')}
            className="font-medium underline underline-offset-2"
          >
            查看
          </button>
        </div>
      )}
    </div>
  );
}
