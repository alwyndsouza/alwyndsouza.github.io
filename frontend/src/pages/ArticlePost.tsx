import { useParams, Link, Navigate } from 'react-router';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';
import 'highlight.js/styles/github-dark.css';

/**
 * Render the article page for the slug from route parameters or redirect to the articles index when no match is found.
 *
 * @returns The article page JSX element, or a navigation element that redirects to `/articles` when the slug does not match any article.
 */
export function ArticlePost() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/articles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors text-sm">
          <ArrowLeft className="size-4" />
          Back to Articles
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              {!article.published && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Draft</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">{article.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-5 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="size-4" />{new Date(article.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" />{article.readTime}</span>
            </div>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="size-4 text-muted-foreground" />
                {article.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="mb-8">
              <img src={article.coverImage} alt={article.title} className="w-full rounded-lg object-cover max-h-96" />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-muted-foreground mb-10 italic border-l-4 border-muted pl-5 py-2">{article.excerpt}</p>
            <div className="text-foreground" dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
          </div>
        </article>

        {/* More Articles */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4">More Articles</h3>
          <div className="space-y-3">
            {articles.filter(a => a.slug !== slug).slice(0, 3).map(related => (
              <Link key={related.slug} to={`/articles/${related.slug}`} className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <Badge variant="secondary" className="mb-2 text-xs">{related.category}</Badge>
                <p className="font-medium text-sm">{related.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}
