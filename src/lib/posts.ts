export interface Comment {
  id: string; authorId: string; authorName: string;
  authorAvatar: string; content: string; timestamp: string;
}

export interface Post {
  id: string; authorId: string; authorName: string;
  authorAvatar: string; authorCountry?: string;
  content: string; timestamp: string;
  likes: string[]; comments: Comment[];
}

const POSTS_KEY = 'ec_posts';

const SEED_POSTS: Post[] = [
  {
    id: 'seed_1', authorId: 'admin', authorName: 'Enlighten Community',
    authorAvatar: 'EC', authorCountry: 'Nigeria',
    content: '🌟 Welcome to the Enlighten Community Hub!\n\nThis is our safe space to share wisdom, ask questions, and support one another in health, leadership, and life.\n\nFrom sickness to wellness, from fear to faith, from problems to solutions and from consumption to production! 🙏\n\n#EnlightenCommunity #Health #Wellness',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    likes: ['u1', 'u2', 'u3', 'u4'],
    comments: [{
      id: 'c1', authorId: 'u1', authorName: 'Sarah Jenkins',
      authorAvatar: 'SJ', content: 'So glad to be here! Already feeling inspired. 🙌',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    }],
  },
  {
    id: 'seed_2', authorId: 'u2', authorName: 'Dr. Emmanuel Obi',
    authorAvatar: 'EO', authorCountry: 'Nigeria',
    content: '💊 HEALTH TIP OF THE DAY:\n\nDrinking warm water with lemon first thing in the morning can boost your immune system, aid digestion, and help detoxify your body.\n\nSmall habits. Big results. 💪\n\n#HealthyLiving #NaturalHealth',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    likes: ['u1', 'u3'], comments: [],
  },
  {
    id: 'seed_3', authorId: 'u3', authorName: 'Adaeze Nwosu',
    authorAvatar: 'AN', authorCountry: 'Nigeria',
    content: 'Just finished watching the stress management video from our Wellness Library — absolutely transformative! Already started the breathing exercises. Thank you Enlighten Community for making this FREE for everyone. ❤️',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: ['u1', 'u2', 'u4'],
    comments: [{
      id: 'c2', authorId: 'u4', authorName: 'Michael Bassey',
      authorAvatar: 'MB', content: 'Which breathing exercise? The box breathing is incredible!',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    }],
  },
];

export const getPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (!stored) { localStorage.setItem(POSTS_KEY, JSON.stringify(SEED_POSTS)); return SEED_POSTS; }
    return JSON.parse(stored);
  } catch { return SEED_POSTS; }
};

const savePosts = (posts: Post[]) => localStorage.setItem(POSTS_KEY, JSON.stringify(posts));

export const createPost = (authorId: string, authorName: string, authorAvatar: string, authorCountry: string, content: string): Post => {
  const newPost: Post = {
    id: `p_${Date.now()}`, authorId, authorName, authorAvatar, authorCountry,
    content, timestamp: new Date().toISOString(), likes: [], comments: [],
  };
  const updated = [newPost, ...getPosts()];
  savePosts(updated);
  return newPost;
};

export const toggleLike = (postId: string, userId: string): Post[] => {
  const updated = getPosts().map(p => {
    if (p.id !== postId) return p;
    const liked = p.likes.includes(userId);
    return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
  });
  savePosts(updated);
  return updated;
};

export const addComment = (postId: string, authorId: string, authorName: string, authorAvatar: string, content: string): Post[] => {
  const updated = getPosts().map(p => {
    if (p.id !== postId) return p;
    const c: Comment = { id: `c_${Date.now()}`, authorId, authorName, authorAvatar, content, timestamp: new Date().toISOString() };
    return { ...p, comments: [...p.comments, c] };
  });
  savePosts(updated);
  return updated;
};

export const formatTimeAgo = (ts: string): string => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`; return `${d}d ago`;
};
