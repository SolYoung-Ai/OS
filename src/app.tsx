import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <DBProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="capture" element={<CapturePage />} />
          <Route path="ideas" element={<IdeasPage />} />
          <Route path="ideas/:id" element={<IdeaDetailPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="content/:id" element={<ContentEditorPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="now" element={<NowPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </DBProvider>
  );
}
