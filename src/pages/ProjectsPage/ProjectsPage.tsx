// EXPORTS: ProjectsPage
// 项目列表：名称 + 状态卡片

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '@/data/db-context';
import { PROJECT_STATUS_LABEL } from '@/data/mock';
import type { ProjectStatus } from '@/data/types';
import { KindBadge, EmptyState } from '@/components/blocks';
import { Plus } from 'lucide-react';

const FILTERS: { id: ProjectStatus | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '进行中' },
  { id: 'paused', label: '暂停' },
  { id: 'done', label: '已完成' },
];

export default function ProjectsPage() {
  const { db, addProject } = useDB();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const list = db.projects.filter((p) =>
    filter === 'all' ? true : p.status === filter,
  );

  const create = () => {
    const n = name.trim();
    if (!n) return;
    const pid = addProject({
      name: n,
      status: 'active',
      goal: goal.trim(),
      taskIds: [],
      ideaIds: [],
      contentIds: [],
      notes: [],
    });
    setName('');
    setGoal('');
    setCreating(false);
    navigate(`/projects/${pid}`);
  };

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="flex items-end justify-between pb-6 pt-2">
        <div>
          <h1 className="text-[24px] font-medium tracking-tight text-foreground">项目</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            正在真正推进的事情。
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> 新建项目
        </button>
      </div>

      <div className="mb-5 flex items-center gap-1">
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

      {list.length === 0 ? (
        <EmptyState title="你在做什么？先建一个项目吧。" hint="项目承载目标、任务和关联的创作。" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((p) => {
            const tasks = db.tasks.filter((t) => p.taskIds.includes(t.id));
            const done = tasks.filter((t) => t.done).length;
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-accent/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[15px] font-medium text-foreground">{p.name}</span>
                  <KindBadge variant="outline">{PROJECT_STATUS_LABEL[p.status]}</KindBadge>
                </div>
                {p.goal && (
                  <p className="mb-3 line-clamp-2 text-[13px] text-muted-foreground">{p.goal}</p>
                )}
                {tasks.length > 0 && (
                  <p className="text-[12px] text-muted-foreground">
                    任务 {done}/{tasks.length} 已完成
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 新建项目弹窗 */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-[16px] font-medium text-foreground">新建项目</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="项目名称"
              className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] focus:border-foreground/30 focus:outline-none"
            />
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="目标（可选）"
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] focus:border-foreground/30 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreating(false)}
                className="rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                取消
              </button>
              <button
                onClick={create}
                disabled={!name.trim()}
                className="rounded-lg bg-foreground px-4 py-1.5 text-[13px] font-medium text-background hover:opacity-90 disabled:opacity-40"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
