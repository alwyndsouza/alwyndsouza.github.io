import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, Tag, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tradingPosts } from '@/data/trading';

export function Trading() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = Array.from(new Set(tradingPosts.map(p => p.category)));
  const allTags = Array.from(new Set(tradingPosts.flatMap(p => p.tags))).sort();

  const filtered = tradingPosts.filter(p => {
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchTags = selectedTags.length === 0 || selectedTags.every(t => p.tags.includes(t));
    return matchCat && matchTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const hasFilters = selectedCategory !== null || selectedTags.length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Trading & Macro</h1>
          <p className="text-muted-foreground text-lg">Market structure analysis, macro economics, and systematic trading research.</p>
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

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No posts match your filters.</p>
          ) : filtered.map(post => (
            <Link key={post.slug} to={`/trading/${post.slug}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(post.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
