import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, Tag, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';

/**
 * Renders a filterable articles listing with category badges, tag filters, active filter controls, and article cards.
 *
 * @returns The JSX element that displays filter controls, a summary ("Showing X of Y articles"), and the list of article cards (or a no-results message).
 */
export function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = Array.from(new Set(articles.map(a => a.category)));
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags))).sort();

  const filtered = articles.filter(a => {
    const matchCat = !selectedCategory || a.category === selectedCategory;
    const matchTags = selectedTags.length === 0 || selectedTags.every(t => a.tags.includes(t));
    return matchCat && matchTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const hasFilters = selectedCategory !== null || selectedTags.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Articles</h1>
          <p className="text-muted-foreground text-lg">Practical writing on Data Engineering, DataOps, AI, and more.</p>
        </div>

        {/* Category filter */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant={selectedCategory === null ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedCategory(null)}>All</Badge>
            {categories.map(cat => (
              <Badge key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent" onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>{cat}</Badge>
            ))}
          </div>
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1"><Tag className="size-3" />Tags</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer hover:bg-accent text-xs" onClick={() => toggleTag(tag)}>{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active filters */}
        {hasFilters && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtering by:</span>
            {selectedCategory && <Badge variant="secondary" className="gap-1">{selectedCategory}<X className="size-3 cursor-pointer" onClick={() => setSelectedCategory(null)} /></Badge>}
            {selectedTags.map(tag => <Badge key={tag} variant="secondary" className="gap-1">{tag}<X className="size-3 cursor-pointer" onClick={() => toggleTag(tag)} /></Badge>)}
            <button onClick={() => { setSelectedCategory(null); setSelectedTags([]); }} className="text-sm text-muted-foreground hover:text-foreground underline">Clear all</button>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-6">Showing {filtered.length} of {articles.length} articles</p>

        {(() => {
          const cardColors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
          return (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No articles match your filters.</p>
          ) : filtered.map((article, i) => (
            <Link key={article.slug} to={`/articles/${article.slug}`}>
              <Card className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cardColors[i % 4]}, transparent)` }} />
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>{article.category}</span>
                    {!article.published && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Draft</Badge>}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(article.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{article.readTime}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
          );
        })()}
    </div>
  );
}
