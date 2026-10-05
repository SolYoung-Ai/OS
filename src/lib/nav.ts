// EXPORTS: NAV_ITEMS, bottomNavItems, BASE (资源基址)
// 全局导航配置：单一来源，Layout 与 Command Palette 都从这里读

const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';

export interface INavItem {
  label: string;
  path: string;
  icon: string;
  hint?: string;
  locked?: boolean;
}

export const NAV_ITEMS: INavItem[] = [
  { label: '首页', path: '/', icon: 'home' },
  { label: '记录', path: '/capture', icon: 'capture' },
  { label: '灵感', path: '/ideas', icon: 'ideas' },
  { label: '创作', path: '/content', icon: 'content', locked: true },
  { label: '项目', path: '/projects', icon: 'projects', locked: true },
  { label: '此刻', path: '/now', icon: 'now' },
  { label: '档案', path: '/archive', icon: 'archive', locked: true },
  { label: '搜索', path: '/search', icon: 'search', hint: '⌘K' },
  { label: '设置', path: '/settings', icon: 'settings' },
];

export const BOTTOM_NAV: INavItem[] = [
  { label: '首页', path: '/', icon: 'home' },
  { label: '灵感', path: '/ideas', icon: 'ideas' },
  { label: '此刻', path: '/now', icon: 'now' },
  { label: '档案', path: '/archive', icon: 'archive' },
];

export function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname.startsWith(path);
}

export { BASE };
