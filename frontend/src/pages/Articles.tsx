import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { articles } from '@/data/articles';
import { articleCategories, getArticleCategoryBucket } from '@/data/config';

/**
 * Renders a lean, filterable articles listing: a small set of curated
 * top-level categories, a single search input that matches title,
 * excerpt and tags, and clickable tags on each card that feed back
 * into the search input.
 */
export function Articles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const bucket = getArticleCategoryBucket(a.category);
      const matchCat = !selectedCategory || bucket === selectedCategory;
      if (!matchCat) return false;
      if (!trimmedQuery) return true;
      const haystack = [
        a.title,
        a.excerpt,
        a.category,
        ...a.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [selectedCategory, trimmedQuery]);

  const hasFilters = selectedCategory !== null || trimmedQuery.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Articles</h1>
        <p className="text-muted-foreground text-lg">
          Practical writing on Data Engineering, DataOps, AI, and more.
        </p>
      </div>

      {/* Search + curated categories */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles by title, tag, or keyword..."
            aria-label="Search articles"
            className="w-full rounded-md border bg-background pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {articleCategories.map(cat => (
            <Badge
              key={cat.label}
              variant={selectedCategory === cat.label ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.label ? null : cat.label)
              }
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {articles.length} articles
        </p>
        {hasFilters && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setQuery('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {(() => {
        const cardColors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
        return (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">
                No articles match your filters.
              </p>
            ) : (
              filtered.map((article, i) => (
                <Link key={article.slug} to={`/articles/${article.slug}`}>
                  <Card className="hover:shadow-md transition-shadow overflow-hidden">
                    <div
                      className="h-1 w-full"
                      style={{
                        background: `linear-gradient(90deg, ${cardColors[i % 4]}, transparent)`,
                      }}
                    />
                    <CardContent className="pt-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{
                            background:
                              'linear-gradient(135deg, #a855f7, #3b82f6)',
                          }}
                        >
                          {article.category}
                        </span>
                        {!article.published && (
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-yellow-600"
                          >
                            Draft
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold mb-2">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(article.date).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {article.readTime}
                        </span>
                      </div>
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map(tag => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-accent"
                              onClick={e => {
                                e.preventDefault();
                                setQuery(tag);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        );
      })()}
    </div>
  );
}
