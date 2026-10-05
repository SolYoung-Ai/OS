import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function isUnlocked(): boolean {
  try { return localStorage.getItem('myos:unlocked') === 'true'; } catch { return false; }
}

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  if (!isUnlocked()) {
    return <Navigate to="/settings" state={{ from: location }} replace />;
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
