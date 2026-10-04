// EXPORTS: SettingsPage
// 设置：个人信息 / 外观 / 数据管理 / 关于

import { useState, useRef } from 'react';
import { useDB } from '@/data/db-context';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { toast } from 'sonner';
import { Sun, Moon, Download, Upload, Trash2, User, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { db, setDb, resetAll } = useDB();
  const { theme, setTheme } = useThemeMode();
  const fileRef = useRef<HTMLInputElement>(null);

  const setName = (name: string) => {
    setDb((prev) => ({
      ...prev,
      userSettings: { ...prev.userSettings, name },
    }));
  };

  const onReset = () => {
    if (confirm('确定要清空所有数据并恢复示例吗？此操作不可撤销。')) {
      resetAll();
      toast.success('已恢复示例数据');
    }
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('已导出备份文件');
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.ideas || !data.contents || !data.projects) {
          toast.error('文件格式不正确');
          return;
        }
        setDb(() => data);
        toast.success('数据导入成功');
      } catch {
        toast.error('导入失败，请检查文件');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">设置</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          这是你自己的工作台，按你的方式来。
        </p>
      </div>

      {/* 个人信息 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-foreground">
          <User className="h-4 w-4" /> 个人信息
        </h2>
        <label className="mb-1 block text-[12px] text-muted-foreground">你的名字</label>
        <input
          value={db.userSettings?.name ?? ''}
          onChange={(e) => setName(e.target.value)}
          placeholder="怎么称呼你？"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-[14px] placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          填好后，首页问候语会自动用你的名字。
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

      {/* 数据管理 */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">数据管理</h2>
        <p className="mb-4 text-[12px] text-muted-foreground">
          数据保存在当前浏览器本地。建议定期导出备份，换设备或清理浏览器时可以导入恢复。
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] text-foreground hover:bg-accent"
          >
            <Download className="h-4 w-4" /> 导出备份
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] text-foreground hover:bg-accent"
          >
            <Upload className="h-4 w-4" /> 导入备份
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={onImport} className="hidden" />
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] text-muted-foreground hover:bg-accent hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> 清空并恢复示例
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-[15px] font-medium text-foreground">关于</h2>
        <p className="mb-4 text-[13px] text-muted-foreground">
          My OS · 记录、思考、创作，然后继续前进。
        </p>
        <a
          href="https://solyoung.top"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13px] text-foreground underline-offset-4 hover:underline"
        >
          作者网站 <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
