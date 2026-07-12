export type PostType = 'DISCUSSION' | 'QUESTION' | 'SHOWCASE' | 'GUIDE';
export type VoteDirection = 'UP' | 'DOWN';

export interface CommunityPostAuthor {
  id: string;
  name: string;
  role: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  type: PostType;
  title: string;
  body: string;
  tags: string[];
  mediaUrls: string[];
  isPinned: boolean;
  isLocked: boolean;
  upvotes: number;
  downvotes: number;
  views: number;
  author?: CommunityPostAuthor;
  _count?: { comments: number };
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostListResponse {
  items: CommunityPost[];
  total: number;
  page: number;
  limit: number;
}

export interface CommunityPostFilters {
  type?: PostType;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePostData {
  type: PostType;
  title: string;
  body: string;
  tags?: string[];
  mediaUrls?: string[];
}

export interface UpdatePostData {
  id: string;
  title?: string;
  body?: string;
}

export interface VotePostData {
  postId: string;
  direction: VoteDirection;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  parentId: string | null;
  upvotes: number;
  downvotes: number;
  author?: CommunityPostAuthor;
  replies?: CommunityComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  items: CommunityComment[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentListFilters {
  postId: string;
  page?: number;
  limit?: number;
}

export interface CreateCommentData {
  postId: string;
  body: string;
  parentId?: string;
}

export interface VoteCommentData {
  commentId: string;
  direction: VoteDirection;
}
