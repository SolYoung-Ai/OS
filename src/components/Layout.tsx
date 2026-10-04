// EXPORTS: Layout
// 全局 chrome：桌面左侧 220px 侧边栏 + 移动端底部导航 + 顶栏（主题切换 / ⌘K）
// 全局 Command Palette 与快捷键也挂在这里

import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NAV_ITEMS, BOTTOM_NAV, isActive } from '@/lib/nav';
import { NavIcon } from '@/components/NavIcon';
import CommandPalette from '@/components/CommandPalette';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Search, Moon, Sun, Plus } from 'lucide-react';

export const Layout = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggle } = useThemeMode();
  useShortcuts({ onOpenPalette: () => setPaletteOpen(true) });

  // 品牌区 + 主导航（桌面侧边栏）
  const renderBrand = () => (
    <div className="px-3 pt-5 pb-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-baseline text-[17px] font-semibold tracking-tight text-foreground"
        aria-label="回到首页"
      >
        My<span className="text-[#E8632B]"> </span>OS
      </button>
      <p className="mt-1.5 pl-0.5 text-[11px] leading-snug text-muted-foreground">
        记录、思考、创作，然后继续前进。
      </p>
    </div>
  );

  const renderDesktopNav = () => (
    <nav className="flex-1 space-y-0.5 px-2 py-1" aria-label="主导航">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive: act }) =>
            `flex items-center gap-3 rounded-md px-3 py-[7px] text-[13px] transition-colors duration-150 ${
              act
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
            }`
          }
        >
          <NavIcon name={item.icon} className="h-[15px] w-[15px]" />
          <span className="flex-1">{item.label}</span>
          {item.hint && (
            <kbd className="text-[10px] text-muted-foreground/70">⌘K</kbd>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Toaster position="bottom-center" theme={theme === 'dark' ? 'dark' : 'light'} />

      {/* ── 桌面侧边栏（≥ md） ─────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-border bg-sidebar md:flex">
        {renderBrand()}
        {renderDesktopNav()}
        <div className="border-t border-border p-2 text-[11px] text-muted-foreground">
          <p className="px-3 py-1">© 2026 SolYoung</p>
        </div>
      </aside>

      {/* ── 顶栏（桌面：搜索+主题；移动端：品牌） ───── */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:left-[220px] md:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            My<span className="text-[#E8632B]"> </span>OS
          </span>
        </div>

        <div className="hidden md:flex md:flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground md:flex"
            aria-label="搜索"
          >
            <Search className="h-3.5 w-3.5" />
            <span>搜索</span>
            <kbd className="ml-1 rounded border border-border px-1 text-[10px]">⌘K</kbd>
          </button>
          <button
            onClick={toggle}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="切换主题"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── 主内容区 ─────────────────────────────── */}
      <main className="pt-14 md:ml-[220px]">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-8 md:px-8">
          <Outlet />
        </div>
      </main>

      {/* ── 移动端底部导航 + 中间新建按钮（< md） ───── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-sidebar py-1.5 md:hidden"
        aria-label="底部导航"
      >
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={`flex flex-col items-center gap-0.5 rounded-md px-4 py-1.5 text-[10px] transition-colors duration-150 ${
              isActive(pathname, item.path)
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <NavIcon name={item.icon} className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        {/* 中间圆形新建按钮（叠在灵感之上，稍靠右以露出） */}
        <button
          onClick={() => navigate('/capture')}
          className="absolute -top-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform active:scale-95"
          aria-label="快速记录"
        >
          <Plus className="h-5 w-5" />
        </button>
      </nav>

      {/* 底部留白，避免被移动端导航遮挡 */}
      <div className="h-16 md:hidden" />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};
