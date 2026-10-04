// EXPORTS: MOCK_DB, CONTENT_TYPE_LABEL, CONTENT_STATUS_LABEL, IDEA_STATUS_LABEL, PROJECT_STATUS_LABEL, ARCHIVE_KIND_LABEL, POTENTIAL_LABEL, IDEA_TYPE_LABEL

import type {
  IDB,
  ContentStatus,
  ContentType,
  IdeaStatus,
  IdeaType,
  PotentialLevel,
  ProjectStatus,
  ArchiveKind,
} from './types';

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  shortvideo: '短视频',
  article: '文章',
  script: '脚本',
  visual: '视觉',
  post: '帖子',
};

export const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  idea: '灵感',
  outline: '大纲',
  draft: '草稿',
  production: '制作中',
  ready: '待发布',
  published: '已发布',
};

export const IDEA_STATUS_LABEL: Record<IdeaStatus, string> = {
  inbox: '收件箱',
  developing: '整理中',
  ready: '就绪',
  archived: '已归档',
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  active: '进行中',
  paused: '暂停',
  done: '已完成',
  archived: '已归档',
};

export const ARCHIVE_KIND_LABEL: Record<ArchiveKind, string> = {
  idea: '灵感',
  content: '创作',
  project: '项目',
  now: '此刻',
  milestone: '里程碑',
};

export const POTENTIAL_LABEL: Record<PotentialLevel, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export const IDEA_TYPE_LABEL: Record<IdeaType, string> = {
  idea: '灵感',
  note: '笔记',
  observation: '观察',
};

// 干净初始状态：所有业务数据为空，用户拿到手自己新建
export const MOCK_DB: IDB = {
  onboarded: true,
  userSettings: { name: '' },

  aiUsage: { requests: 0, tokens: 0, estimatedCostCny: 0 },

  aiProviders: [
    { id: 'doubao', label: '豆包', enabled: true, endpoint: '', model: 'doubao-pro-32k' },
    { id: 'deepseek', label: 'DeepSeek', enabled: false, endpoint: '', model: 'deepseek-chat' },
    { id: 'qwen', label: '通义千问', enabled: false, endpoint: '', model: 'qwen-plus' },
    { id: 'openai', label: 'OpenAI', enabled: false, endpoint: '', model: 'gpt-4o-mini' },
    { id: 'anthropic', label: 'Anthropic', enabled: false, endpoint: '', model: 'claude-sonnet-4' },
    { id: 'google', label: 'Google', enabled: false, endpoint: '', model: 'gemini-1.5-flash' },
    { id: 'custom', label: '自定义 API', enabled: false, endpoint: '', model: '' },
  ],

  modelSettings: [
    { task: 'writing', providerId: 'doubao', model: 'doubao-pro-32k' },
    { task: 'reasoning', providerId: 'doubao', model: 'doubao-pro-32k' },
    { task: 'imagePrompt', providerId: 'doubao', model: 'doubao-pro-32k' },
  ],

  nowEntries: [],
  ideas: [],
  contents: [],
  projects: [],
  tasks: [],
  archiveEntries: [],
};
