// EXPORTS: useShortcuts
// 全局快捷键：⌘K 搜索 / N 新建灵感 / C 新建创作 / P 新建项目 / ⇧N 发布此刻 / Esc 关闭
// 输入框内不触发全局快捷键

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Options {
  onOpenPalette: () => void;
}

function isEditable(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    node.isContentEditable
  );
}

export function useShortcuts({ onOpenPalette }: Options) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const meta = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (meta && key === 'k') {
        e.preventDefault();
        onOpenPalette();
        return;
      }
      if (meta && key === 'enter') {
        // 交由各页面自己的保存逻辑处理（这里不拦截）
        return;
      }
      if (!meta) {
        if (e.shiftKey && key === 'n') {
          e.preventDefault();
          navigate('/now');
        } else if (key === 'n') {
          e.preventDefault();
          navigate('/capture');
        } else if (key === 'c') {
          e.preventDefault();
          navigate('/content');
        } else if (key === 'p') {
          e.preventDefault();
          navigate('/projects');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onOpenPalette]);
}
