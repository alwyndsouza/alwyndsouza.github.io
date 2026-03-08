import { Outlet, Link, useLocation } from 'react-router';
import { Database, Code2 } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <nav className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Database className="size-5" />
              <span className="font-mono font-semibold">alwyn.dev</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={`transition-colors hover:text-primary text-sm ${
                  isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                to="/articles"
                className={`transition-colors hover:text-primary text-sm ${
                  isActive('/articles') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Articles
              </Link>
              <Link
                to="/projects"
                className={`transition-colors hover:text-primary text-sm ${
                  isActive('/projects') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/about"
                className={`transition-colors hover:text-primary text-sm ${
                  isActive('/about') ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                About
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Code2 className="size-4" />
              <span>© 2025 Alwyn Dsouza. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/alwyndsouza" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/alwynanildsouza/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
