// EXPORTS: AI_ACTIONS, AICmd, runAIOrganize, runAIAction
// AI 服务层：Provider 架构。前端绝不持有 API Key。
// 真实接入通过用户自建的 Node 代理（server/）转发到豆包等 Provider，
// 代理未配置 / 请求失败时自动回落到本地模拟（保证页面始终可用）。

import type { IDB, ProviderId, TaskKind } from '@/data/types';

export type AICmd =
  | 'improve'
  | 'shorter'
  | 'hook'
  | 'outline'
  | 'script60'
  | 'title'
  | 'visual'
  | 'translate'
  | 'summarize';

export const AI_ACTIONS: { id: AICmd; label: string }[] = [
  { id: 'improve', label: '润色文本' },
  { id: 'shorter', label: '精简篇幅' },
  { id: 'hook', label: '生成钩子' },
  { id: 'outline', label: '生成大纲' },
  { id: 'script60', label: '生成60秒脚本' },
  { id: 'title', label: '生成标题' },
  { id: 'visual', label: '生成视觉创意' },
  { id: 'translate', label: '翻译' },
  { id: 'summarize', label: '总结' },
];

export interface AIOrganizeResult {
  type: string;
  topic: string;
  potential: string;
  angles: string[];
}

/** 是否已配置真实代理（在设置里填了 endpoint 且启用对应 provider） */
function proxyConfigured(db: IDB): boolean {
  return db.aiProviders.some((p) => p.enabled && !!p.endpoint);
}

function pickModel(db: IDB, task: TaskKind): { providerId: ProviderId; model: string; endpoint: string } {
  const setting = db.modelSettings.find((s) => s.task === task);
  const provider = db.aiProviders.find((p) => p.id === (setting?.providerId ?? 'doubao'));
  return {
    providerId: provider?.id ?? 'doubao',
    model: provider?.model ?? 'doubao-pro-32k',
    endpoint: provider?.endpoint ?? '',
  };
}

async function callProxy(endpoint: string, providerId: ProviderId, model: string, prompt: string): Promise<string> {
  // 走自建代理：POST { provider, model, messages }，代理负责持有 API Key 并转发
  const res = await fetch(`${endpoint.replace(/\/$/, '')}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: providerId,
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`proxy ${res.status}: ${text.slice(0, 120)}`);
  }
  const data = (await res.json()) as { text?: string; error?: string };
  if (data.error) throw new Error(data.error);
  return data.text ?? '';
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Capture 的 AI 自动整理：真实代理优先，否则本地模拟 */
export async function runAIOrganize(db: IDB, text: string): Promise<AIOrganizeResult> {
  const task: TaskKind = 'reasoning';
  const { endpoint, providerId, model } = pickModel(db, task);

  const prompt = `请把下面的想法整理成创作灵感。只返回 JSON，不要多余文字：
{
  "type": "灵感|笔记|观察",
  "topic": "主题（中文，简短）",
  "potential": "高|中|低",
  "angles": ["角度1", "角度2", "角度3"]
}
想法内容：${text}`;

  if (proxyConfigured(db) && endpoint) {
    try {
      const raw = await callProxy(endpoint, providerId, model, prompt);
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned) as AIOrganizeResult;
      return {
        type: parsed.type ?? '灵感',
        topic: parsed.topic ?? '未分类',
        potential: parsed.potential ?? '中',
        angles: Array.isArray(parsed.angles) ? parsed.angles : [],
      };
    } catch {
      // 代理失败回落本地模拟
    }
  }

  // 本地模拟整理（保证无配置也可用）
  await delay(1100);
  const base = text.slice(0, 40);
  const isVideoLike = /视频|AI|生成|创作|画面/.test(text);
  return {
    type: '灵感',
    topic: isVideoLike ? 'AI / 创作者' : '未分类',
    potential: text.length > 30 ? '高' : '中',
    angles: [
      '01 从「生成画面」到「改变流程」',
      '02 创作者真正需要学习什么',
      '03 一个被低估的切入角度',
    ],
  };
}

/** Content 编辑器的 AI Command Bar 动作 */
export async function runAIAction(
  db: IDB,
  cmd: AICmd,
  context: { title: string; hook: string; mainPoint: string; conclusion: string },
): Promise<string> {
  const task: TaskKind = cmd === 'translate' ? 'reasoning' : 'writing';
  const { endpoint, providerId, model } = pickModel(db, task);

  const doc = `标题：${context.title}\n钩子：${context.hook}\n核心观点：${context.mainPoint}\n结尾：${context.conclusion}`;
  const promptMap: Record<AICmd, string> = {
    improve: `请润色下面内容，保持原意，语气自然。\n${doc}`,
    shorter: `请把下面内容精简到一半长度，保留核心。\n${doc}`,
    hook: `基于下面的核心观点，写 3 个有吸引力的视频钩子（每个一行）。\n${doc}`,
    outline: `基于下面的标题与观点，给出一份短视频/文章大纲，分点列出。\n${doc}`,
    script60: `基于下面的内容，写一份 60 秒口播脚本，分句，含开场钩子和结尾行动号召。\n${doc}`,
    title: `为下面内容写 5 个候选标题（每个一行）。\n${doc}`,
    visual: `为下面内容给出 3 个画面视觉创意（场景/构图/镜头，每个一段）。\n${doc}`,
    translate: `把下面内容翻译成英文。\n${doc}`,
    summarize: `用三句话总结下面内容。\n${doc}`,
  };

  if (proxyConfigured(db) && endpoint) {
    try {
      return await callProxy(endpoint, providerId, model, promptMap[cmd]);
    } catch {
      // 回落本地模拟
    }
  }

  // 本地模拟生成（保证无配置也可用）
  await delay(1000);
  const local: Record<AICmd, string> = {
    improve: `${context.mainPoint}\n（已润色：语气更自然，结构更紧凑。配置豆包代理后生成真实结果。）`,
    shorter: `${context.hook}\n${context.mainPoint.slice(0, 30)}`,
    hook: `1. 所有人都以为 AI 在生成画面。\n2. 其实它在重写创作流程。\n3. 这才是创作者真正的机会。`,
    outline: `1. 开场：一个常见误区\n2. 转折：AI 真正改变的是什么\n3. 论证：流程如何被重写\n4. 结尾：创作者的位置`,
    script60: `【钩子】你以为 AI 只是帮你生成画面？\n【展开】它正在悄悄重写你整个创作流程。\n【观点】工具会过时，判断力不会。\n【结尾】想清楚这一点，你才不会被时代淘汰。`,
    title: `1. AI 视频最大的误区\n2. AI 改变的不是画面\n3. 创作者的 AI 必修课`,
    visual: `1. 桌面俯拍：脚本、素材、成片的时间线\n2. 人对着一台黑屏电脑沉思，屏幕浮现流程\n3. 镜头推进到「创作」两个字被重写`,
    translate: `Most people think AI is just generating images. In fact, it is rewriting the entire creative workflow.`,
    summarize: `核心是：AI 改变的不是生成画面，而是创作者的全流程。真正该学的是创作底层能力。`,
  };
  return local[cmd];
}
