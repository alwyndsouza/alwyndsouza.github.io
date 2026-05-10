import { Link } from 'react-router';
import { Home, BookOpen, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function NotFound() {
  useDocumentMeta({
    title: 'Page not found',
    description: 'The page you were looking for doesn’t exist.',
    path: '/404',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-sm font-mono text-primary mb-4">404</p>
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        This page wandered off.
      </h1>
      <p className="text-muted-foreground mb-10">
        The link may be broken, or the page might have moved. Try one of these
        instead:
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <Button variant="default" className="gap-2">
            <Home className="size-4" />
            Home
          </Button>
        </Link>
        <Link to="/articles">
          <Button variant="outline" className="gap-2">
            <BookOpen className="size-4" />
            Articles
          </Button>
        </Link>
        <Link to="/projects">
          <Button variant="outline" className="gap-2">
            <FolderKanban className="size-4" />
            Projects
          </Button>
        </Link>
      </div>
    </div>
  );
}
