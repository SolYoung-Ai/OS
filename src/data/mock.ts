// EXPORTS: MOCK_DB (IDB 初始数据), NOW_MONTHS, CONTENT_TYPE_LABEL, CONTENT_STATUS_LABEL, IDEA_STATUS_LABEL, PROJECT_STATUS_LABEL, ARCHIVE_KIND_LABEL, POTENTIAL_LABEL, IDEA_TYPE_LABEL

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

// 用相对时间生成 ISO，避免 mock 日期写死导致"最后更新"永远看起来旧
function daysAgo(n: number, h = 0, m = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export const NOW_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

export const MOCK_DB: IDB = {
  onboarded: true,
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

  nowEntries: [
    { id: 'now-1', text: '终于把 SolYoung OS 的第一版想清楚了。', createdAt: daysAgo(0, 16, 24), updatedAt: daysAgo(0, 16, 24), publishedAt: daysAgo(0, 16, 24) },
    { id: 'now-2', text: '开始重新研究 AI 视频生成。', createdAt: daysAgo(1, 14, 12), updatedAt: daysAgo(1, 14, 12), publishedAt: daysAgo(1, 14, 12) },
    { id: 'now-3', text: '重新设计了 SolYoung 的个人网站。', createdAt: daysAgo(3, 11, 5), updatedAt: daysAgo(3, 11, 5), publishedAt: daysAgo(3, 11, 5) },
    { id: 'now-4', text: '秋禾农汇：开始搭建品牌内容系统。', createdAt: daysAgo(12, 20, 40), updatedAt: daysAgo(12, 20, 40), publishedAt: daysAgo(12, 20, 40) },
    { id: 'now-5', text: '野秋食验室：跑通第一批产品试样。', createdAt: daysAgo(20, 9, 30), updatedAt: daysAgo(20, 9, 30), publishedAt: daysAgo(20, 9, 30) },
  ],

  ideas: [
    {
      id: 'idea-1',
      title: 'AI 真正改变的可能不是生成画面',
      originalThought:
        '最近发现 AI 做视频的人很多，但大部分人只是把 AI 当成生成图片的工具，我觉得真正值得讲的是它改变了整个创作流程。',
      type: 'idea',
      topic: 'AI / 创作者',
      potential: 'high',
      status: 'developing',
      suggestedAngles: [
        '01 AI 视频最大的认知误区',
        '02 AI 改变的不是画面，而是创作全流程',
        '03 为什么 AI 时代更需要创作者思维',
      ],
      candidateTitles: ['AI 视频最大的误区', 'AI 改变的不是画面'],
      relatedIdeaIds: ['idea-2'],
      tags: ['AI', '视频'],
      createdAt: daysAgo(0, 9, 12),
      updatedAt: daysAgo(0, 10, 2),
    },
    {
      id: 'idea-2',
      title: '为什么个人独立网站越来越重要',
      originalThought:
        '在算法平台之外，一个完全属于自己的地方越来越稀缺。个人网站不是为了流量，是为了拥有。',
      type: 'observation',
      topic: 'Website / Personal',
      potential: 'medium',
      status: 'ready',
      suggestedAngles: ['个人网站是数字不动产', '在平台之外留一块自留地'],
      candidateTitles: ['个人网站的价值'],
      relatedIdeaIds: [],
      tags: ['网站', '独立'],
      createdAt: daysAgo(1, 20, 15),
      updatedAt: daysAgo(1, 20, 15),
    },
    {
      id: 'idea-3',
      title: '记录不是为了展示，而是为了忘记',
      originalThought:
        '把想法记下来，脑子才能腾出来想下一件事。记录的意义是释放，不是留存。',
      type: 'note',
      topic: 'Personal / System',
      potential: 'low',
      status: 'inbox',
      suggestedAngles: [],
      candidateTitles: [],
      relatedIdeaIds: [],
      tags: ['思考'],
      createdAt: daysAgo(3, 8, 40),
      updatedAt: daysAgo(3, 8, 40),
    },
    {
      id: 'idea-4',
      title: '养生品牌的节气内容怎么讲才不油腻',
      originalThought:
        '元养说做节气内容，容易陷入"什么节气吃什么"的套话。真正打动人的是把食材溯源讲成一个故事。',
      type: 'idea',
      topic: '元养说 / Content',
      potential: 'high',
      status: 'ready',
      suggestedAngles: ['八珍粉溯源', '黄精九蒸九晒的耐心'],
      candidateTitles: ['一味食材的旅程'],
      relatedIdeaIds: [],
      tags: ['元养说', '节气'],
      createdAt: daysAgo(5, 13, 20),
      updatedAt: daysAgo(4, 9, 0),
    },
    {
      id: 'idea-5',
      title: '创作者真正需要学习的是什么',
      originalThought:
        '工具会过时，但判断力、审美、讲故事的能力不会。AI 时代最该学的不是新工具，是创作底层。',
      type: 'idea',
      topic: 'AI / 创作者',
      potential: 'medium',
      status: 'developing',
      suggestedAngles: ['学工具还是学创作'],
      candidateTitles: [],
      relatedIdeaIds: ['idea-1'],
      tags: ['AI', '创作'],
      createdAt: daysAgo(6, 17, 5),
      updatedAt: daysAgo(6, 17, 5),
    },
  ],

  contents: [
    {
      id: 'content-1',
      title: 'AI 视频最大的误区',
      type: 'shortvideo',
      status: 'draft',
      hook: '所有人都以为 AI 在生成画面，其实它在重写创作流程。',
      mainPoint: '把 AI 当生成工具是误区，当流程伙伴才是未来。',
      conclusion: '下一步：真正理解创作者在 AI 时代的位置。',
      sourceIdeaId: 'idea-1',
      projectId: 'project-2',
      tags: ['AI', '视频'],
      createdAt: daysAgo(0, 11, 30),
      updatedAt: daysAgo(0, 11, 30),
      versions: [{ n: 1, at: daysAgo(0, 11, 30), body: '初稿' }],
    },
    {
      id: 'content-2',
      title: '个人网站为什么值得做',
      type: 'article',
      status: 'outline',
      hook: '',
      mainPoint: '独立网站是长期资产。',
      conclusion: '',
      sourceIdeaId: 'idea-2',
      projectId: 'project-1',
      tags: ['网站'],
      createdAt: daysAgo(1, 15, 10),
      updatedAt: daysAgo(1, 15, 10),
      versions: [{ n: 1, at: daysAgo(1, 15, 10), body: '大纲' }],
    },
    {
      id: 'content-3',
      title: 'AI 创作者工作流',
      type: 'shortvideo',
      status: 'production',
      hook: '',
      mainPoint: '从灵感走到成片的一整套流程。',
      conclusion: '',
      projectId: 'project-2',
      tags: ['AI', '工作流'],
      createdAt: daysAgo(2, 10, 0),
      updatedAt: daysAgo(0, 9, 45),
      versions: [{ n: 1, at: daysAgo(2, 10, 0), body: '脚本' }],
    },
    {
      id: 'content-4',
      title: '想创作高质量内容，先抓创意核心',
      type: 'shortvideo',
      status: 'published',
      hook: '创意是一切的起点。',
      mainPoint: '先有观点，再有形式。',
      conclusion: '内容完成的标志：观点被讲清楚了。',
      tags: ['创作'],
      createdAt: daysAgo(20, 14, 0),
      updatedAt: daysAgo(18, 11, 20),
      versions: [
        { n: 2, at: daysAgo(19, 16, 0), body: '成片' },
        { n: 1, at: daysAgo(20, 14, 0), body: '初稿' },
      ],
    },
  ],

  projects: [
    {
      id: 'project-1',
      name: 'SolYoung 网站',
      status: 'active',
      goal: '建立一个长期属于自己的个人网站。',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'],
      ideaIds: ['idea-2'],
      contentIds: ['content-2'],
      notes: ['首页想做得极简，留白多一点。'],
      createdAt: daysAgo(30, 10, 0),
      updatedAt: daysAgo(1, 15, 10),
    },
    {
      id: 'project-2',
      name: 'AI 视频',
      status: 'active',
      goal: '把 AI 改变创作流程这条主线做深。',
      taskIds: ['task-6', 'task-7'],
      ideaIds: ['idea-1', 'idea-5'],
      contentIds: ['content-1', 'content-3'],
      notes: [],
      createdAt: daysAgo(18, 9, 0),
      updatedAt: daysAgo(0, 11, 30),
    },
    {
      id: 'project-3',
      name: '野秋食验室',
      status: 'active',
      goal: '产品试样的实验与记录。',
      taskIds: ['task-8'],
      ideaIds: [],
      contentIds: [],
      notes: ['第一批试样已经跑通。'],
      createdAt: daysAgo(25, 8, 0),
      updatedAt: daysAgo(5, 16, 40),
    },
    {
      id: 'project-4',
      name: '秋禾农汇',
      status: 'active',
      goal: '搭建家乡辣椒品牌的内容系统。',
      taskIds: [],
      ideaIds: [],
      contentIds: [],
      notes: [],
      createdAt: daysAgo(40, 12, 0),
      updatedAt: daysAgo(12, 20, 40),
    },
    {
      id: 'project-5',
      name: 'Camera Simulator',
      status: 'paused',
      goal: '一个相机模拟器的小工具。',
      taskIds: [],
      ideaIds: [],
      contentIds: [],
      notes: ['先暂停，精力在内容上。'],
      createdAt: daysAgo(60, 15, 0),
      updatedAt: daysAgo(9, 14, 20),
    },
  ],

  tasks: [
    { id: 'task-1', title: '首页', done: true, projectId: 'project-1', createdAt: daysAgo(30, 10, 0), updatedAt: daysAgo(20, 10, 0) },
    { id: 'task-2', title: '关于页', done: true, projectId: 'project-1', createdAt: daysAgo(30, 10, 0), updatedAt: daysAgo(18, 10, 0) },
    { id: 'task-3', title: '此刻板块', done: true, projectId: 'project-1', createdAt: daysAgo(30, 10, 0), updatedAt: daysAgo(15, 10, 0) },
    { id: 'task-4', title: '档案页', done: false, projectId: 'project-1', createdAt: daysAgo(30, 10, 0), updatedAt: daysAgo(30, 10, 0) },
    { id: 'task-5', title: '移动端适配', done: false, projectId: 'project-1', createdAt: daysAgo(30, 10, 0), updatedAt: daysAgo(30, 10, 0) },
    { id: 'task-6', title: '测试模型', done: false, projectId: 'project-2', createdAt: daysAgo(18, 9, 0), updatedAt: daysAgo(18, 9, 0) },
    { id: 'task-7', title: '拍摄视频', done: false, projectId: 'project-2', createdAt: daysAgo(18, 9, 0), updatedAt: daysAgo(18, 9, 0) },
    { id: 'task-8', title: '记录试样反馈', done: false, projectId: 'project-3', createdAt: daysAgo(25, 8, 0), updatedAt: daysAgo(25, 8, 0) },
  ],

  archiveEntries: [
    { id: 'arc-1', kind: 'milestone', title: 'SolYoung OS 开始设计自己的个人创作系统', occurredOn: daysAgo(0, 0, 0).slice(0, 10), createdAt: daysAgo(0, 0, 0), updatedAt: daysAgo(0, 0, 0) },
    { id: 'arc-2', kind: 'project', title: 'AI 视频', subtitle: '开始研究 AI 视频生成。', occurredOn: daysAgo(1, 0, 0).slice(0, 10), createdAt: daysAgo(1, 0, 0), updatedAt: daysAgo(1, 0, 0) },
    { id: 'arc-3', kind: 'project', title: 'SolYoung', subtitle: '重新设计个人网站。', occurredOn: daysAgo(3, 0, 0).slice(0, 10), createdAt: daysAgo(3, 0, 0), updatedAt: daysAgo(3, 0, 0) },
    { id: 'arc-4', kind: 'project', title: '秋禾农汇', subtitle: '开始搭建品牌内容系统。', occurredOn: daysAgo(12, 0, 0).slice(0, 10), createdAt: daysAgo(12, 0, 0), updatedAt: daysAgo(12, 0, 0) },
    { id: 'arc-5', kind: 'milestone', title: '元养说', subtitle: '跑通第一批产品试样。', occurredOn: daysAgo(20, 0, 0).slice(0, 10), createdAt: daysAgo(20, 0, 0), updatedAt: daysAgo(20, 0, 0) },
  ],
};
