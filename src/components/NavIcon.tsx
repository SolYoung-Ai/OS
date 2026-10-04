// EXPORTS: NavIcon
// 把导航配置里的 icon 字符串映射为 lucide 组件

import {
  Home,
  Zap,
  Lightbulb,
  FileText,
  FolderKanban,
  Radio,
  Archive,
  Search,
  Settings,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  home: Home,
  capture: Zap,
  ideas: Lightbulb,
  content: FileText,
  projects: FolderKanban,
  now: Radio,
  archive: Archive,
  search: Search,
  settings: Settings,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Home;
  return <Icon className={className} />;
}
