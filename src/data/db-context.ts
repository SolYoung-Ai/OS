// EXPORTS: DBContext, DBContextValue, useDB
// 与 Provider 拆开：本文件只导出非组件（context + hook + 类型）

import { createContext, useContext } from 'react';
import type { IDB } from './types';

export type DBContextValue = {
  db: IDB;
  setDb: (updater: (prev: IDB) => IDB) => void;
  addIdea: (data: Omit<IDB['ideas'][number], 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateIdea: (id: string, patch: Partial<IDB['ideas'][number]>) => void;
  archiveIdea: (id: string) => void;
  addContent: (data: Omit<IDB['contents'][number], 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => string;
  updateContent: (id: string, patch: Partial<IDB['contents'][number]>) => void;
  archiveContent: (id: string) => void;
  addProject: (data: Omit<IDB['projects'][number], 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProject: (id: string, patch: Partial<IDB['projects'][number]>) => void;
  archiveProject: (id: string) => void;
  toggleTask: (taskId: string) => void;
  addTask: (projectId: string, title: string) => void;
  addNow: (text: string) => void;
  archiveIdeaByTitle: (title: string, subtitle: string) => void;
  resetAll: () => void;
};

export const DBContext = createContext<DBContextValue | null>(null);

export function useDB(): DBContextValue {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error('useDB 必须在 DBProvider 内使用');
  return ctx;
}
