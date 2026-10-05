import { Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DBProvider } from '@/data/store';
import HomePage from '@/pages/HomePage/HomePage';
import CapturePage from '@/pages/CapturePage/CapturePage';
import IdeasPage from '@/pages/IdeasPage/IdeasPage';
import IdeaDetailPage from '@/pages/IdeaDetailPage/IdeaDetailPage';
import ContentPage from '@/pages/ContentPage/ContentPage';
import ContentEditorPage from '@/pages/ContentEditorPage/ContentEditorPage';
import ProjectsPage from '@/pages/ProjectsPage/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage/ProjectDetailPage';
import NowPage from '@/pages/NowPage/NowPage';
import ArchivePage from '@/pages/ArchivePage/ArchivePage';
import SearchPage from '@/pages/SearchPage/SearchPage';
import SettingsPage from '@/pages/SettingsPage/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { Lock } from 'lucide-react';

function isUnlocked(): boolean {
  try { return localStorage.getItem('myos:unlocked') === 'true'; } catch { return false; }
}

function LockedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h2 className="text-[18px] font-medium text-foreground">需要邀请码解锁</h2>
      <p className="mt-2 max-w-[320px] text-[13px] text-muted-foreground">
        这个功能需要输入邀请码才能使用。前往设置页输入邀请码解锁。
      </p>
      <button
        onClick={() => navigate('/settings')}
        className="mt-6 rounded-md bg-foreground px-5 py-2 text-[13px] font-medium text-background hover:opacity-90"
      >
        前往设置
      </button>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  if (!isUnlocked()) {
    return <LockedPage />;
  }
  return children;
}

export default function App() {
  return (
    <DBProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="capture" element={<CapturePage />} />
          <Route path="ideas" element={<IdeasPage />} />
          <Route path="ideas/:id" element={<IdeaDetailPage />} />
          <Route path="content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
          <Route path="content/:id" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
          <Route path="now" element={<NowPage />} />
          <Route path="archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </DBProvider>
  );
}
