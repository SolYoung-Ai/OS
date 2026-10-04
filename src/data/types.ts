// EXPORTS: IIdea, IContent, IProject, ITask, INote, INowEntry, IArchiveEntry,
//          IAIProvider, IModelSetting, IAIUsage, IdeaStatus, IdeaType, ContentStatus,
//          ContentType, ProjectStatus, PotentialLevel, ArchiveKind, TaskStatus, IDB

// ── 通用基字段 ─────────────────────────────────────────────
interface IBase {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ── Idea 灵感 ─────────────────────────────────────────────
export type IdeaStatus = 'inbox' | 'developing' | 'ready' | 'archived';
export type IdeaType = 'idea' | 'note' | 'observation';
export type PotentialLevel = 'high' | 'medium' | 'low';

export interface IIdea extends IBase {
  title: string;
  originalThought: string;
  type: IdeaType;
  topic: string;
  potential: PotentialLevel;
  status: IdeaStatus;
  suggestedAngles: string[];
  candidateTitles: string[];
  relatedIdeaIds: string[];
  tags: string[];
  projectId?: string;
}

// ── Content 创作 ───────────────────────────────────────────
export type ContentStatus =
  | 'idea'
  | 'outline'
  | 'draft'
  | 'production'
  | 'ready'
  | 'published';
export type ContentType = 'shortvideo' | 'article' | 'script' | 'visual' | 'post';

export interface IContentVersion {
  n: number;
  at: string; // ISO
  body: string;
}

export interface IContent extends IBase {
  title: string;
  type: ContentType;
  status: ContentStatus;
  hook: string;
  mainPoint: string;
  conclusion: string;
  projectId?: string;
  sourceIdeaId?: string;
  tags: string[];
  versions: IContentVersion[];
}

// ── Project 项目 ───────────────────────────────────────────
export type ProjectStatus = 'active' | 'paused' | 'done' | 'archived';

export interface IProject extends IBase {
  name: string;
  status: ProjectStatus;
  goal: string;
  taskIds: string[];
  ideaIds: string[];
  contentIds: string[];
  notes: string[];
}

// ── Task 任务 ─────────────────────────────────────────────
export interface ITask extends IBase {
  title: string;
  done: boolean;
  projectId: string;
}

// ── Now 此刻 ──────────────────────────────────────────────
export interface INowEntry extends IBase {
  text: string;
  publishedAt: string; // ISO
}

// ── Archive 档案 ──────────────────────────────────────────
export type ArchiveKind =
  | 'idea'
  | 'content'
  | 'project'
  | 'now'
  | 'milestone';

export interface IArchiveEntry extends IBase {
  kind: ArchiveKind;
  title: string;
  subtitle?: string;
  occurredOn: string; // YYYY-MM-DD
  sourceId?: string;
}

// ── Tag 标签 ──────────────────────────────────────────────
export interface ITag {
  name: string;
  count: number;
}

// ── AI Provider / 模型 / 用量 ─────────────────────────────
export type ProviderId = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'qwen' | 'doubao' | 'custom';
export type TaskKind = 'writing' | 'reasoning' | 'imagePrompt';

export interface IAIProvider {
  id: ProviderId;
  label: string;
  enabled: boolean;
  endpoint?: string; // 自建代理地址（密钥绝不进前端）
  model: string;
}

export interface IModelSetting {
  task: TaskKind;
  providerId: ProviderId;
  model: string;
}

export interface IAIUsage {
  requests: number;
  tokens: number;
  estimatedCostCny: number;
}

// ── 数据库 ────────────────────────────────────────────────
export interface IDB {
  ideas: IIdea[];
  contents: IContent[];
  projects: IProject[];
  tasks: ITask[];
  nowEntries: INowEntry[];
  archiveEntries: IArchiveEntry[];
  aiProviders: IAIProvider[];
  modelSettings: IModelSetting[];
  aiUsage: IAIUsage;
  onboarded: boolean;
}
