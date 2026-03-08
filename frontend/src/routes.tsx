import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Articles } from './pages/Articles';
import { ArticlePost } from './pages/ArticlePost';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Trading } from './pages/Trading';
import { TradingPost } from './pages/TradingPost';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'articles', Component: Articles },
      { path: 'articles/:slug', Component: ArticlePost },
      { path: 'projects', Component: Projects },
      { path: 'projects/:id', Component: ProjectDetail },
    ],
  },
]);
