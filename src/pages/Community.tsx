import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Users, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { getPosts, createPost, toggleLike, addComment, formatTimeAgo, Post } from '@/lib/posts';
import { getMemberCount } from '@/lib/auth';

const AvatarBadge = ({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg'; color?: string }) => {
  const sz = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-navy text-white flex items-center justify-center font-bold shrink-0 border-2 border-gold/20`}>
      {initials}
    </div>
  );
};

const PostCard = ({ post, currentUserId, onLike, onComment }: {
  post: Post; currentUserId: string;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = post.likes.includes(currentUserId);

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <AvatarBadge initials={post.authorAvatar} />
          <div>
            <p className="font-semibold text-card-foreground text-sm">{post.authorName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {post.authorCountry && <><Globe className="h-3 w-3" />{post.authorCountry} · </>}
              {formatTimeAgo(post.timestamp)}
            </p>
          </div>
        </div>
        <p className="text-card-foreground leading-relaxed text-sm whitespace-pre-line">{post.content}</p>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center gap-4">
        <button onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          {post.likes.length > 0 && post.likes.length}
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy dark:hover:text-gold font-medium transition-colors">
          <MessageCircle className="h-4 w-4" />
          {post.comments.length > 0 && post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="px-5 pb-4 space-y-3">
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <AvatarBadge initials={c.authorAvatar} size="sm" />
              <div className="bg-secondary/50 rounded-lg px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-navy dark:text-gold-light">{c.authorName}</p>
                <p className="text-xs text-card-foreground mt-0.5">{c.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{formatTimeAgo(c.timestamp)}</p>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2 mt-3">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..." className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold/50" />
            <Button type="submit" size="sm" variant="gold" disabled={!commentText.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Fetch posts and member count on mount
  useEffect(() => {
    const load = async () => {
      setLoadingPosts(true);
      const [fetchedPosts, count] = await Promise.all([
        getPosts(),
        getMemberCount(),
      ]);
      setPosts(fetchedPosts);
      setMemberCount(count);
      setLoadingPosts(false);
    };
    load();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;
    setSubmitting(true);
    const created = await createPost(user.id, newPost.trim());
    if (created) {
      setPosts(prev => [created, ...prev]);
    }
    setNewPost('');
    setSubmitting(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    const nowLiked = await toggleLike(postId, user.id);
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        likes: nowLiked
          ? [...p.likes, user.id]
          : p.likes.filter(id => id !== user.id),
      };
    }));
  };

  const handleComment = async (postId: string, text: string) => {
    if (!user) return;
    const comment = await addComment(postId, user.id, text);
    if (comment) {
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...p.comments, comment] };
      }));
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-navy py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-gold" />
            <div>
              <h1 className="font-heading text-2xl font-bold text-gold-light">Community Hub</h1>
              <p className="text-gold-light/60 text-sm">Connect, share, and grow with fellow members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* My Profile card */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <AvatarBadge initials={user?.avatar || '?'} size="lg" />
                <div>
                  <p className="font-heading font-bold text-navy dark:text-gold-light">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.country || 'Member'}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border pt-3">
                Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'Today'}
              </div>
            </div>

            {/* Community stats */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="font-heading font-semibold text-navy dark:text-gold-light text-sm">Community Stats</h3>
              {[
                { icon: Users, label: 'Members', value: `${memberCount}` },
                { icon: TrendingUp, label: 'Posts', value: `${posts.length}` },
                { icon: Globe, label: 'Countries', value: '12+' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><s.icon className="h-4 w-4 text-gold" />{s.label}</span>
                  <span className="font-bold text-navy dark:text-gold-light">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-secondary/30 rounded-xl border border-border p-4 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-navy dark:text-gold-light mb-1">Community Guidelines</p>
              Be kind, respectful, and constructive. Share health tips, ask questions, and uplift one another. No spam or harmful content.
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-2 space-y-5">
            {/* Composer */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex gap-3">
                <AvatarBadge initials={user?.avatar || '?'} />
                <form onSubmit={handlePost} className="flex-1 space-y-3">
                  <Textarea ref={textRef} value={newPost} onChange={e => setNewPost(e.target.value)}
                    placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}? Share a health tip, encouragement, or question...`}
                    rows={3} className="resize-none bg-secondary/20" />
                  <div className="flex justify-end">
                    <Button variant="gold" size="sm" type="submit" disabled={!newPost.trim() || submitting}
                      className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" /> {submitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Loading state */}
            {loadingPosts && (
              <div className="text-center py-12">
                <div className="h-8 w-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Loading community posts...</p>
              </div>
            )}

            {/* Posts */}
            {!loadingPosts && posts.length === 0 && (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No posts yet</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to share something with the community!</p>
              </div>
            )}

            {!loadingPosts && posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={user?.id || ''}
                onLike={handleLike} onComment={handleComment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
