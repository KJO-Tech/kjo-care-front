export interface CommentRequest {
  id: string;
  content: string;
  blogId: string;
  commentParentId: string | null;
}

export interface CommentResponse {
  id: string;
  blogId: number;
  userId: number;
  content: string;
  commentDate: string;
  modifiedDate: string;
  commentParentId: number;
}
