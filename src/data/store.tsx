// EXPORTS: DBProvider (组件)
// 数据 Provider：localStorage 持久化 + 领域方法。context/hook 在 db-context.ts

import { useEffect, useState, type ReactNode } from 'react';
import type { IDB } from './types';
import { MOCK_DB } from './mock';
import { DBContext } from './db-context';

// 项目命名空间：localStorage 里所有 key 都带这个前缀，避免多个应用互相覆盖
const NS = 'solyoung-os';
const DB_KEY = `${NS}:db`;

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function loadDB(): IDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as IDB;
      if (parsed && Array.isArray(parsed.ideas) && Array.isArray(parsed.contents)) {
        return parsed;
      }
    }
  } catch {
    // 隐私模式等场景静默降级
  }
  return MOCK_DB;
}

function CONTENT_SUBTITLE(type: string): string | undefined {
  const map: Record<string, string> = {
    shortvideo: '短视频',
    article: '文章',
    script: '脚本',
    visual: '视觉',
    post: '帖子',
  };
  return map[type] ?? undefined;
}

export function DBProvider({ children }: { children: ReactNode }) {
  const [db, setDbState] = useState<IDB>(() => loadDB());

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      // 隐私模式静默降级
    }
  }, [db]);

  const setDb = (updater: (prev: IDB) => IDB) =>
    setDbState((prev) => updater(prev));

  const now = () => new Date().toISOString();

  const addIdea = (data: Omit<IDB['ideas'][number], 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `idea-${uid()}`;
    const ts = now();
    setDbState((prev) => ({
      ...prev,
      ideas: [{ ...data, id, createdAt: ts, updatedAt: ts }, ...prev.ideas],
    }));
    return id;
  };

  const updateIdea = (id: string, patch: Partial<IDB['ideas'][number]>) =>
    setDbState((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: now() } : i)),
    }));

  const archiveIdea = (id: string) =>
    setDbState((prev) => {
      const idea = prev.ideas.find((i) => i.id === id);
      const nextIdeas = prev.ideas.map((i) =>
        i.id === id ? { ...i, status: 'archived' as const, updatedAt: now() } : i,
      );
      const entries = idea
        ? [
            {
              id: `arc-${uid()}`,
              kind: 'idea' as const,
              title: idea.title,
              subtitle: idea.topic,
              occurredOn: now().slice(0, 10),
              createdAt: now(),
              updatedAt: now(),
              sourceId: id,
            },
            ...prev.archiveEntries,
          ]
        : prev.archiveEntries;
      return { ...prev, ideas: nextIdeas, archiveEntries: entries };
    });

  const addContent = (
    data: Omit<IDB['contents'][number], 'id' | 'createdAt' | 'updatedAt' | 'versions'>,
  ) => {
    const id = `content-${uid()}`;
    const ts = now();
    setDbState((prev) => ({
      ...prev,
      contents: [
        { ...data, id, versions: [{ n: 1, at: ts, body: '初稿' }], createdAt: ts, updatedAt: ts },
        ...prev.contents,
      ],
    }));
    return id;
  };

  const updateContent = (id: string, patch: Partial<IDB['contents'][number]>) =>
    setDbState((prev) => ({
      ...prev,
      contents: prev.contents.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)),
    }));

  const archiveContent = (id: string) =>
    setDbState((prev) => {
      const c = prev.contents.find((x) => x.id === id);
      const nextContents = prev.contents.map((x) =>
        x.id === id ? { ...x, status: 'published' as const, updatedAt: now() } : x,
      );
      const entries = c
        ? [
            {
              id: `arc-${uid()}`,
              kind: 'content' as const,
              title: c.title,
              subtitle: CONTENT_SUBTITLE(c.type),
              occurredOn: now().slice(0, 10),
              createdAt: now(),
              updatedAt: now(),
              sourceId: id,
            },
            ...prev.archiveEntries,
          ]
        : prev.archiveEntries;
      return { ...prev, contents: nextContents, archiveEntries: entries };
    });

  const addProject = (
    data: Omit<IDB['projects'][number], 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const id = `project-${uid()}`;
    const ts = now();
    setDbState((prev) => ({
      ...prev,
      projects: [{ ...data, id, createdAt: ts, updatedAt: ts }, ...prev.projects],
    }));
    return id;
  };

  const updateProject = (id: string, patch: Partial<IDB['projects'][number]>) =>
    setDbState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now() } : p)),
    }));

  const archiveProject = (id: string) =>
    setDbState((prev) => {
      const p = prev.projects.find((x) => x.id === id);
      const nextProjects = prev.projects.map((x) =>
        x.id === id ? { ...x, status: 'archived' as const, updatedAt: now() } : x,
      );
      const entries = p
        ? [
            {
              id: `arc-${uid()}`,
              kind: 'project' as const,
              title: p.name,
              subtitle: p.goal,
              occurredOn: now().slice(0, 10),
              createdAt: now(),
              updatedAt: now(),
              sourceId: id,
            },
            ...prev.archiveEntries,
          ]
        : prev.archiveEntries;
      return { ...prev, projects: nextProjects, archiveEntries: entries };
    });

  const toggleTask = (taskId: string) =>
    setDbState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done, updatedAt: now() } : t,
      ),
    }));

  const addTask = (projectId: string, title: string) =>
    setDbState((prev) => {
      const id = `task-${uid()}`;
      const ts = now();
      const task = { id, title, done: false, projectId, createdAt: ts, updatedAt: ts };
      return {
        ...prev,
        tasks: [...prev.tasks, task],
        projects: prev.projects.map((p) =>
          p.id === projectId ? { ...p, taskIds: [...p.taskIds, id] } : p,
        ),
      };
    });

  const addNow = (text: string) =>
    setDbState((prev) => {
      const ts = now();
      const entry = {
        id: `now-${uid()}`,
        text,
        createdAt: ts,
        updatedAt: ts,
        publishedAt: ts,
      };
      const archive = {
        id: `arc-${uid()}`,
        kind: 'now' as const,
        title: text,
        occurredOn: ts.slice(0, 10),
        createdAt: ts,
        updatedAt: ts,
      };
      return {
        ...prev,
        nowEntries: [entry, ...prev.nowEntries],
        archiveEntries: [archive, ...prev.archiveEntries],
      };
    });

  const archiveIdeaByTitle = (title: string, subtitle: string) =>
    setDbState((prev) => ({
      ...prev,
      archiveEntries: [
        {
          id: `arc-${uid()}`,
          kind: 'now' as const,
          title,
          subtitle,
          occurredOn: now().slice(0, 10),
          createdAt: now(),
          updatedAt: now(),
        },
        ...prev.archiveEntries,
      ],
    }));

  const resetAll = () => setDbState(MOCK_DB);

  const deleteIdea = (id: string) =>
    setDbState((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== id),
    }));

  const deleteContent = (id: string) =>
    setDbState((prev) => ({
      ...prev,
      contents: prev.contents.filter((c) => c.id !== id),
    }));

  const deleteProject = (id: string) =>
    setDbState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      tasks: prev.tasks.filter((t) => t.projectId !== id),
    }));

  const deleteNow = (id: string) =>
    setDbState((prev) => ({
      ...prev,
      nowEntries: prev.nowEntries.filter((n) => n.id !== id),
    }));

  const deleteArchiveEntry = (id: string) =>
    setDbState((prev) => ({
      ...prev,
      archiveEntries: prev.archiveEntries.filter((a) => a.id !== id),
    }));

  return (
    <DBContext.Provider
      value={{
        db,
        setDb,
        addIdea,
        updateIdea,
        deleteIdea,
        addContent,
        updateContent,
        deleteContent,
        addProject,
        updateProject,
        deleteProject,
        toggleTask,
        addTask,
        addNow,
        deleteNow,
        deleteArchiveEntry,
        resetAll,
      }}
    >
      {children}
    </DBContext.Provider>
  );
}
