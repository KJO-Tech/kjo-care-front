import { Blog } from '../models/blog';
import { UserInfo } from './user-http.interface';

export interface BlogsPublishedResponse {
  content: BlogResponse[];
  page: number;
  size: number;
}

export interface BlogResponse {
  blog: Blog;
  reactionCount: number;
  commentCount: number;
}

export interface BlogDetailResponse {
  blog: Blog;
  reactionCount: number;
  commentCount: number;
  comments: CommentSummary[];
  accesible: boolean;
}

export interface CommentSummary {
  id: string;
  userId: UserInfo;
  content: string;
  date: string;
  commentDate: string;
  modifiedDate: string;
  childrenComments: CommentSummary[];
}

export interface ReactionResponse {
  blogId: string,
  userId: UserInfo,
  type: string,
  reactionDate: string
}
