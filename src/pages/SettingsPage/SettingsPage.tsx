// EXPORTS: SettingsPage
// 设置：个人信息 / 外观 / 数据管理 / 下载安装 / 使用教学 / 关于

import { useState, useRef } from 'react';
import { useDB } from '@/data/db-context';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { toast } from 'sonner';
import {
  Sun, Moon, Download, Upload, Trash2, User, ExternalLink,
  Monitor, HelpCircle, ChevronDown,
} from 'lucide-react';

export default function SettingsPage() {
  const { db, setDb, resetAll } = useDB();
  const { theme, setTheme } = useThemeMode();
  const fileRef = useRef<HTMLInputElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [installStep, setInstallStep] = useState<'chrome' | 'edge' | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem('myos:unlocked') === 'true'; } catch { return false; }
  });

  const onUnlock = () => {
    const codes = ['MYOS-2026-DEMO', 'MYOS-2026-PRO', 'MYOS-2026-VIP'];
    if (codes.includes(codeInput.trim().toUpperCase())) {
      try { localStorage.setItem('myos:unlocked', 'true'); } catch {}
      setUnlocked(true);
      setUnlockError('');
      toast.success('已解锁全部功能');
    } else {
      setUnlockError('邀请码无效，请检查后重试');
    }
  };

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
    a.download = `my-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
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

  const faqs = [
    {
      q: '怎么改我的名字？',
      a: '在上方「个人信息」输入框填你的名字，首页问候语会自动变成"下午好，XXX"。不填则只显示"下午好"。',
    },
    {
      q: '怎么下载到自己电脑上用？',
      a: '两种方式：\n\n1. 【推荐】用 Chrome / Edge 打开本站，地址栏右侧会出现「安装」图标，点击即可安装为桌面应用，离线也能用。\n\n2. 手动方式：把整个网站的静态文件下载下来，双击 index.html 即可在浏览器打开，数据存在你自己的浏览器里。',
    },
    {
      q: '我的数据存在哪里？会丢吗？',
      a: '所有数据都存在你当前浏览器的 localStorage 里，不会上传到任何服务器。换浏览器、清理浏览器缓存、或者卸载重装浏览器都会丢失数据。\n\n所以建议：定期点「导出备份」下载一个 JSON 文件，换设备时点「导入备份」恢复。',
    },
    {
      q: '每个页面是干什么的？',
      a: '· 首页：快速记录灵感，看最近在做什么\n· 记录：Capture，随手记想法\n· 灵感：所有捕获的想法列表\n· 创作：把想法变成内容（脚本/文案/文章）\n· 项目：管理正在进行的事\n· 此刻：简短记录正在做什么\n· 档案：所有内容的时间线归档',
    },
    {
      q: '快捷键有哪些？',
      a: '· ⌘K（Ctrl+K）：全局搜索\n· N：新建灵感\n· C：新建内容\n· P：新建项目\n· Shift+N：新此刻\n· Esc：关闭弹窗\n\n在输入框里打字时快捷键不会触发。',
    },
    {
      q: '怎么备份和迁移数据？',
      a: '点「导出备份」会下载一个 JSON 文件。换电脑或换浏览器后，打开本站，点「导入备份」选择这个 JSON 文件，所有数据就恢复了。',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="pb-6 pt-2">
        <h1 className="text-[24px] font-medium tracking-tight text-foreground">设置</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          这是你自己的工作台，按你的方式来。
        </p>
      </div>

      {/* 个人信息 */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
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

      {/* 邀请码 */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 text-[15px] font-medium text-foreground">邀请码</h2>
        {unlocked ? (
          <p className="text-[13px] text-muted-foreground">
            已解锁全部功能 ✓
          </p>
        ) : (
          <>
            <p className="mb-3 text-[12px] text-muted-foreground">
              输入邀请码解锁全部功能。未解锁状态下部分功能受限。
            </p>
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="输入邀请码"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-[14px] placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none"
              />
              <button
                onClick={onUnlock}
                className="rounded-md bg-foreground px-4 py-2 text-[13px] font-medium text-background hover:opacity-90"
              >
                解锁
              </button>
            </div>
            {unlockError && (
              <p className="mt-2 text-[12px] text-destructive">{unlockError}</p>
            )}
          </>
        )}
      </div>

      {/* 下载安装 */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-foreground">
          <Monitor className="h-4 w-4" /> 下载到自己电脑
        </h2>
        <div className="space-y-3">
          {/* 方式一 */}
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-medium text-foreground">方式一：安装为桌面应用（推荐）</p>
            <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground">
              用 Chrome 或 Edge 打开本站，安装成独立应用，离线可用。
            </p>
            {!installStep && (
              <div className="flex gap-2">
                <button
                  onClick={() => setInstallStep('chrome')}
                  className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-accent"
                >
                  Chrome
                </button>
                <button
                  onClick={() => setInstallStep('edge')}
                  className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-accent"
                >
                  Edge
                </button>
              </div>
            )}
            {installStep && (
              <div className="rounded-md border border-border bg-card p-3">
                <p className="mb-2 text-[12px] font-medium text-foreground">
                  {installStep === 'chrome' ? 'Chrome 安装步骤' : 'Edge 安装步骤'}
                </p>
                <ol className="space-y-1 text-[11px] leading-relaxed text-muted-foreground">
                  <li>1. 用 {installStep === 'chrome' ? 'Chrome' : 'Edge'} 浏览器打开本站</li>
                  <li>2. 看地址栏右侧，找到「安装 / Install」图标（像一个显示器带向下箭头）</li>
                  <li>3. 点击它，选择「安装」</li>
                  <li>4. 安装完成后会自动打开一个独立窗口，桌面也会出现快捷方式</li>
                </ol>
                <button
                  onClick={() => setInstallStep(null)}
                  className="mt-2 text-[11px] text-muted-foreground underline"
                >
                  返回
                </button>
              </div>
            )}
          </div>

          {/* 方式二 */}
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-medium text-foreground">方式二：下载静态文件</p>
            <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground">
              下载整个网站的文件包，解压后双击 index.html 即可在浏览器打开。
            </p>
            <a
              href="https://github.com/SolYoung-Ai/solyoung-os/archive/refs/heads/gh-pages.zip"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[12px] text-foreground hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" /> 下载网站文件
            </a>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
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

      {/* 使用教学 */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-foreground">
          <HelpCircle className="h-4 w-4" /> 使用教学
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-foreground hover:bg-accent/50"
              >
                {faq.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-border px-4 py-3 text-[12px] leading-relaxed whitespace-pre-line text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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
