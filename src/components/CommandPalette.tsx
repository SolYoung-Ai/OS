// EXPORTS: CommandPalette
// ⌘K 全局命令面板：搜索所有内容 + 快捷操作，几乎无需鼠标

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDB } from '@/data/db-context';
import { Search, Plus, ArrowRight, FileText, FolderOpen } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { db } = useDB();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);

  const ideas = q ? db.ideas.filter((i) => match(i.title) || match(i.topic)) : [];
  const contents = q ? db.contents.filter((c) => match(c.title)) : [];
  const projects = q ? db.projects.filter((p) => match(p.name)) : [];
  const nows = q ? db.nowEntries.filter((n) => match(n.text)).slice(0, 4) : [];

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border border-border shadow-lg">
        <CommandInput
          placeholder="搜索所有内容，或输入命令…"
          value={query}
          onValueChange={setQuery}
          className="h-12"
        />
        <CommandList className="max-h-[50vh]">
          <CommandEmpty>没有找到匹配的内容。</CommandEmpty>

          {!q && (
            <CommandGroup heading="快捷操作">
              <CommandItem onSelect={() => go('/capture')}>
                <Plus className="mr-2 h-4 w-4" />
                新建灵感
                <span className="ml-auto text-xs text-muted-foreground">N</span>
              </CommandItem>
              <CommandItem onSelect={() => go('/content')}>
                <FileText className="mr-2 h-4 w-4" />
                新建创作
                <span className="ml-auto text-xs text-muted-foreground">C</span>
              </CommandItem>
              <CommandItem onSelect={() => go('/projects')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                新建项目
                <span className="ml-auto text-xs text-muted-foreground">P</span>
              </CommandItem>
              <CommandItem onSelect={() => go('/now')}>
                <Plus className="mr-2 h-4 w-4" />
                发布此刻
                <span className="ml-auto text-xs text-muted-foreground">⇧N</span>
              </CommandItem>
              <CommandItem onSelect={() => go('/archive')}>
                <ArrowRight className="mr-2 h-4 w-4" />
                前往档案
              </CommandItem>
            </CommandGroup>
          )}

          {q && (
            <>
              {ideas.length > 0 && (
                <CommandGroup heading={`灵感 ${ideas.length} 条`}>
                  {ideas.map((i) => (
                    <CommandItem key={i.id} onSelect={() => go(`/ideas/${i.id}`)}>
                      <Search className="mr-2 h-4 w-4" />
                      {i.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {contents.length > 0 && (
                <CommandGroup heading={`创作 ${contents.length} 条`}>
                  {contents.map((c) => (
                    <CommandItem key={c.id} onSelect={() => go(`/content/${c.id}`)}>
                      <FileText className="mr-2 h-4 w-4" />
                      {c.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {projects.length > 0 && (
                <CommandGroup heading={`项目 ${projects.length} 条`}>
                  {projects.map((p) => (
                    <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {nows.length > 0 && (
                <CommandGroup heading={`此刻 ${nows.length} 条`}>
                  {nows.map((n) => (
                    <CommandItem key={n.id} onSelect={() => go('/now')}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {n.text}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
