import { supabase } from './supabase';
import type { Post as DbPost, Comment as DbComment, Profile } from './database.types';

// ─── App-level types (keeping the same shape the UI expects) ────────────────

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCountry?: string;
  content: string;
  timestamp: string;
  likes: string[];       // array of user IDs who liked
  comments: Comment[];
}

// ─── Data fetching ──────────────────────────────────────────────────────────

/** Fetch all posts with their profiles, comments, and likes */
export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles!posts_author_id_fkey ( id, name, avatar, country ),
      comments ( id, author_id, content, created_at, profiles!comments_author_id_fkey ( name, avatar ) ),
      likes ( user_id )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch posts:', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.name || 'Unknown',
    authorAvatar: row.profiles?.avatar || '?',
    authorCountry: row.profiles?.country || '',
    content: row.content,
    timestamp: row.created_at,
    likes: (row.likes || []).map((l: any) => l.user_id),
    comments: (row.comments || [])
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((c: any) => ({
        id: c.id,
        authorId: c.author_id,
        authorName: c.profiles?.name || 'Unknown',
        authorAvatar: c.profiles?.avatar || '?',
        content: c.content,
        timestamp: c.created_at,
      })),
  }));
};

/** Create a new post */
export const createPost = async (authorId: string, content: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, content })
    .select(`
      *,
      profiles!posts_author_id_fkey ( id, name, avatar, country ),
      comments ( id, author_id, content, created_at, profiles!comments_author_id_fkey ( name, avatar ) ),
      likes ( user_id )
    `)
    .single();

  if (error) {
    console.error('Failed to create post:', error.message);
    return null;
  }

  const row = data as any;
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.name || 'Unknown',
    authorAvatar: row.profiles?.avatar || '?',
    authorCountry: row.profiles?.country || '',
    content: row.content,
    timestamp: row.created_at,
    likes: [],
    comments: [],
  };
};

/** Toggle like on a post (insert or delete) */
export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
  // Check if already liked
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    // Unlike
    await supabase.from('likes').delete().eq('id', existing.id);
    return false; // now unliked
  } else {
    // Like
    await supabase.from('likes').insert({ post_id: postId, user_id: userId });
    return true; // now liked
  }
};

/** Add a comment to a post */
export const addComment = async (
  postId: string,
  authorId: string,
  content: string,
): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, content })
    .select(`*, profiles!comments_author_id_fkey ( name, avatar )`)
    .single();

  if (error) {
    console.error('Failed to add comment:', error.message);
    return null;
  }

  const row = data as any;
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.name || 'Unknown',
    authorAvatar: row.profiles?.avatar || '?',
    content: row.content,
    timestamp: row.created_at,
  };
};

/** Get total post count */
export const getPostCount = async (): Promise<number> => {
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });
  return count || 0;
};

// ─── Utilities (kept from original) ─────────────────────────────────────────

export const formatTimeAgo = (ts: string): string => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};
