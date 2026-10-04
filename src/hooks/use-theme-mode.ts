// EXPORTS: useThemeMode
// 基于 next-themes 的主题切换封装

import { useTheme } from 'next-themes';

export function useThemeMode() {
  const { theme, setTheme } = useTheme();
  const resolved = theme ?? 'light';
  const toggle = () => setTheme(resolved === 'dark' ? 'light' : 'dark');
  return { theme: resolved, setTheme, toggle };
}
