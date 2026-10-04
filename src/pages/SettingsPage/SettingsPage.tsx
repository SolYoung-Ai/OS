// EXPORTS: SettingsPage
// 设置：外观 / AI 服务商 / 模型设置 / AI 用量 / 数据

import { useState } from 'react';
import { useDB } from '@/data/db-context';
import { useThemeMode } from '@/hooks/use-theme-mode';
import type { TaskKind } from '@/data/types';
import { toast } from 'sonner';
import { Sun, Moon, KeyRound } from 'lucide-react';

const TASK_LABEL: Record<TaskKind, string> = {
  writing: '写作',
  reasoning: '推理',
  imagePrompt: '图片提示词',
};

export default function SettingsPage() {
  const { db, setDb, resetAll } = useDB();
  const { theme, setTheme } = useThemeMode();
  const [testing, setTesting] = useState(false);

  const toggleProvider = (id: string) => {
    setDb((prev) => ({
      ...prev,
      aiProviders: prev.aiProviders.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p,
      ),
    }));
  };

  const setEndpoint = (id: string, endpoint: string) => {
    setDb((prev) => ({
      ...prev,
      aiProviders: prev.aiProviders.map((p) =>
        p.id === id ? { ...p, endpoint } : p,
      ),
    }));
  };

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.info('提示：请先在 server/ 目录运行代理并填好 ARK_API_KEY');
    }, 1200);
  };

  const onReset = () => {
    resetAll();
    toast.success('已恢复示例数据');
  };

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">设置</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          这是你自己的系统，按你的方式来。
        </p>
      </div>

      {/* 外观 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">外观</h2>
        <div className="flex items-center gap-2">
          {[
            { id: 'light', label: '浅色', icon: Sun },
            { id: 'dark', label: '深色', icon: Moon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] transition-colors ${
                theme === id
                  ? 'border-foreground bg-accent text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* AI 服务商 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-[15px] font-medium text-foreground">AI 服务商</h2>
        </div>
        <p className="mb-4 text-[12px] text-muted-foreground">
          密钥只存在你自己的服务端代理（server/.env），前端不接触任何 Key。
        </p>
        <div className="space-y-2">
          {db.aiProviders.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={() => toggleProvider(p.id)}
                  className="h-4 w-4 accent-foreground"
                />
                <span className="text-[14px] text-foreground">{p.label}</span>
              </div>
              <input
                value={p.endpoint}
                onChange={(e) => setEndpoint(p.id, e.target.value)}
                placeholder="代理地址，如 http://localhost:8787"
                className="w-56 rounded-md border border-border bg-background px-3 py-1.5 text-[12px] placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={testConnection}
          disabled={testing}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] text-foreground hover:bg-accent disabled:opacity-50"
        >
          <KeyRound className="h-4 w-4" /> {testing ? '检测中…' : '测试连接'}
        </button>
      </div>

      {/* 模型设置 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">模型设置</h2>
        <div className="space-y-3">
          {(Object.keys(TASK_LABEL) as TaskKind[]).map((task) => (
            <div key={task} className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-foreground">{TASK_LABEL[task]}</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-muted-foreground">模型</span>
                <input
                  value={db.modelSettings.find((s) => s.task === task)?.model ?? ''}
                  onChange={(e) =>
                    setDb((prev) => ({
                      ...prev,
                      modelSettings: prev.modelSettings.map((s) =>
                        s.task === task ? { ...s, model: e.target.value } : s,
                      ),
                    }))
                  }
                  className="w-44 rounded-md border border-border bg-background px-3 py-1.5 text-[12px] focus:border-foreground/30 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI 用量 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">AI 用量</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-muted/50 py-4">
            <p className="text-[20px] font-medium text-foreground">{db.aiUsage.requests}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">请求次数</p>
          </div>
          <div className="rounded-lg bg-muted/50 py-4">
            <p className="text-[20px] font-medium text-foreground">{db.aiUsage.tokens}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">消耗 Token</p>
          </div>
          <div className="rounded-lg bg-muted/50 py-4">
            <p className="text-[20px] font-medium text-foreground">¥{db.aiUsage.estimatedCostCny}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">预计成本</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          接入真实豆包代理后，这里会自动累计用量。
        </p>
      </div>

      {/* 数据 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">数据</h2>
        <p className="mb-3 text-[12px] text-muted-foreground">
          数据保存在当前浏览器的本地存储中，不会自动上传。
        </p>
        <button
          onClick={onReset}
          className="rounded-lg border border-border px-4 py-2 text-[13px] text-muted-foreground hover:bg-accent hover:text-destructive"
        >
          恢复示例数据
        </button>
      </div>
    </div>
  );
}
