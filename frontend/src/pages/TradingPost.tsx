import { useParams, Link, Navigate } from 'react-router';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { tradingPosts } from '@/data/trading';
import 'highlight.js/styles/github-dark.css';

export function TradingPost() {
  const { slug } = useParams();
  const post = tradingPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/trading" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/trading" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors text-sm">
          <ArrowLeft className="size-4" />
          Back to Trading & Macro
        </Link>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-5 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="size-4" />{new Date(post.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" />{post.readTime}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="size-4 text-muted-foreground" />
                {post.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className="mb-8">
              <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover max-h-96" />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-muted-foreground mb-10 italic border-l-4 border-muted pl-5 py-2">{post.excerpt}</p>
            <div className="text-foreground" dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4">More Research</h3>
          <div className="space-y-3">
            {tradingPosts.filter(p => p.slug !== slug).slice(0, 3).map(related => (
              <Link key={related.slug} to={`/trading/${related.slug}`} className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                <Badge variant="secondary" className="mb-2 text-xs">{related.category}</Badge>
                <p className="font-medium text-sm">{related.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
