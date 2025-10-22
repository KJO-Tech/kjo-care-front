export interface Notification extends NotificationResponse {
  recipientUserId: string;
  actorUserId: string;
  sourceEventId: string;
  metadata: string;
}


export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}


export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MOOD_ALERT = 'MOOD_ALERT',
  NEW_BLOG = 'NEW_BLOG',
  BLOG_REJECTED = 'BLOG_REJECTED',
}
